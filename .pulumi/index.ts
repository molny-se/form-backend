import * as digitalocean from '@pulumi/digitalocean';
import * as k8s from '@pulumi/kubernetes';
import { provider, namespace } from './provider'
import { service as gotifyService, gotifyPassord } from './gotify'
import { env } from './env'
import { image } from './image'

export { gotifyPassord }

const appName = 'molny-form-backend'
const appLabels = { app: appName };
const domainName = 'form2.molny.se'

const domain = new digitalocean.Domain(appName, {
  name: domainName,
});

const deployment = new k8s.apps.v1.Deployment(
  appName,
  {
    spec: {
      selector: { matchLabels: appLabels },
      replicas: 1,
      template: {
        metadata: { labels: appLabels,  },
        spec: {
          containers: [
            {
              name: 'form-backend',
              image: image.id,
              env,
            }
          ],
        },
      },
    },
  },
  { provider },
);

const service = new k8s.core.v1.Service(appName, {
  metadata: { labels: deployment.spec.template.metadata.labels,  },
  spec: {
      type: 'NodePort',
      ports: [{ port: 3000, targetPort: 3000, protocol: 'TCP' }],
      selector: deployment.spec.template.metadata.labels
  }
},{ provider });

const ingress = new k8s.networking.v1beta1.Ingress(appName,
  {
    metadata: {
      labels: appLabels,
      annotations: {
        'cert-manager.io/issuer': 'letsencrypt-prod',
        'kubernetes.io/ingress.class': 'nginx',
        'nginx.ingress.kubernetes.io/server-snippet':
          'add_header X-Robots-Tag "noindex, nofollow";',
      },
    },
    spec: {
      tls: [
        {
          hosts: [domainName],
          secretName: `${appName}-tls`,
        },
      ],
      rules: [
        {
          host: domainName,
          http: {
            paths: [
              {
                path: '/trigger',
                backend: {
                  serviceName: service.metadata.name,
                  servicePort: service.spec.ports[0].port,
                }
              },
              {
                path: '/',
                backend: {
                  serviceName: gotifyService.metadata.name,
                  servicePort: gotifyService.spec.ports[0].port,
                }
              },
            ],
          },
        }
      ]
    }
  },
  {provider: provider}
);
