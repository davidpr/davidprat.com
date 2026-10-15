---
title: "The 0.01% Guide to AI Infrastructure: Understanding LLM Internals and GPU Execution"
date: "2026-05-06T09:00:00"
excerpt: "Generative AI platforms like ChatGPT , Perplexity , and Gemini have become ubiquitous, fundamentally transforming the modern technological landscape. Across industries, enterprises are deploying AI at an unprecedented…"
topics: ["AI & LLMs"]
cover: "/posts/linkedin-ai-infrastructure-guide/cover.jpg"
---
*Originally published on [LinkedIn](https://www.linkedin.com/pulse/001-guide-ai-infrastructure-understanding-llm-gpu-david-prat-robles-hr5te/).*

Generative AI platforms like [ChatGPT](https://docs.vllm.ai/en/latest/design/paged_attention/), [Perplexity](https://www.perplexity.ai/), and [Gemini](https://gemini.google.com/?hl=es-ES) have become ubiquitous, fundamentally transforming the modern technological landscape. Across industries, enterprises are deploying AI at an unprecedented scale, integrating Large Language Models ([LLMs](https://en.wikipedia.org/wiki/Large_language_model)) into complex data pipelines and establishing sophisticated [MLOps](https://en.wikipedia.org/wiki/MLOps) practices. Today, specialized tech organizations are fine-tuning foundational models to tackle domain-specific challenges in healthcare, law, and finance, while developers globally have embraced AI-powered coding interfaces to accelerate their workflows.

Yet, despite this massive wave of adoption, a critical knowledge gap remains. For most, the underlying mechanics of these systems are treated as a black box. Very few professionals truly grasp the internal intricacies of LLM architecture—such as embedding spaces, multi-head attention, and Mixture of Experts ([MoE](https://en.wikipedia.org/wiki/Mixture_of_experts)) routing. Even fewer understand the complex AI infrastructure required to load these massive models into GPU clusters for optimized inference.

This article bridges that gap. By breaking down the complete lifecycle—from how text tokens are processed in neural network layers to how matrix multiplications are executed at the hardware level—this guide will demystify the system architecture. By the end, you will join the 0.01% of professionals who truly understand the robust engineering and infrastructure that makes modern AI possible.

### From Theory to Silicon: Introducing GPT-oss 120B

This article breaks down how a reference large language model such as [GPT-oss 120B](https://huggingface.co/openai/gpt-oss-120b) works, from its internal Transformer architecture to the way it is packaged, stored, loaded from disk, and executed on GPU compute infrastructure.

It is aimed at readers who already have a basic understanding of LLMs, although anyone with a general technical background should be able to follow by reviewing a few concepts as they go.

GPT-oss 120B is built on a Transformer architecture that combines attention mechanisms with a Mixture of Experts (MoE) design. Instead of engaging the full network for every token, the model selectively activates specialized experts, increasing inference efficiency and enabling large-scale deployment on modern GPU systems.

![The GPT-oss 120B model architecture](/posts/linkedin-ai-infrastructure-guide/figure-01.png)

The GPT-oss 120B model architecture

### Step 1: Tokenization and Embeddings

Before the model can process text, it must convert human language into a mathematical format. The input sentence is divided into discrete segments called text tokens, which are assigned unique numerical IDs. A word lookup table then maps these IDs into dense, high-dimensional vector embeddings—in this architecture, an array of 8,192 numbers per token. This step captures the foundational semantic meaning of each word before it enters the computational pipeline.

### Step 2: The Transformer Layers

The core engine of the model is a sequential tower of 36 transformer layers where the actual "reasoning" occurs. As the token embeddings pass through each layer sequentially, they accumulate deeper contextual understanding through three primary mechanisms:

- Multi-Head Attention: The system uses 32 parallel "attention heads" to analyze relationships across the sequence. Different heads specialize in different tasks, such as tracking grammatical structure, identifying pronouns, or retrieving factual associations.
- Mixture of Experts (MoE) Routing: To optimize GPU compute efficiency, the layer utilizes a router to evaluate the token and selectively activate only the top 4 out of 128 specialized "expert" networks. This sparse activation ensures that only the most relevant neural pathways are computed.
- Expert Internal Workflow: Inside the selected experts, the data undergoes heavy matrix multiplications. The 8,192-dimensional vector is expanded to a much larger size (14,336 dimensions) to process complex patterns via a SwiGLU activation function, before being compressed back to its original size. Residual connections and layer normalization are applied between these steps to maintain mathematical stability across the deep network.

### Step 3: The Language Model Head

After the token vector has traversed all 36 layers, the highly enriched mathematical representation reaches the final stage: the Language Model (LM) Head. This component translates the 8,192-dimensional vector back into human language by calculating next-word probabilities. It outputs a distribution chart across the model's entire vocabulary, allowing the system to accurately predict and generate the most statistically likely next token.

### Mapping Architecture to Disk: The Safetensors Format

![Safetensors and disk storage](/posts/linkedin-ai-infrastructure-guide/figure-02.png)

Safetensors and disk storage

Understanding the abstract architecture of GPT-oss 120B is only half the equation. To deploy the model, those mathematical structures must be serialized and stored on physical media (NVMe/SSDs). Modern LLMs utilize the Safetensors format, which organizes the model’s massive parameter count into secure, zero-copy memory-mapped files designed for rapid loading. Because a 120-billion-parameter model is too large for a single file, it is broken down, or "sharded," into logical components.

### The Storage Sharding Strategy

When you download an LLM to disk, you are downloading a structured directory of these Safetensors shards. For GPT-oss 120B, the model maps perfectly from its architectural stack to roughly 38 specific files:

- Input and Output Shards: The first file (embedding.safetensors) contains the lookup table that translates the vocabulary (120k tokens) into 8,192-dimensional vectors. The final file (lm\_head.safetensors) holds the logic that converts the final processed vectors back into next-token probabilities.
- Layer-by-Layer Serialization: The core processing engine—the 36 Transformer layers—is sharded sequentially from layer\_00.safetensors through layer\_35.safetensors. Each file encapsulates the distinct mathematical weights for that specific layer’s attention mechanisms and expert networks.
- Total Storage Footprint: Depending on quantization (e.g., using MXFP4 weights), this entire sharded folder structure requires approximately 115 GB of disk space.

### Exploded View: Inside a Single Layer Shard

If we inspect the internal payload of a single shard (such as Layer 0), we find the raw multi-dimensional matrices required for GPU compute:

- Self-Attention Matrices: The shard contains the Query (Q), Key (K), Value (V), and Output (O) projection weights. For an 8,192-dimension model, these are stored as massive 8192×81928192×8192 matrices.
- MoE FFN Weights: It also contains the architecture for the Mixture of Experts. This includes the projection weights that expand the vectors (from 8,192 to 14,336 dimensions) and compress them back, as well as the data for the router that dictates which 4 of the 128 experts should be selected for computation.

By sharding the model this way, the system can selectively memory-map (mmap) individual layers into RAM and GPU VRAM precisely when needed, rather than attempting to load a monolithic 115 GB file into memory all at once.

### The Inference and training Pipeline: From Storage to Silicon

![Single-node inference pipeline](/posts/linkedin-ai-infrastructure-guide/figure-03.png)

Single-node inference pipeline

Having mapped the LLM architecture into discrete Safetensors shards on disk, the next critical infrastructure challenge is moving those massive datasets into the execution environment. This explanation applies both for single-user inference and for training at any stage. Both use cases require a carefully orchestrated pipeline that shuttles data from slow non-volatile storage into ultra-fast GPU memory, and ultimately into the compute cores.

### The Megatron Bridge: CPU to GPU Transfer

The journey begins at the NVMe/SSD storage level. The CPU orchestrates the loading of the Safetensors model shards into system RAM. However, simply copying data to the GPU is not enough for massive models like GPT-oss 120B.

- Parallelism-Aware Loading: The system utilizes frameworks like the [NVIDIA Megatron Bridge](https://docs.nvidia.com/nemo/megatron-bridge/latest/). This layer acts as an intelligent intermediary, converting and sharding the model weights specifically for distributed execution.
- PCIe 5.0 Transfer: The prepared shards are streamed across the PCIe 5.0 bus directly into the GPU. The Megatron Bridge ensures that the weights are optimally distributed across the cluster, aligning with complex strategies like tensor parallelism and pipeline parallelism.

### Weight Buffering in HBM3e VRAM

Once across the PCIe bus, the model data lands in the GPU's High Bandwidth Memory (HBM3e VRAM).

- Layer-Wise Organization: The VRAM acts as a massive weight buffer, holding the parameters for all 36 Transformer layers.
- Matrix Storage: Inside this buffer, the data is structured into the specific projection matrices required for inference—such as the Q/K/V/O projections (8192×81928192×8192) and the FFN/MoE projections that handle the dimensional expansion (8192→14336→81928192→14336→8192).

### Execution: L2 Cache to Streaming Multiprocessors (SMs)

VRAM is fast, but execution requires the data to be placed as close to the compute units as possible. During inference, the specific weight blocks required for the current token are pulled from VRAM into the GPU's L2 Cache.

- The L2 to SM Bus: From the L2 Cache, the block-wise weights and input data are dispatched via a high-speed bus directly to the Streaming Multiprocessors (SMs).
- CUDA and Tensor Cores: Inside the SM, the data moves through L1 cache and into the register files. The actual mathematical heavy lifting is handed off to the Tensor Cores. These specialized operators execute massive matrix multiplications (MATMUL). They take the input data matrix (A), multiply it by the weight matrix (B), and produce the output matrix (C)—performing the fundamental calculations that drive the Transformer's attention mechanisms and expert routing.

By pipeline-lining this process—streaming data from NVMe to RAM, across the Megatron Bridge to VRAM, through the caches, and into the Tensor Cores—modern AI infrastructure can sustain the massive throughput required to generate text in real time.

### Scaling Up: Multi-GPU Inference on an NVIDIA DGX H200 Node

![Multi-GPU inference pipelijne (DGX H200)](/posts/linkedin-ai-infrastructure-guide/figure-04.png)

Multi-GPU inference pipelijne (DGX H200)

While the internal architecture of an LLM and the loading process into a single GPU are complex, running a massive model like GPT-oss 120B in production requires scaling across multiple GPUs. A single GPU, even a powerful one, often lacks the VRAM to hold the entire model or the compute power to serve tokens at acceptable latency. To solve this, enterprise architectures rely on nodes like the NVIDIA DGX, which houses 8 high-performance GPUs (in this case, H200 SXM5 modules) working as a single unified engine.

### Breaking Down the Workload: Parallelism Strategies

To make 8 GPUs act as one, the model's workload and memory must be divided. The system employs two primary strategies to distribute the massive parameters of GPT-oss 120B: Tensor Parallelism and Pipeline Parallelism.

1. Tensor Parallelism (TP): Splitting the Math Instead of giving one GPU the entire matrix multiplication task, Tensor Parallelism slices the mathematical operations vertically (column-wise matrix sharding).

- Imagine a massive matrix of weights (e.g., an 8,192-column matrix). TP divides these columns evenly across the 8 GPUs. GPU 0 handles columns 0-1024, GPU 1 handles 1024-2048, and so on.
- Each GPU computes its fraction of the math simultaneously.
- Once computed, the GPUs must share their partial results to construct the final answer. This requires an incredibly fast inter-GPU network.

2. Pipeline Parallelism (PP): An Assembly Line for Layers While TP slices the matrices, Pipeline Parallelism divides the sequence of the model's 36 layers across different GPUs, creating a sequential assembly line.

- For example, GPUs 0 and 1 might be responsible for Layers 0-11 (Stage 1).
- Once they finish processing a token through those layers, they pass the data to GPUs 2 and 3, which handle Layers 12-23 (Stage 2), and so forth.
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

- The raw token enters GPUs 0, 1, 2, and 3. They work together (TP) to process the token through Layers 0-17.
- Because these GPUs only hold Layers 0-17 in their VRAM, they cannot finish the token.
- Once Layer 17 is complete, the intermediate result (the activations) is passed over the network from the first group (GPUs 0-3) to the second group (GPUs 4-7). This handoff is the Pipeline Parallelism.
- GPUs 4, 5, 6, and 7 then take that intermediate data and work together (TP) to process it through Layers 18-35 to generate the final output.

### Why do both?

Tensor Parallelism requires GPUs to talk to each other constantly (often multiple times per layer) to share partial matrix math results. This requires extreme bandwidth, which is why it is almost exclusively done inside a single server using NVLink.

Pipeline Parallelism only requires GPUs to talk to each other once per stage (just passing the result of Layer 17 to Layer 18). Because the communication requirement is much lower, PP is often used to bridge across different servers (e.g., Server A handles the first half of the model, Server B handles the second half).

By combining them, you keep the ultra-fast TP math confined to GPUs physically wired together, while using PP to scale the model's depth across more hardware without causing a massive network bottleneck

### The NVLink Fabric: The Backbone of Synchronization

Because Tensor Parallelism requires constant sharing of partial results, traditional PCIe connections are far too slow. This is where the [NVLink](https://www.nvidia.com/es-es/data-center/nvlink/) 5.0 Fabric becomes critical.

- The DGX node connects all 8 H200 GPUs via a proprietary NVLink switch network, providing a staggering 1.8 TB/s of bi-directional bandwidth.
- When the GPUs complete their sliced matrix math, they execute an "All-Reduce Synchronization." The NVLink fabric allows them to instantly pool their partial results (TP Shards) together, finalize the computation for that layer, and prepare the data for the next step.

### VRAM Layout and Distributed MoE

Inside each of the 8 H200 GPUs, the 141GB of HBM3e VRAM is carefully partitioned. A portion holds shared embeddings, another holds the specific sharded layer matrices assigned to that GPU, and a critical segment is reserved for the KV Cache (which remembers the context of the user's prompt).

Furthermore, the Mixture of Experts (MoE) architecture scales beautifully in this environment. Instead of storing all 128 experts on every GPU, the experts are distributed across the node. When the router determines which 4 experts a token needs, it sends the "token chunks" over the NVLink fabric to whichever specific GPUs happen to house those required experts, computing them in parallel before gathering the results back.

By mastering this orchestration—ingesting data via PCIe, splitting math via Tensor Parallelism, dividing layers via Pipeline Parallelism, and synchronizing at terabytes per second over NVLink—systems architects can deploy 120-billion parameter models that generate responses in milliseconds.

### Enter vLLM: The Software Engine for High-Throughput Inference

![Production-scale inference serving with vLLM](/posts/linkedin-ai-infrastructure-guide/figure-05.png)

Production-scale inference serving with vLLM

So far, this article has focused on the physical and architectural journey of the model—how GPT-oss 120B is mapped from layers into Safetensors, loaded across the PCIe bus, stored in HBM3e VRAM, and distributed across 8 GPUs via Tensor and Pipeline Parallelism.

However, hardware alone does not make a production-ready AI service. To serve thousands of users simultaneously (like ChatGPT or Perplexity does), you need highly optimized software to manage the traffic, memory, and queuing of incoming requests. This is where [vLLM](https://vllm.ai/) comes in. vLLM is a state-of-the-art, open-source inference server designed to squeeze the maximum throughput out of the GPU hardware we just discussed.

### Key vLLM Optimizations

The image highlights several critical software optimizations that vLLM applies on top of the physical infrastructure:

- [PagedAttention](https://docs.vllm.ai/en/latest/design/paged_attention/): This is vLLM's core innovation. In a standard setup, GPUs waste massive amounts of VRAM by pre-allocating contiguous memory blocks for the "KV Cache" (the memory that tracks the context of a conversation). PagedAttention borrows a concept from operating systems—virtual memory paging—allowing the KV Cache to be broken into non-contiguous blocks. This virtually eliminates memory fragmentation and allows the GPU to serve significantly more concurrent users.
- Continuous (In-Flight) Batching: Traditional inference engines wait for a batch of requests to finish before starting a new one, leaving GPUs idle if one user's prompt generates a long response while others are short. vLLM uses continuous batching to dynamically inject new requests into the compute stream the exact millisecond another request finishes, keeping GPU utilization near 100%.
- Prefix Caching & Intelligent Routing: If multiple users send prompts with the same prefix (e.g., a shared system prompt or a long document), vLLM caches that computation. Its intelligent scheduler can route new, similar requests to the specific GPUs that already hold that cached prefix in memory, drastically reducing latency.

### The Difference: Architecture vs. Serving

To understand the complete pipeline, it is crucial to distinguish between what we learned earlier and what vLLM does:

- Earlier (Architecture & Hardware): We discussed the static state of the model. How the math works (Transformers, MoE), how the files are saved (Safetensors), and how the model weights are physically laid out across the GPUs (TP and PP).
- vLLM (Dynamic Serving): vLLM is the active manager. It sits on top of that distributed GPU cluster and manages the real-time flow of human traffic. It decides which user's token gets computed next, how to manage the memory for their specific conversation, and how to batch requests together.

### Megatron Bridge vs. vLLM: Are they the same?

A common point of confusion is the relationship between NVIDIA's Megatron and inference servers like vLLM.

Megatron-LM (and Megatron Core) is primarily a framework designed for the massive undertaking of pre-training and fine-tuning foundational models. It provides the low-level building blocks (like the Megatron Bridge) to orchestrate Tensor, Pipeline, and Sequence parallelism across thousands of GPUs during the training phase.

Can Megatron be used for inference? Yes, technically Megatron has inference scripts, but it is generally used as a reference implementation or for testing the model immediately after training. It is not optimized for serving thousands of concurrent users in a production environment.

vLLM, on the other hand, is purpose-built exclusively for production inference. Interestingly, vLLM actually borrows Megatron-LM's Tensor Parallelism algorithms to distribute the model across GPUs. Today, the standard enterprise workflow is to use Megatron to train the model, export the finished checkpoints (often using tools like NeMo), and then load those weights into vLLM to serve the model to end-users with maximum efficiency and lowest latency.

### The Strategic Imperative of AI Infrastructure

As generative AI transitions from experimental workflows to core enterprise operations, the industry conversation must shift from simply asking “which model is smartest” to “how robust is our underlying infrastructure.” True competitive advantage in the AI space is no longer just about prompt engineering or having the best model weights. It is about mastering the deployment stack.

Understanding this end-to-end pipeline—from optimizing NVMe-to-VRAM loading and orchestrating multi-GPU parallelism, to maximizing concurrent user throughput with advanced serving engines like vLLM—is what separates a fragile proof-of-concept from a highly profitable, scalable production environment. As AI architectures continue to grow in complexity, the organizations that win will be those that treat MLOps and infrastructure architecture not as an afterthought, but as the foundation of their business strategy.

I’d love to hear from other engineering leaders and systems architects in my network: As you scale your LLM deployments, what are the biggest hardware or serving bottlenecks you are currently navigating in your clusters? Let’s discuss in the comments.The Model Architecture

### References & Further Reading

- Optimization and Tuning (vLLM) <https://docs.vllm.ai/en/stable/configuration/optimization/>
- Parallelism and Scaling (vLLM) <https://docs.vllm.ai/en/stable/serving/parallelism_scaling/>
- Parallelisms Guide (NVIDIA Megatron Bridge) <https://docs.nvidia.com/nemo/megatron-bridge/latest/parallelisms.html>
- Megatron-LM Official Repository (NVIDIA) <https://github.com/nvidia/megatron-lm>
- Meet vLLM: For faster, more efficient LLM inference and serving (Red Hat) <https://www.redhat.com/en/blog/meet-vllm-faster-more-efficient-llm-inference-and-serving>
- Data, tensor, pipeline, expert and hybrid parallelisms (BentoML) <https://bentoml.com/llm/inference-optimization/data-tensor-pipeline-expert-hybrid-parallelism>
- Understanding Multi-GPU Parallelism Paradigms (Datta Nimmaturi) <https://datta0.github.io/posts/understanding-multi-gpu-parallelism-paradigms/>
- Paradigms of Parallelism (Colossal-AI) <https://colossalai.org/docs/concepts/paradigms_of_parallelism/>
- Synergistic Tensor and Pipeline Parallelism (arXiv) <https://arxiv.org/abs/2510.27257>
- A Brief Overview of Parallelism Strategies in Deep Learning <https://afmck.in/posts/2023-02-26-parallelism/>

Images generated with: [Gemini](https://gemini.google.com/?hl=es-ES) and [Perplexity](https://www.perplexity.ai/)
