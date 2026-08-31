---
title: "Presto Cluster on Kubernetes"
date: "2020-02-03T11:06:13"
excerpt: "Presto Cluster on Kubernetes This tutorial is the continuation of the tutorial Data Federation with Presto on Docker. After having acquired some understanding and experience of Docker now it is turn to deploy these Docke"
topics: ["Kubernetes","Data & Streaming"]
cover: "/posts/presto-cluster-on-kubernetes/presto-db2.jpeg"
---
## Presto Cluster on Kubernetes

This tutorial is the continuation of the tutorial [Data Federation with Presto on Docker](/data-federation-with-presto-on-docker/). After having acquired some understanding and experience of Docker now it is turn to deploy these Docker images into a managed cluster with Kubernetes. Kubernetes allows to orchestrate a cluster of microservices in which each service corresponds to one container. In this case, Docker images are used, but Kubernetes can also work with other container technologies such as rtk, etc.

In Kubernetes we define the infrastructure with a code. So in this sense, we don’t use an imperative programming language but a descriptive one. In Kubernetes this is done by using YAML files which are very similar to use JSON files.

For this tutorial we will take Minikube as the tool to create in a fast way the underlying virtual machine to support the containers created by Kubernetes. Please follow the instructions [here](https://kubernetes.io/docs/tasks/tools/install-minikube/):

Kubernetes internals are quite complex for this post and it’s out of scope to make a compete explanation of how it works. However I can recommend you this book as a complete source of information with this respect: [Kuberntes in Action](https://www.manning.com/books/kubernetes-in-action). Having said this, here I make a quick explanation about the infrastructure:

##### Namespace

First the namespace is defined. Kuberntes runs its containers, in this case Docker containers, on top of an infrastructure. This physical infrastructure, that can be even virtualised, is the one that will contain the containers and its connections. In Kubernetes the key element is the Pod, which is a basic unit of administration of a set of containers sharing ports and other resources. Roughly speaking, inside of a Kubernetes physical infrastructure, then containers and connections are defined. To enable the separation of containers and connections namespaces are defined. This way, different logical infrastructures can be specified within the same physical/virtual cluster. In this case is as easy as specifying a namespace called presto-clu2.

```
apiVersion: v1
kind: Namespace
metadata:
  name: presto-clu2
```

##### Service

Services represent in Kubernetes a way to make the routing inside of the cluster. In this case, the name of the service and the namespace to which the service belongs are specified. Then a selector is used. It is called presto-c and the purpose of it is saying that this service is going to be applied to resources marked with this selector. In the next resource, a deployment, we will see how do we mark pods with the same selector. The ports tag describes the ports redirection to each pod and the nodePort indicates that this service allows the cluster to be reachable from the outside of the Kubernetes cluster. When indicating nodPort 30123, we are saying that the endpoint someurl:30123 in our browser will allow to to connect the what is running linked to port 80 in the pod, which will indeed be a container inside of the pod.

```
apiVersion: v1
kind: Service
metadata:
  name: presto-cluster
  namespace: presto-clu2
spec:
  selector:
    app: presto-c
  ports:
  - name: p80
    protocol: TCP
    port: 8080
    targetPort: 8080
    nodePort: 30123
  - name: p3306
    port: 3306
    targetPort: 3306
  type: NodePort
```

##### Deployment

A deployment allows in Kubernetes to specify a set/group of pods controlled by a replication controller or replication set. Replications sets add some improvements with respect to gather groups of pods over replication controllers. These resources keep an eye to the pods they are associated to and make sure the group of pods are always running the same pods. In this example, replicas field is set to 1 so this means only 1 pod is always created and ready for execution. The selector field tells the replication set that be applied to the pods tagged with presto-c tag and the template tells the replication set to tag as presto-c the pods created under its domain. So in this sense, the information is redundant. The last part of the file contains the containers specification. All the containers specified here will be part of the the created pod sharing ports. So it’s very important avoid running applications in that need the same port in the same pod.

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: presto-cluster
  namespace: presto-clu2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: presto-c
  template:
    metadata:
      labels:
        app: presto-c
    spec:
      containers:
      - name: presto-co
        image: greattenchu/openjdk-presto-k:1.0
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
      - name: presto-wo
        image: greattenchu/openjdk-prestoworker-k:1.0
        imagePullPolicy: Always
        ports:
        - containerPort: 8181
```

Here we can see, how the images that are used for the pods are indeed the ones used in the previous tutorial. In fact, the way to proceed for a Kubernetes cluster is like this: first one can create its own containers with Dockerfiles, upload them to the Docker hub and finally use them in the Kubernetes cluster. This way, one can test the correctness of the containers before deploying the whole cluster.

Let it suffice to say, that what this tutorial is showing is a bad practice, because two services, on this case a Presto coordinator and a Presto worker are running in the same pod, while Kubernetes is intended to run only one service per pod but allowing patterns such as having an extra container for logging monitoring or other things that add somehow a an aid or a service to the primary process.

##### Pushing Docker images Docker Hub

Before we can deploy the cluster it is needed to upload the Docker images to the Docker Hub. This is because Kubernetes will build the cluster in basis of what it is specified in the yaml files. However, it pulls or gets the Docker images from the hub. To upload the images the following commands have to be executed:

```
docker build -t greattenchu/openjdk-presto-k:1.0 .
docker build -t greattenchu/openjdk-prestoworker-k:1.0 . -f prestoWorker.Dockerfile
```

First the image of the coordinator is uploaded then it goes the image of the worker node. Pay attention to -f flag to indicate what Dockerfile to chose when the name is not the default one. Also take notice of the :1.0. This is indicating what the version of the image is in the Docker Hub. If no version is specified, then it will always mark it as latest.

##### Deploying the cluster

Deploying the cluster is as easy as using kubectl indicating the yaml files. First the namespace is created and then the service and deployment. Kubectl allows to control every aspect of the Kubenetes clusters. The three next commands use the get option, which provides us with descriptions of the infrastructure created. It’s important to specify the namespace to what we are referring, if not, the default namespace will be taken as granted and we won’t see our created resources if they are in a given namespace that is not the default one.

```
kubectl create -f ./namespace.yaml;  kubectl create -f ./service-presto.yaml; kubectl create -f ./deployment.yaml

kubectl get namespaces
kubectl get deployments --namespace=presto-clu2
kubectl get all --namespace=presto-clu2
```

Now it’s time to get closer to the created cluster and to really use it. The first command will show a comprehensive explanation of the pod. Network interfaces, state of the containers, their complete name, etc. To connect to one of the containers, we can use the second command. The pod and the container names have to be provided. For the container name is as easy as using the name provided in the yaml file instead of providing the long name given in the previous command. With it we will end up with a bash terminal in which we will be able to operate like in a Linux terminal. Please refer to kubectl man pages to see the complete description of the parameters to achieve different behaviours when connecting to a container.

The third command takes for granted that Minikube was used to create the virtual cluster. This command will give us the endpoint to which the Nodeport service has an associated reachable port from the outside, in our case we specified port 30123 to be the entry point for the 80 port, to which the coordinator container is listening though its web UI server.

```
kubectl describe pod --namespace=presto-clu2 presto-cluster-669c785785-5nhgw

kubectl exec -t -i --namespace=presto-clu2 presto-cluster-7f7b8c97dd-hlzfm -c presto-co bash 

minikube service --namespace=presto-clu2 presto-cluster --url


```

If now we paste the resulting direction to our browser we have to see the Presto web UI.

Once we are done with our test, we can delete the infrastructure with the commands below. Bear in mind, that to delete pods first the replicatica set has to be deleted, if not this one would create again the pods.

```
kubectl delete --all deployment --namespace=presto-clu2 && kubectl delete --all services --namespace=presto-clu2 && kubectl delete --all pod && kubectl delete --all replicaset --namespace=presto-clu2
```
