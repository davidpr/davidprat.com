---
title: "K3s etcd backups and snapshots explained"
date: "2023-05-03T14:27:57"
excerpt: "[vc_row][vc_column][vc_column_text] K3s etcd backups and snapshots explained [/vc_column_text][/vc_column][/vc_row][vc_row][vc_column][vc_column_text]In today s world of technology, ensuring data protection and business "
cover: "/posts/k3s-etcd-backups-and-snapshots-explained/K3s-logo.png"
---
\[vc\_row\]\[vc\_column\]\[vc\_column\_text\]

## K3s etcd backups and snapshots explained

\[/vc\_column\_text\]\[/vc\_column\]\[/vc\_row\]\[vc\_row\]\[vc\_column\]\[vc\_column\_text\]In today’s world of technology, ensuring data protection and business continuity is more important than ever before. This is especially true for Kubernetes environments, where the loss of critical data can have significant consequences on the operations of a business. With this in mind, it’s essential to have a reliable backup and disaster recovery strategy in place for your Kubernetes clusters.

K3s is a lightweight and easy-to-use Kubernetes distribution that has gained popularity due to its simplicity and portability. However, like any other Kubernetes cluster, K3s is not immune to data loss or system failures. Therefore, it’s crucial to have a backup and snapshot strategy in place to protect your K3s data.

In this blog post, we will discuss the importance of backing up your K3s cluster and provide a step-by-step tutorial on how to configure K3s backups and snapshots.

##### Preparing the cluster

Before installing K3s in our sever we are going to create two directories: one for the backups and the other for the snapshots. As you’ll see, the snapshots directory is going to grow on size due to the multiple snapshots depending the frequency of them and also depending on how many resources the cluster has. So, plan ahead if the cluster is going to allocate many pods with big images. If the requirements start to be heavy, it might be necessary to pass the folder to an external disk or even to store in a cloud provider with S3 for example, for which K3s has support.

mkdir etcd-snapshots etcd-backups

##### Installation and configuration of K3s

To install K3s in our Linux server and configure the snapshots and backups we are going to do it in a single command. For example if we’d like to do snapshots each 3 hours and retain the las 72 snapshots, (that is to say the last 9 days) the command to execute is the following one:

curl -sfL https://get.k3s.io | sh -s server - --cluster-init --token "1234" --write-kubeconfig-mode 644 --disable traefik --data-dir=/home/david/etcd-backups --etcd-snapshot-retention=72 --etcd-snapshot-dir=/home/david/etcd-snapshots --etcd-snapshot-schedule-cron="0 \*/3 \* \* \*"

It is easy to see how the cron command is programmed to be executed each 3 hours. then the retention period of the snapshot is 72 snapshots. If we multiply the 72 snapshots by 3 hours we get the 216 hours that divided by 24h/day, it gives the 9 days of snapshots.

Doing the same command but for testing purposes we can tell to execute a snapshot each 1 minutes and keep 3600 snapshots, which makes up to half day of snapshots. This command is recommended for testing things faster.

curl -sfL https://get.k3s.io | sh -s server - --cluster-init --token "1234" --write-kubeconfig-mode 644 --disable traefik --data-dir=/home/david/etcd-backups --etcd-snapshot-retention=1800 --etcd-snapshot-dir=/home/david/etcd-snapshots --etcd-snapshot-schedule-cron="\*/1 \* \* \* \*"

##### Testing the backups and snapshots

To test that we can retrieve the state of the K3s cluster we can create a nginx pod. Notice how there’s no need to specify any additional parameter in the creation of the pod because the nginx image is by default prepared to launch a server process that never ends. So, in this sense the nginx image is ideal for these kind of tests.

alias k=kubectl; k run nginx --image nginx

Now wait for 1 minute and check the snapshots folder. The first snapshot should have been generated. You can play by creating more pods, deleting them, etc. Just remember what the state of the K3s cluster was at each point in time. Once you have been playing with it, it’s time to load a specific snapshot. Bear in mind that now we are playing, but this could perfectly be a case in which the server has been attacked and you need to recreate the cluster as soon as possible. So, the commands to restore from a snapshot are:

/usr/local/bin/k3s-killall.sh &&/usr/local/bin/k3s-uninstall.sh
curl -sfL https://get.k3s.io | sh -s server - --cluster-init --token "1234" --write-kubeconfig-mode 644 --disable traefik --data-dir=/home/david/etcd-backups --etcd-snapshot-retention=15 --etcd-snapshot-dir=/home/david/etcd-snapshots --etcd-snapshot-schedule-cron="\*/1 \* \* \* \*" --cluster-reset --cluster-reset-restore-path=/home/david/etcd-snapshots/etcd-snapshot-fanless-1683127322
sudo sed -e '/--cluster-reset/d' -i /etc/systemd/system/k3s.service
systemctl daemon-reload

Although the documentation of K3s or other books might indicate simpler commands, they might not work in your case. These commands have been tested, they restore the snapshot and leave the cluster once again performing snapshots. Notice how we stop and even remove the cluster to start from scratch and load the snapshot, all in a single command. The last two commands are just complementary given the way the cluster is started with the scripts provided by K3s. Let’s say the support and scripts provided by Rancher at the time of writing this post are not working seamlessly in all the cases.

It is very important to remark that after doing the systemctl daemon-reload some time has to be waited to have the kube-apiserver operative again. If there’s any error message when doing the kubectl get pods, it’s perfectly normal if it happens up until 1 minute after restarting the daemon.

##### Further useful commands for K3s

By using K3s, the way to access the containers of the pods is not by using the Docker daemon but using the crictl command. By the way, this command is the de facto tool in the new k8s clusters. Specifically, the dockershim, which acted as a bridge between K8s and Docker was deprecated in k8s version 1.20 and removed in version 1.22.  The following command allows to do a ps over all the containers.

sudo k3s crictl -c /home/david/etcd-backups/agent/etc/crictl.yaml ps -a

To uninstall k3s from our server we just type the following command. Bear in mind that this will remove k3s with all its resources. This is the typical command to use when you are starting with k3s and making your initial steps. So, when you have installed and tried many things and then you want to start over with a blank cluster.

/usr/local/bin/k3s-uninstall.sh

In conclusion, implementing a backup and snapshot strategy for your K3s cluster is essential to ensure data protection and business continuity. By following the steps outlined in this tutorial, you can configure K3s backups and snapshots and have the peace of mind knowing that your critical data is protected.

Remember that backups should be taken regularly and tested periodically to ensure they are reliable and can be restored when needed. With a robust backup and disaster recovery strategy in place, you can minimize the impact of system failures, data loss, or other unforeseen events that may disrupt your operations. Specially a Kubernetes distribution such as K3s, that is designed to be running in more resource limited machines and thus removes some of the robustness of a distribution such as K8s, should required from special care to have these snapshots and make a full restoration when potentially something that leaves the K3s cluster state messed happens.

I hope that this tutorial has been helpful in guiding you through the process of configuring K3s backups and snapshots.\[/vc\_column\_text\]\[/vc\_column\]\[/vc\_row\]
