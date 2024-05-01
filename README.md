# Faros.sh web

[![Build Status](https://drone-kr.webrelay.io/api/badges/synpse-hq/synpse-site/status.svg)](https://drone-kr.webrelay.io/synpse-hq/synpse-site)

## URLs

- Production: https://synpse.com
- Preview: https://19ff7f76-2268-4b1a-8451-c38759430cb6.synpse.net

Preview environment servers future articles too.

## Prerequisites

- hugo - https://gohugo.io version v0.85.0-724D5DB5 (install "extended" version!)
- node.js 15.6.0 (use https://github.com/tj/n)
    ```
    npm install -g n
    n 15.6.0
    ```
- `yarn`

## Setup

1. `yarn install`
2. `hugo server -D`


## useful links:

Single page variables - https://gohugo.io/variables/page/
Taxonomy - https://gohugo.io/variables/taxonomy/

GIF size: 1250x900 which is on the limit to which page to mobile

## Code snips in blogs:

An example:
```
\``` html  {linenos=table,hl_lines=[200,"202-203"],linenostart=199}
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Hello, world!</title>
  </head>
  <body>
    <h1>Hello, world!</h1>
  </body>
</html>
\```

```


## Deployment

Deployment happens through Drone. For main bucket GCS auto detects settings. For Preview environment, you need to tell GCS that this is a website:

```
gcloud storage buckets update gs://synpse.com --web-main-page-suffix=index.html --web-error-page=404.html
```
