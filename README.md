![Test status][tests]
<br />
<p align="center">
  <h1 align="center">form-backend</h1>
  <div align="center">
    <img src=".github/forms.png" width="500" />
  </div>

  <p align="center">
      An easy to use batteries included form backend to use with for example static sites.
  </p>
</p>

## Featuring

<table>
  <tr>
    <td>Email via Sendgrid</td>
    <td>Push notifications via Gotify</td>
  </tr>
  <tr>
    <td style="width:50%;"><img src=".github/logos/sendgrid.png"></td>
    <td style="width:50%;"><img style="margin: 20px; width: 50%; display: block;" src=".github/logos/gotify.png"></td>
  </tr>
 </table>

## Usage example

```yaml
version: '3'

services:
  gotify:
    image: gotify/server
    ports:
      - 1337:80
    environment:
      - GOTIFY_DEFAULTUSER_PASS=demo
    volumes:
      - "./gotify_data:/app/data"

  backend:
    image: molny/form-backend
    ports:
      - 3000:3000
    environment:
      - EMAIL=hej@molny.se
      - GOTIFY__SERVER=http://gotify
      - GOTIFY__TOKEN=foo
      - SENDGRID__API_KEY=bar
```

```js
const object = {
  name: 'Max Malm',
  email: 'max@example.com',
  message: 'I like turtles!',
}
await fetch('http://localhost:3000/trigger', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(object),
})
```

### Environment variables

This is app is controlled by environment variables for easy configuration.

* `EMAIL` - where to send the email
* `FROM_EMAIL` - defaults to `form-backend@example.com`
* `FROM_NAME` - defaults to `form-backend by Molny`
* `REQUIRED_FIELDS` - extra formfields to require in validation, defaults to `message,name,email`
* `SUBJECT` - email subject, defaults to `Message from {name}!`
* `GOTIFY__SERVER` - Gotify server (e.g. http://services)
* `GOTIFY__TOKEN` - Gotify application token
* `SENDGRID__API_KEY` - SendGrid API key

## Development setup

```sh
yarn
docker-compose up -d gotify
yarn dev
```

<!-- Markdown link & img dfn's -->
[tests]: https://github.com/molny-se/form-backend/workflows/Deployment/badge.svg
