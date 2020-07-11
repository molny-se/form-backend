import * as pulumi from '@pulumi/pulumi';
import * as docker from '@pulumi/docker';

const config = new pulumi.Config();
const dockerPassword = config.requireSecret('dockerPassword');

const appName = 'molny-form-backend'

export const image = new docker.Image(appName, {
  build: '../',
  imageName: 'molny/form-backend',
  registry: {
    username: 'benjick',
    password: dockerPassword,
    server: 'docker.io'
  }
})
