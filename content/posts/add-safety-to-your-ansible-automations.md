---
title: "Add Safety to your Ansible Automations"
date: "2022-04-26T12:58:37"
excerpt: "Add Safety to your Ansible Automations Using Ansible for automation really makes the work of systems administrators scalable as it gives to the sysadmin the power to launch sets of commands on groups of machines. While s"
cover: "/posts/add-safety-to-your-ansible-automations/ansible-1.jpeg"
---
\[vc\_row\]\[vc\_column\]\[vc\_column\_text\]

## Add Safety to your Ansible Automations

\[/vc\_column\_text\]\[/vc\_column\]\[/vc\_row\]\[vc\_row\]\[vc\_column\]\[vc\_column\_text\]Using Ansible for automation really makes the work of systems administrators scalable as it gives to the sysadmin the power to launch sets of commands on groups of machines. While some other automation tools such as Chef, Puppet or Saltstack also solve the same problem of scalability and saving time for sysadmins, Ansible has been the one to be mostly adopted. This is in part because its easy of installation across a set of machines, where the connections with the machines in which to execute the sysadmin commands are just accessed via ssh instead of needing to install any agent binaries.

However, these tools have been with us since a short time. This makes that despite of learning and using them many DevOps engineers still not use them correctly because more experience is needed. In this post I’ll comment about some patterns apply to Ansible in order to use it in a safe way. Despite being overlooked, safety in automation is a vital importance, as automation commands can erase all your cloud resources by typing a single key or create numerous cloud resources. Both situations can result in big monetary losses for your company. While allocating numerous unused resources higher the cloud invoice at the end of the month, destroying infrastructure by mistake would lead to your company services to be down.

##### Automation and Human double check pattern

User keyboard input to double check ids of the resources to be destroyed:

\- pause:
  prompt: "Please check with special care resources programmed to be deleted --> {{resourceIDdeleteAuto}} <--. The proposed resource should match with the expected value by you. Once the deletion starts there is no way to revert it!. Press enter key once ready"
  echo: yes

- pause:
    prompt: "Please check the resourceID. Enter the resrouceID value you want to delete:"
    echo: yes
  register: resourceID
- set\_fact:
 resourceIDdelete: "{{ resourceID.user\_input }}"

- name: Destroy
  command: yourBinaryforDestroying --resource-id {{resourceIDdelete}} --someparameters
  when: resourceIDdelete == resourceIDdeleteAuto

The above code is a tasks yaml that can be placed in the tasks folder. Because it is a task and not a playbook Ansible doesn’t allow to use the vars\_prompt section. So in this case, a pause section is used in conjunction with registering var. Then at that moment of executing your command that performs the destruction of the resource when when clause will just compare your variable entered with keyboard and the variable that some other task in charge of the automation will determine (resourceIDdeleteAuto. If the automation selection and the human selection are the same, the destruction operation can be nearly 100% safe.

##### Playbook stop without failure

For stopping in a non failure state your playbooks, instead of using the “failed\_when” clause, you can use the “meta: end\_play” clause to stop the playbook without failure. Indeed, there are many times in which we just want to end up a playbook without any error happening. As the algorithm can be designed to or just because the user is trying to make an operation without the right parameters, etc.

\- block
  - name: I'm a task that checks if the continuity of the tasks should be stopped
    debug:
      msg: "The playbook cannot continue as a result of the checking
  - meta: end\_play
  when: condition1 and/or condition2
   vars:
     var1: "I am a var used in condition1"

\[/vc\_column\_text\]\[/vc\_column\]\[/vc\_row\]
