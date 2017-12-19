# Web share API shim
This shim will provide `navigator.share()` so you can share content on any device via WhatsApp, Telegram, Facebook, e-mail, and SMS.
Try the [demo](demo/)! The whole package is 9.6kB minified, 4kB gzipped and licensed under the MIT License.

## Usage
Open the share dialog by calling `navigator.share`:

```javascript
  navigator.share({
    title: 'Web Fundamentals',
    text: 'Check out Web Fundamentals — it rocks!',
    url: 'https://developers.google.com/web',
  })
  .then( _ => console.log('Successful share'))
  .catch( error => console.log('Error sharing', error));
```

Attribute | Options | Default | Description
----------|---------|---------|------------
title | String | "" | A short title of what you are sharing.
text | String | "" | A text describing what you are sharing.
url | URL as String | "" | A link to what you are sharing.

## Build source code
You need to have gulp and all dependencies installed.

```sh
npm install 
npm install gulp
```
Then run `gulp` to start the build preocess.
