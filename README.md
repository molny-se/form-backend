![Test status][tests]
<br />
<p align="center">
  <h3 align="center">form-backend</h3>
  <div align="center">
    <img src=".github/forms.png" width="500" />
  </div>

  <p align="center">
      An easy to use batteries included form backend to use with for example static sites.
  </p>
</p>

## Usage example

See `docker-compose.yml` for example environment

### Environment variables

This is app is controlled by environment variables for easy configuration.

* `EMAIL` - where to send the email
* `REQUIRED_FIELDS` - Extra formfields to require in validation
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
[tests]: https://github.com/molny/form-backend/workflows/CI/badge.svg
