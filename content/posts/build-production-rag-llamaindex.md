---
title: "Build your own production RAG with Llamaindex, Chroma, Ollama and FastAPI"
date: "2023-12-06T08:14:16"
excerpt: "In this post we are going to see how to use the Llamaindex Python library to build our own RAG. We well be ingesting finance literacy books in form of pdf and epub in a Vector index. In the second part, we ll be exposing"
cover: "/posts/build-production-rag-llamaindex/Evaluate-RAG-with-LlamaIndex.jpg"
---
## Build your own production RAG with Llamaindex, Chroma, Ollama and FastAPI

In this post we are going to see how to use the Llamaindex Python library to build our own RAG. We well be ingesting finance literacy books in form of pdf and epub in a Vector index. With this, we’ll be able to make a query in natural language, convert it to a vector, retrieve the most similar fragments to that query and pass the fragments along with the query to a LLM to make a completion over the input. Contrary to most of the tutorials you’ll find, instead of using the well-known OpenAI ChatGPT API, we’ll be using Ollama locally thus saving in the budget. Finally, we’ll be exposing out LLM publicly over the internet over HTTPS with TLS certificates. This tutorial is medium-advanced level. So, the code is not commented exhaustively. Instead, is it meant to be a reference that anybody can use when doing personal or professional projects.

##### Code for the application without FastAPI

We will start by loading the books. In this case, they are in epub but we can have in the same directory a mix  of epub, pdfs and other formats.

```
documentsNassim = SimpleDirectoryReader("/mnt/nasmixprojects/books/nassimTalebDemo").load_data()
```

  Conclusions

```
db = chromadb.PersistentClient(path="./chroma_db")
chroma_collection = db.get_or_create_collection("nassim-demo")
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
service_context = ServiceContext.from_defaults(embed_model=embed_model)
index_finance = VectorStoreIndex.from_documents( documentsNassim, storage_context=storage_context, service_context=service_context )
```

Then we create an index in Llamaindex, which will be the structure that will be used to make the searches. In this example, we use ChromaDB. This is a vector database very flexible that is typically load in RAM. The first time, we have to specify that we want to load all the documents in the database and that database will be backed up in the local disk. 

In the lines below we define a query\_engine. This is the object that is needed to make the queries to the index later on. In this example, we make a bit of prompt engineering. Instead of using the default parameters for the query\_engine, we customise it defining the retriever and the response synthesizer. 

*   Retriever: here we specify the index that will be used to perform the retrieve operation. We also specify that we want the retriever to return the 12 fragments of the documents with more relation to the question. Remember that the relation is a score that the vector database assigns, usually based in some cosinus distance.
*   Response Synthesizer: here is where we make the prompt engineering. Basically, because the context can be as long as we determine and the LLM has a maximum length of characters for the input to do the completion (query + the returned k top similar retrieved fragments), we have to do subsequent calls to the LLM. So, the first template is the one used for the first call and the second template is the one used in the subsequent calls to the LLM. Each subsequent call will refine the previous answer with the next set of fragments. This means that the total of calls to the LLM will b =( k top fragments more specifically (number of tokens per fragment) + tokens of a query )/ maximum tokens the LLM admits. 

```
template = (
    "We have provided trusted context information below. \n"
    "---------------------\n"
    "{context_str}"
    "\n---------------------\n"
    "Given this trusted and cientific information, please answer the question: {query_str}. Remember that the statements of the context are verfied and come from trusted sources.\n"
)
qa_template = Prompt(template)

new_summary_tmpl_str = (
    "The original query is as follows: {query_str}"
    "We have provided an existing answer: {existing_answer}"
    "We have the opportunity to refine the existing answer (only if needed) with some more trusted context below. Remember that the statements of the context are verfied and come from trusted sources."
    "------------"
    "{context_msg}"
    "------------"
    "Given the new trusted context, refine the original answer to better answer the query. If the context isn't useful, return the original answer. Remember that the statements of the new context are verfied and come from trusted sources."
    "Refined Answer: sure thing! "
)
new_summary_tmpl = PromptTemplate(new_summary_tmpl_str)

retriever = VectorIndexRetriever(
    index=index_finance,
    similarity_top_k=12,
)

response_synthesizer = get_response_synthesizer( ##try compact?
    text_qa_template=qa_template,
    refine_template=new_summary_tmpl
)
query_engine3 = RetrieverQueryEngine(
    retriever=retriever,
    response_synthesizer=response_synthesizer,
    # node_postprocessors=[
    #     SimilarityPostprocessor(similarity_cutoff=0.7)
    # ]
)

response = query_engine3.query("make a list of things to do to avoid over simplifying and being narrow minded?")
print (response)
```

