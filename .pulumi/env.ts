import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import { provider } from './provider'
import { service as gotifyService } from './gotify'

const config = new pulumi.Config();
const sendgridToken = config.requireSecret('sendgridToken');
const gotifyToken = config.requireSecret('gotifyToken');
const email = config.require('email')
const fromEmail = config.require('fromEmail')
const fromName = config.require('fromName')

const appName = 'molny-form-backend'

const secrets = new k8s.core.v1.Secret(
  appName,
  {
    stringData: {
      'gotify-token': gotifyToken,
      'gotify-server': pulumi.interpolate`http://${gotifyService.metadata.name}`,
      'email': email,
      'sendgrid-token': sendgridToken,
      'from-email': fromEmail,
      'from-name': fromName
    },
  },
  { provider },
);

const secretsMapping = [
  { name: 'GOTIFY__SERVER', key: 'gotify-server' },
  { name: 'GOTIFY__TOKEN', key: 'gotify-token' },
  { name: 'EMAIL', key: 'email' },
  { name: 'SENDGRID__API_KEY', key: 'sendgrid-token' },
  { name: 'FROM_EMAIL', key: 'from-email' },
  { name: 'FROM_NAME', key: 'from-name' },
];

export const env: k8s.types.input.core.v1.EnvVar[] = secretsMapping.map(
  ({ name, key }) => ({
    name,
    valueFrom: {
      secretKeyRef: {
        name: secrets.metadata.name,
        key,
      },
    },
  }),
);
