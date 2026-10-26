---
title: "The 0.01% Guide to AI Infrastructure: Understanding LLM Internals and GPU Execution"
date: "2026-05-06T09:00:00"
excerpt: "Generative AI platforms like ChatGPT, Perplexity, and Gemini have become ubiquitous, fundamentally transforming the modern technological landscape. Across industries, enterprises are deploying AI at an unprecedented…"
topics: ["AI & LLMs"]
cover: "/posts/linkedin-ai-infrastructure-guide/cover.jpg"
---
*Originally published on [LinkedIn](https://www.linkedin.com/pulse/001-guide-ai-infrastructure-understanding-llm-gpu-david-prat-robles-hr5te/).*

*Revised on 26 October 2026: the model dimensions, file layout and hardware figures now match the official GPT-oss 120B configuration and the DGX H200 specifications, and the role of Megatron Bridge is clarified. The illustrations were generated with AI tools and simplify the model; where their numbers differ from the text, the text is correct.*

Generative AI platforms like [ChatGPT](https://chatgpt.com/), [Perplexity](https://www.perplexity.ai/), and [Gemini](https://gemini.google.com/) have become ubiquitous, fundamentally transforming the modern technological landscape. Across industries, enterprises are deploying AI at an unprecedented scale, integrating Large Language Models ([LLMs](https://en.wikipedia.org/wiki/Large_language_model)) into complex data pipelines and establishing sophisticated [MLOps](https://en.wikipedia.org/wiki/MLOps) practices. Today, specialized tech organizations are fine-tuning foundational models to tackle domain-specific challenges in healthcare, law, and finance, while developers globally have embraced AI-powered coding interfaces to accelerate their workflows.

Yet, despite this massive wave of adoption, a critical knowledge gap remains. For most, the underlying mechanics of these systems are treated as a black box. Very few professionals truly grasp the internal intricacies of LLM architecture—such as embedding spaces, multi-head attention, and Mixture of Experts ([MoE](https://en.wikipedia.org/wiki/Mixture_of_experts)) routing. Even fewer understand the complex AI infrastructure required to load these massive models into GPU clusters for optimized inference.

This article bridges that gap. By breaking down the complete lifecycle—from how text tokens are processed in neural network layers to how matrix multiplications are executed at the hardware level—this guide will demystify the system architecture. By the end, you will join the 0.01% of professionals who truly understand the robust engineering and infrastructure that makes modern AI possible.

### From Theory to Silicon: Introducing GPT-oss 120B

This article breaks down how a reference large language model such as [GPT-oss 120B](https://huggingface.co/openai/gpt-oss-120b) works, from its internal Transformer architecture to the way it is packaged, stored, loaded from disk, and executed on GPU compute infrastructure.

It is aimed at readers who already have a basic understanding of LLMs, although anyone with a general technical background should be able to follow by reviewing a few concepts as they go.

GPT-oss 120B is built on a Transformer architecture that combines attention mechanisms with a Mixture of Experts (MoE) design. It has 116.8 billion parameters in total, but only about 5.1 billion are active for each token: instead of engaging the full network, the model selectively activates a few specialized experts, which makes inference far cheaper than the parameter count suggests.

![The GPT-oss 120B model architecture](/posts/linkedin-ai-infrastructure-guide/figure-01.png)

The GPT-oss 120B model architecture

### Step 1: Tokenization and Embeddings

Before the model can process text, it must convert human language into a mathematical format. The input sentence is divided into discrete segments called tokens (whole words or pieces of words), each with a numerical ID from a vocabulary of about 201,000 entries. An embedding table then maps each ID to a dense vector—in this architecture, an array of 2,880 numbers per token. This vector is the model's starting representation of the token's meaning before it enters the computational pipeline.

### Step 2: The Transformer Layers

The core engine of the model is a sequential tower of 36 transformer layers where the actual "reasoning" occurs. As the token embeddings pass through each layer sequentially, they accumulate deeper contextual understanding through three primary mechanisms:

- Multi-Head Attention: Each layer uses 64 parallel "attention heads" to analyze relationships across the sequence. To save memory, the heads share 8 sets of keys and values (grouped-query attention), and the layers alternate between attending to the full context and to a sliding window of the last 128 tokens. Different heads tend to specialize, for example in grammatical structure, in resolving pronouns, or in retrieving factual associations.
- Mixture of Experts (MoE) Routing: To optimize GPU compute efficiency, the layer uses a router that scores the token and activates only the top 4 out of 128 specialized "expert" networks. This sparse activation ensures that only the most relevant neural pathways are computed.
- Expert Internal Workflow: Inside each selected expert, the data undergoes two matrix multiplications. The 2,880-dimensional vector is projected into two vectors of the same size (the "gate" and the "up" projections), combined through a SwiGLU activation function, and projected back to 2,880 dimensions. GPT-oss experts are deliberately narrow: the model's capacity comes from having many experts, not wide ones. Residual connections around the attention and MoE blocks, and RMS normalization before each of them, keep the computation stable across the deep network.

### Step 3: The Language Model Head

After the token vector has traversed all 36 layers, the highly enriched mathematical representation reaches the final stage: the Language Model (LM) Head. This component translates the 2,880-dimensional vector back into human language by calculating next-token probabilities. It outputs a probability distribution across the model's entire vocabulary, from which the system selects the next token to generate.

### Mapping Architecture to Disk: The Safetensors Format

![Safetensors and disk storage](/posts/linkedin-ai-infrastructure-guide/figure-02.png)

Safetensors and disk storage

Understanding the abstract architecture of GPT-oss 120B is only half the equation. To deploy the model, those mathematical structures must be serialized and stored on physical media (NVMe/SSDs). Modern LLMs use the Safetensors format, which stores tensors in a simple, safe layout that can be memory-mapped and read without copying, so that loading is fast. Because the checkpoint is tens of gigabytes, it is split, or "sharded," into several files that are easier to download, store and load in parallel.

### The Storage Sharding Strategy

When you download an LLM to disk, you are downloading a directory of these Safetensors shards plus an index. For GPT-oss 120B, the official checkpoint on Hugging Face has 15 shard files of roughly 4 to 4.6 GB each:

- Size-Based Shards: The files (model-00000-of-00014.safetensors through model-00014-of-00014.safetensors) are cut by size, not by layer, so a shard can hold parts of several layers. For example, the tensors of layer 0 live in model-00009, and the embedding table and LM head live in model-00012.
- The Index File: model.safetensors.index.json maps each of the checkpoint's 687 tensors to the shard that contains it, so a loader can find, for instance, model.layers.0.self\_attn.q\_proj.weight without opening every file.
- Total Storage Footprint: The expert weights, which hold most of the parameters, are quantized to MXFP4 (4-bit values with shared scales), while attention, router, embedding and LM head weights stay in BF16. As a result, the whole checkpoint takes about 65 GB on disk, small enough to fit on a single 80 GB GPU.

### Exploded View: Inside a Single Layer

If we inspect the tensors that belong to a single layer (such as layer 0), we find the raw matrices required for GPU compute:

- Self-Attention Matrices: The Query (Q) projection is a 2,880 × 4,096 matrix (64 heads of 64 dimensions each). The Key (K) and Value (V) projections are much smaller, 2,880 × 512 each, because they serve only 8 shared key-value heads. The Output (O) projection maps the 4,096 attention dimensions back to 2,880. The layer also stores learned "attention sinks" and the biases of each projection.
- MoE FFN Weights: The router is a small 2,880 × 128 matrix that scores the 128 experts. The weights of all 128 experts are stored together in two large fused tensors (gate/up and down projections), as MXFP4 blocks plus their scales.
- Normalization Weights: Two small vectors hold the RMS normalization weights applied before attention and before the MoE block.

Because Safetensors files can be memory-mapped, a loader can read exactly the tensors, or slices of tensors, that each GPU needs, instead of deserializing whole files into RAM. For inference, all 36 layers are loaded into GPU memory once, when the server starts.

### The Inference and Training Pipeline: From Storage to Silicon

![Single-node inference pipeline](/posts/linkedin-ai-infrastructure-guide/figure-03.png)

Single-node inference pipeline

Having mapped the LLM architecture into Safetensors shards on disk, the next infrastructure challenge is moving those weights into the execution environment. The loading path described here is the same for inference and for training; training then needs much more GPU memory for gradients, optimizer states and activations. In both cases a carefully orchestrated pipeline moves data from slow non-volatile storage into ultra-fast GPU memory, and ultimately into the compute cores.

### Loading the Weights: From Disk to GPU

The journey begins at the NVMe/SSD storage level. The CPU reads the Safetensors shards into system RAM (or memory-maps them), and the weights are then copied into GPU memory. For a large model spread over several GPUs, simply copying the files is not enough: each GPU must receive exactly its share of the weights.

- Parallelism-Aware Loading: The software that owns the GPUs decides which tensor, or which slice of it, each GPU gets, according to the tensor, pipeline and expert parallelism settings described later. For inference, the serving engine does this itself: vLLM reads the Hugging Face Safetensors checkpoint directly and shards it as it loads. For training and fine-tuning, frameworks like [NVIDIA Megatron Bridge](https://docs.nvidia.com/nemo/megatron-bridge/latest/) convert the Hugging Face checkpoint into Megatron Core's format and distribute it according to the chosen parallelism layout.
- PCIe 5.0 Transfer: The weights are copied from host memory to the GPU over the PCIe 5.0 bus, which offers about 64 GB/s in each direction on an x16 link. Technologies like NVIDIA GPUDirect Storage can even move data from NVMe to GPU memory without passing through the CPU's RAM. This transfer happens once, at startup: during inference the weights stay in GPU memory, and PCIe is no longer on the path of each token.

### Weight Buffering in HBM3e VRAM

Once across the PCIe bus, the model data lands in the GPU's High Bandwidth Memory (HBM3e VRAM).

- Layer-Wise Organization: The VRAM acts as a massive weight buffer, holding the parameters for all 36 Transformer layers (or, with several GPUs, each GPU's share of them).
- Matrix Storage: Inside this buffer, the data is structured into the specific projection matrices required for inference—such as the Q/K/V/O attention projections (2,880 × 4,096 for Q, 2,880 × 512 for K and V) and the expert projections (2,880 → 2 × 2,880 → 2,880). The MXFP4 expert weights stay in 4-bit form in memory and are dequantized on the fly by the compute kernels.
- KV Cache: The rest of the VRAM is reserved for the KV cache, the keys and values of every token already processed, which the attention layers reuse at each new step.

### Execution: L2 Cache to Streaming Multiprocessors (SMs)

VRAM is fast, but execution requires the data to be placed as close to the compute units as possible. To generate each new token, the GPU reads the weights it needs (every attention matrix plus the 4 selected experts in each layer) from VRAM through the L2 cache.

- The L2 to SM Path: From the L2 cache, weight tiles and input data are dispatched to the Streaming Multiprocessors (SMs), 132 of them on an H200.
- CUDA and Tensor Cores: Inside the SM, the data moves through shared memory and L1 cache into the register files. The actual mathematical heavy lifting is handed off to the Tensor Cores. These specialized units execute massive matrix multiplications (MATMUL). They take the input data matrix (A), multiply it by the weight matrix (B), and produce the output matrix (C)—performing the fundamental calculations that drive the Transformer's attention mechanisms and experts.

Loading from NVMe through RAM and PCIe into VRAM happens once. What sustains real-time generation is the per-token path: VRAM, through the caches, into the Tensor Cores. Generating a token mostly means reading weights, so it is limited by memory bandwidth (4.8 TB/s on an H200) more than by compute. This is also why MoE pays off: with only about 5.1 billion active parameters, each token needs to read a small fraction of the model.

### Scaling Up: Multi-GPU Inference on an NVIDIA DGX H200 Node

![Multi-GPU inference pipeline (DGX H200)](/posts/linkedin-ai-infrastructure-guide/figure-04.png)

Multi-GPU inference pipeline (DGX H200)

While the internal architecture of an LLM and the loading process into a single GPU are complex, running a model like GPT-oss 120B in production usually means scaling across multiple GPUs. Its 65 GB of weights fit on one 80 GB GPU, but that leaves little room for the KV cache of many concurrent users, and a single GPU limits both throughput and latency. Larger models simply do not fit on one card. To solve this, enterprise architectures rely on nodes like the NVIDIA DGX H200, which houses 8 high-performance GPUs (H200 SXM5 modules) working as a single unified engine.

### Breaking Down the Workload: Parallelism Strategies

To make 8 GPUs act as one, the model's workload and memory must be divided. The two primary strategies to distribute the parameters of GPT-oss 120B are Tensor Parallelism and Pipeline Parallelism; a third, Expert Parallelism, is specific to MoE models and is covered further below.

1. Tensor Parallelism (TP): Splitting the Math. Instead of giving one GPU the entire matrix multiplication task, Tensor Parallelism slices each weight matrix across the GPUs.

- Take the Q projection, with its 64 attention heads (4,096 output columns). With TP = 8, each GPU gets 8 heads: GPU 0 handles columns 0–511, GPU 1 handles columns 512–1,023, and so on. The 8 key-value heads are split the same way, one per GPU.
- Each GPU computes its fraction of the math simultaneously.
- Once computed, the GPUs must share their partial results to construct the final answer, typically twice per layer (after attention and after the MoE block). This requires an incredibly fast inter-GPU network.

2. Pipeline Parallelism (PP): An Assembly Line for Layers. While TP slices the matrices, Pipeline Parallelism divides the sequence of the model's 36 layers across different GPUs, creating a sequential assembly line.

- For example, with 4 stages of 2 GPUs each, GPUs 0 and 1 might be responsible for Layers 0–8 (Stage 1).
- Once they finish processing a token through those layers, they pass the data to GPUs 2 and 3, which handle Layers 9–17 (Stage 2), and so on until GPUs 6 and 7 handle Layers 27–35 (Stage 4).
- This ensures that no single GPU has to store all 36 layers in its VRAM, drastically reducing the memory burden per card.

### Advanced Deep Dive (Optional Reading): The Synergy of Tensor and Pipeline Parallelism

When you combine Tensor Parallelism (TP) and Pipeline Parallelism (PP)—often called "3D Parallelism" when combined with Data Parallelism—they work together in a grid-like fashion.

Imagine you have an 8-GPU node and you configure it with:

- Pipeline Parallelism (PP) = 2 stages (Splitting the layers into 2 groups)
- Tensor Parallelism (TP) = 4 shards (Splitting the matrices within those layers into 4 chunks)

Here is exactly how the GPUs are assigned:

1. Stage 1 of the Pipeline (Layers 0–17): This entire block of layers is assigned to a "TP Group" consisting of GPUs 0, 1, 2, and 3.
2. Stage 2 of the Pipeline (Layers 18–35): This second block of layers is assigned to the second "TP Group" consisting of GPUs 4, 5, 6, and 7.

### The Flow of Execution

As data moves through the system, here is what happens:

- The raw token enters GPUs 0, 1, 2, and 3. They work together (TP) to process the token through Layers 0–17.
- Because these GPUs only hold Layers 0–17 in their VRAM, they cannot finish the token.
- Once Layer 17 is complete, the intermediate result (the activations) is passed over the network from the first group (GPUs 0–3) to the second group (GPUs 4–7). This handoff is the Pipeline Parallelism.
- GPUs 4, 5, 6, and 7 then take that intermediate data and work together (TP) to process it through Layers 18–35 to generate the final output.

### Why do both?

Tensor Parallelism requires GPUs to talk to each other constantly (several times per layer) to share partial matrix math results. This requires extreme bandwidth, which is why it is almost always kept inside a single server, over NVLink.

Pipeline Parallelism only requires GPUs to talk to each other at the boundary between stages (just passing the result of Layer 17 to Layer 18). Because the communication requirement is much lower, PP is often used to bridge across different servers (e.g., Server A handles the first half of the model, Server B handles the second half).

By combining them, you keep the ultra-fast TP math confined to GPUs physically wired together, while using PP to scale the model's depth across more hardware without causing a massive network bottleneck.

### The NVLink Fabric: The Backbone of Synchronization

Because Tensor Parallelism requires constant sharing of partial results, traditional PCIe connections are far too slow. This is where the [NVLink](https://www.nvidia.com/en-us/data-center/nvlink/) fabric becomes critical.

- The DGX H200 connects all 8 GPUs through fourth-generation NVLink and NVSwitch chips, giving each GPU 900 GB/s of bidirectional bandwidth to any other GPU in the node, about 7 times what PCIe 5.0 offers. (The fifth generation, at 1.8 TB/s per GPU, arrived with the Blackwell GPUs.)
- When the GPUs complete their sliced matrix math, they execute an "All-Reduce" synchronization. The NVLink fabric lets them pool their partial results (TP shards) in microseconds, finalize the computation for that layer, and prepare the data for the next step.

### VRAM Layout and Distributed MoE

Inside each of the 8 H200 GPUs, the 141 GB of HBM3e VRAM is carefully partitioned. A portion holds the embeddings, another holds the sharded layer matrices assigned to that GPU, and a large segment is reserved for the KV Cache (which remembers the context of each user's conversation).

Furthermore, the Mixture of Experts (MoE) architecture scales well in this environment through Expert Parallelism (EP). Instead of storing all 128 experts on every GPU, the experts are distributed across the node, 16 per GPU with 8 GPUs. When the router determines which 4 experts a token needs, the token's data is sent over the NVLink fabric to the GPUs that hold those experts (an "all-to-all" exchange), computed there in parallel, and gathered back.

By mastering this orchestration—loading weights over PCIe, splitting math via Tensor Parallelism, dividing layers via Pipeline Parallelism, distributing experts via Expert Parallelism, and synchronizing at hundreds of gigabytes per second over NVLink—systems architects can deploy 120-billion-parameter models that stream each new token in a few milliseconds.

### Enter vLLM: The Software Engine for High-Throughput Inference

![Production-scale inference serving with vLLM](/posts/linkedin-ai-infrastructure-guide/figure-05.png)

Production-scale inference serving with vLLM

So far, this article has focused on the physical and architectural journey of the model—how GPT-oss 120B is stored in Safetensors, loaded across the PCIe bus, held in HBM3e VRAM, and distributed across 8 GPUs via Tensor, Pipeline and Expert Parallelism.

However, hardware alone does not make a production-ready AI service. To serve thousands of users simultaneously, at the scale of services like ChatGPT or Perplexity, you need highly optimized software to manage the traffic, memory, and queuing of incoming requests. This is where [vLLM](https://vllm.ai/) comes in. vLLM is a state-of-the-art, open-source inference server designed to squeeze the maximum throughput out of the GPU hardware we just discussed.

### Key vLLM Optimizations

The image highlights several critical software optimizations that vLLM applies on top of the physical infrastructure:

- [PagedAttention](https://docs.vllm.ai/en/latest/design/paged_attention/): This is vLLM's core innovation. In a standard setup, GPUs waste massive amounts of VRAM by pre-allocating contiguous memory blocks for the "KV Cache" (the memory that tracks the context of a conversation). PagedAttention borrows a concept from operating systems—virtual memory paging—allowing the KV Cache to be broken into non-contiguous blocks. This virtually eliminates memory fragmentation and allows the GPU to serve significantly more concurrent users.
- Continuous (In-Flight) Batching: Traditional inference engines wait for a whole batch of requests to finish before starting a new one, leaving GPUs idle if one user's prompt generates a long response while others are short. vLLM schedules work at every generation step: as soon as one request finishes, a new one takes its place in the batch, keeping GPU utilization high.
- Prefix Caching & Intelligent Routing: If multiple users send prompts with the same prefix (e.g., a shared system prompt or a long document), vLLM caches the KV blocks of that prefix and reuses them instead of recomputing them. When many vLLM instances run side by side, cache-aware routers such as [llm-d](https://llm-d.ai/) or the vLLM Production Stack send new requests to the instance that already holds the matching prefix, drastically reducing latency.

### The Difference: Architecture vs. Serving

To understand the complete pipeline, it is crucial to distinguish between what we learned earlier and what vLLM does:

- Earlier (Architecture & Hardware): We discussed the static state of the model. How the math works (Transformers, MoE), how the files are saved (Safetensors), and how the model weights are physically laid out across the GPUs (TP, PP and EP).
- vLLM (Dynamic Serving): vLLM is the active manager. It loads the weights onto the GPU cluster and manages the real-time flow of human traffic. It decides which user's token gets computed next, how to manage the memory for their specific conversation, and how to batch requests together.

### Megatron, Megatron Bridge and vLLM: Are they the same?

A common point of confusion is the relationship between NVIDIA's Megatron projects and inference servers like vLLM.

[Megatron-LM](https://github.com/nvidia/megatron-lm) and its library, Megatron Core, are designed for the massive undertaking of pre-training and fine-tuning foundational models. Megatron Core provides the low-level building blocks to orchestrate Tensor, Pipeline, Sequence, Context and Expert parallelism across thousands of GPUs during training.

[Megatron Bridge](https://github.com/NVIDIA-NeMo/Megatron-Bridge) is a separate NVIDIA library, part of the NeMo framework, built on top of Megatron Core. It converts checkpoints between the Hugging Face format and Megatron's format in both directions, distributing the weights according to the chosen parallelism layout as it does so. It also provides ready-made training and fine-tuning recipes, including LoRA, and supports GPT-oss among its models.

Can Megatron be used for inference? Yes, Megatron Core includes inference support, but it is mostly used to test and evaluate a model during and after training. It is not optimized for serving thousands of concurrent users in a production environment.

vLLM, on the other hand, is purpose-built for production inference. Interestingly, vLLM borrows Megatron-LM's Tensor Parallelism algorithm to distribute the model across GPUs. A common enterprise workflow is therefore: import a Hugging Face checkpoint into Megatron with Megatron Bridge, train or fine-tune it with Megatron Core, export the result back to Hugging Face Safetensors with Megatron Bridge, and load those weights into vLLM to serve the model to end-users with maximum efficiency and the lowest latency.

### The Strategic Imperative of AI Infrastructure

As generative AI transitions from experimental workflows to core enterprise operations, the industry conversation must shift from simply asking "which model is smartest" to "how robust is our underlying infrastructure." True competitive advantage in the AI space is no longer just about prompt engineering or having the best model weights. It is about mastering the deployment stack.

Understanding this end-to-end pipeline—from optimizing NVMe-to-VRAM loading and orchestrating multi-GPU parallelism, to maximizing concurrent user throughput with advanced serving engines like vLLM—is what separates a fragile proof-of-concept from a highly profitable, scalable production environment. As AI architectures continue to grow in complexity, the organizations that win will be those that treat MLOps and infrastructure architecture not as an afterthought, but as the foundation of their business strategy.

I'd love to hear from other engineering leaders and systems architects in my network: As you scale your LLM deployments, what are the biggest hardware or serving bottlenecks you are currently navigating in your clusters? Let's discuss in the comments.

### References & Further Reading

- gpt-oss-120b model card and configuration (OpenAI, Hugging Face) <https://huggingface.co/openai/gpt-oss-120b>
- Optimization and Tuning (vLLM) <https://docs.vllm.ai/en/stable/configuration/optimization/>
- Parallelism and Scaling (vLLM) <https://docs.vllm.ai/en/stable/serving/parallelism_scaling/>
- Megatron Bridge (NVIDIA NeMo) <https://github.com/NVIDIA-NeMo/Megatron-Bridge>
- Parallelisms Guide (NVIDIA Megatron Bridge) <https://docs.nvidia.com/nemo/megatron-bridge/latest/parallelisms.html>
- Megatron-LM Official Repository (NVIDIA) <https://github.com/nvidia/megatron-lm>
- Meet vLLM: For faster, more efficient LLM inference and serving (Red Hat) <https://www.redhat.com/en/blog/meet-vllm-faster-more-efficient-llm-inference-and-serving>
- Data, tensor, pipeline, expert and hybrid parallelisms (BentoML) <https://bentoml.com/llm/inference-optimization/data-tensor-pipeline-expert-hybrid-parallelism>
- Understanding Multi-GPU Parallelism Paradigms (Datta Nimmaturi) <https://datta0.github.io/posts/understanding-multi-gpu-parallelism-paradigms/>
- Paradigms of Parallelism (Colossal-AI) <https://colossalai.org/docs/concepts/paradigms_of_parallelism/>
- Synergistic Tensor and Pipeline Parallelism (arXiv) <https://arxiv.org/abs/2510.27257>
- A Brief Overview of Parallelism Strategies in Deep Learning <https://afmck.in/posts/2023-02-26-parallelism/>

Images generated with: [Gemini](https://gemini.google.com/) and [Perplexity](https://www.perplexity.ai/)