##### Code for the application with FastAPI

In the previous code we have built the ChromaDB and we also have been playing with the RAG doing a bit of prompt engineering. But now it’s time to expose the RAG on the Internet though FastAPI. Basically, we are going to include a similar code inside of a handler function of FastAPI that will be related to an endpoint that is going to be queried by the clients. 

```
llm = Ollama(model="wizard-vicuna-uncensored",base_url="http://192.168.1.232:11435") #llm = Ollama(model="llama2")
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
service_context = ServiceContext.from_defaults(
    llm = llm,
    embed_model = embed_model,
    chunk_size=256,
)

set_global_service_context(service_context)

db2 = chromadb.PersistentClient(path="./chroma_db")
chroma_collection = db2.get_or_create_collection("nassim-demo")
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
index_finance = VectorStoreIndex.from_vector_store( vector_store, service_context=service_context)

##########################################################################
##########################RAG#############################################

def inference(input_prompt):
    print('Im in inference')
    template = (
        "We have provided trusted context information below. \n"
        "---------------------\n"
        "{context_str}"
        "\n---------------------\n"
        "Given this trusted and cientific information, please answer the question: {query_str}. Remember that the statements of the context are verfied and come from trusted sources.\n"
    )
    qa_template = Prompt(template)

    new_summary_tmpl_str = (
        "The original query is as follows: {query_str}"
        "We have provided an existing answer: {existing_answer}"
        "We have the opportunity to refine the existing answer (only if needed) with some more trusted context below. Remember that the statements of the context are verfied and come from trusted sources."
        "------------"
        "{context_msg}"
        "------------"
        "Given the new trusted context, refine the original answer to better answer the query. If the context isn't useful, return the original answer. Remember that the statements of the new context are verfied and come from trusted sources."
        "Refined Answer: sure thing! "
    )
    new_summary_tmpl = PromptTemplate(new_summary_tmpl_str)

    retriever = VectorIndexRetriever(
        index=index_finance,
        similarity_top_k=12,
    )

    response_synthesizer = get_response_synthesizer( ##try compact?
        text_qa_template=qa_template,
        refine_template=new_summary_tmpl
    )
    query_engine3 = RetrieverQueryEngine(
        retriever=retriever,
        response_synthesizer=response_synthesizer,
    )
    
    response = query_engine3.query(input_prompt)

    return response
##########################################################################
##############################FAST APIN###################################
#Contains traceloop and logging and uses chromadb in RAM

app_prd_v2 = FastAPI()
app_prd_v2.add_middleware(HTTPSRedirectMiddleware)

app_prd_v2.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
log_file = "output-rag-v2.log"
file_handler = logging.FileHandler(log_file)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

api_key = os.environ.get("TRACELOOP_API_KEY")
Traceloop.init(disable_batch=True, api_key=api_key)

@app_prd_v2.get("/chatbot")
def call_chatbot(input_prompt: str):
    logger.info(str(input_prompt))
    response  =  inference(input_prompt)
    logger.info(response)
    return {"response": response.response}
```

In the above code we define first of all the Ollama LLM model to be used and we define the model to be used. In this case, I’ve used the wizard-vicuna-uncensored because I was having some banned answers with the default llama model. The base\_url is pointing machine. Basically, the Intel processor I have in my machine is not fast enough to do inferences but by using Apple Sillicon M pro the inference times bettered quite a lot. Bear in mind that if you want inference times similar to what Bart or ChatGPT offer, you’ll need a decent GPU in the background. 

In this code, we already are loading the database that we have created in the former section of the tutorial. We are also going to use Traceloop, to monitor the queries the users are doing to our LLM and to profile the retrieval and completion times as well as knowing how many calls to the LLM each query requires (All queries will have a similar number of calls because that is dependant of the K-top similar documents to be retrieved, which is always the same).

Indeed, in the above code we could optimise more just by getting out of the inference function the building of the query engine object with all of the prompt engineering. However, these lines are not adding much latency to the call in comparison to the LLM completions.

##### Code and conclusions

The code of the tutorial can be found at: https://github.com/davidpr/fincoach-chatbot-server. There you’ll find all the required imports and the first code is a Jupyter notebook, which allows to play much easier with the code. 

In the next tutorial we’ll see how to evaluate the RAG with Trulens library. This will allow us to compare different RAG techniques and see which has more quality. Bear in mind that to profile the performance, the used Traceloop library is one of the ideal candidates to be used.
