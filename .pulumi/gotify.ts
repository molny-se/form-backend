import * as random from "@pulumi/random";
import * as k8s from '@pulumi/kubernetes';
import { provider, namespace } from './provider'

const appName = 'molny-form-backend-gotify'
const appLabels = { app: appName };

const password = new random.RandomPassword("gotify-password", {
    length: 32,
    special: true,
    overrideSpecial: `_%@`,
});

export const gotifyPassord = password.result

const pvc = new k8s.core.v1.PersistentVolumeClaim(appName, {
  spec: {
    accessModes: ['ReadWriteOnce'],
    resources: {
      requests: {
        storage: '1Gi'
      }
    }
  }
})

const deployment = new k8s.apps.v1.Deployment(
  appName,
  {
    spec: {
      selector: { matchLabels: appLabels },
      replicas: 1,
      template: {
        metadata: { labels: appLabels },
        spec: {
          containers: [
            {
              name: 'gotify',
              image: 'gotify/server',
              env: [
                {
                  name: 'GOTIFY_DEFAULTUSER_PASS',
                  value: gotifyPassord,
                },
              ],
              volumeMounts: [
                {
                  name: 'data',
                  mountPath: '/app/data',
                },
              ]
            },
          ],
          volumes: [{
            name: 'data',
            persistentVolumeClaim: { claimName: pvc.metadata.name },
          }],
        },
      },
    },
  },
  { provider },
);

export const service = new k8s.core.v1.Service(appName, {
  metadata: { labels: deployment.spec.template.metadata.labels },
  spec: {
      type: 'NodePort',
      ports: [{ port: 80, targetPort: 80, protocol: 'TCP' }],
      selector: deployment.spec.template.metadata.labels
  }
},{ provider });
