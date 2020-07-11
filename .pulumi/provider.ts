import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

const config = new pulumi.Config()
const stack = config.requireSecret('stack')

const cluster = stack.apply(s => new pulumi.StackReference(s))
const kubeconfig = cluster.apply(c => c.getOutput("kubeconfig"))

export const provider = new k8s.Provider('k8s-provider', { kubeconfig });

export const namespace = new k8s.core.v1.Namespace('molny', {}, {
  provider
})
