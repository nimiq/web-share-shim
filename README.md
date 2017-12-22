# A polyfill for the WebShare API
This polyfill will provide `navigator.share()` so you can share content on any device via WhatsApp, Telegram, Facebook, e-mail, and SMS.
Try the [demo](http://nimiq.github.io/web-share-shim/demo/)! The whole package is 9.6kB minified, 4kB gzipped and licensed under the MIT License.

## Usage
Open the share dialog by calling `navigator.share`:

```javascript
  navigator.share({
    title: 'Web Share Shim',
    text: 'Check out Web Share Shim — it rocks!',
    url: 'http://nimiq.github.io/web-share-shim',
  })
  .then( _ => console.log('Successful share'))
  .catch( error => console.log('Error sharing', error));
```

Attribute | Options | Default | Description
----------|---------|---------|------------
title | String | "" | A short title of what you are sharing.
text | String | "" | A text describing what you are sharing.
url | URL as String | "" | A link to what you are sharing.
facebookId | number | "158651941570418" | ID of your facebook app if you want to support sharing to facebook on a desktop device. (default ID for demo only)

## Build source code
You need to have gulp and all dependencies installed.

```sh
npm install 
npm install gulp
```
Then run `gulp` to build `web-share-shim.min.js`.
