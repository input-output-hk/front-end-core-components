# Head

The Head component uses [react-helmet-async](https://www.npmjs.com/package/react-helmet-async) to render head tags. It's based on the premise that there are 3 incoming sources of head tag data.

* Site level head data
* Page level head data
* Component level head data

In ascending order of importance, site, page and component data is merged and duplicates removed to form the final set of head tags. For example if the meta description tag is set within the site head data, but then also set at the page level head data, then the value from the site level is overwritten by the page level.

Assume the following:

```javascript
const site = {
  title: 'My website',
  meta: [
    { name: 'description', content: 'A description of my website' },
    { name: 'og:description', content: 'Open graph description' }
  ]
}

const page = {
  title: 'My page on my website',
  meta: [
    { name: 'description', content: 'A description of my page on my website' }
  ]
}

const component = {
  meta: [
    { name: 'description', content: 'A description of a specific page' }
  ]
}
```

will result in the output:

```html
<head>
  ...
  <!-- Page level overwites site level title -->
  <title>My page on my website</title>
  <!-- Component level overwrites page and site level description meta tag -->
  <meta name="description" content="A description of a specific page" />
  <!-- Open graph (og:) tags are transformed automatically to use property instead of name -->
  <meta property="og:description" content="Open graph description">
  ...
</head>
```

## Dependencies

* react `^16.3`
* prop-types `^15.6.2`
* react-helmet-async `^1.0.4`

## Reference

| prop name | description | type | required? | default value |
| --------- | ----------- | ---- | --------- | ------------- |
| site | Site level (global) head tag data and lowest priority | `Array<Object>` | ✗ | { title: '', meta: [ ] } |
| site.title | Title at a global level | `String` | ✗ | - |
| site.meta | Meta tags at a global level. (See [meta tag structure](#meta-tag-structure) for Object shape) | `Array<Object>` | ✗ | - |
| page | Page level (one above site/global) head tag data and medium priority | `Array<Object>` | ✗ | { title: '', meta: [ ] } |
| page.title | Title at page level | `String` | ✗ | - |
| page.meta | Meta tags at page level. (See [meta tag structure](#meta-tag-structure) for Object shape) | `Array<Object>` | ✗ | - |
| component | Component level (one above page) head tag data and highest priority | `Array<Object>` | ✗ | { title: '', meta: [ ] } |
| component.title | Title at component level | `String` | ✗ | - |
| component.meta | Meta tags at component level. (See [meta tag structure](#meta-tag-structure) for Object shape) | `Array<Object>` | ✗ | - |
| locale | Locale to be used for the site | `String` | ✗ | - |
| availableLocales | All available locales for the site | `Array<String>` | ✗ | - |
| lang | The language of the site | `String` | ✗ | - |
| url | The URL for the site, used to resolve relative file paths on meta tags | `String` | ✗ | - |
| children | Child components, see [react-helmet-async](https://www.npmjs.com/package/react-helmet-async) for details | `Node` | ✗ | - |


### Meta tag structure

| prop name | description | type | required? | default value |
| --------- | ----------- | ---- | --------- | ------------- |
| name | The name of the tag, `name` attribute | `String` | ✓ | - |
| content | The content of the tag, `content` attribute. Used instead of `file` prop | `String` | ✗/✓ | - |
| file | Relative or absolute path to corresponding file, `content` attribute. Used instead of `content` prop | `String` | ✗/✓ | - |

## Usage

```javascript
import React from 'react'
import Head from '@input-output-hk/front-end-core-components/components/Head'

const MyApp = () => (
  <div>
    <Head
      // Site level data
      site={{
        title: 'My website',
        meta: [
          { name: 'description' content: 'My websites description' }
        ]
      }}
      // Page level data
      page={{
        title: 'My websites page',
        meta: [
          { name: 'description' content: 'My websites page description' }
        ]
      }}
      // Component level data
      component={{
        title: 'My websites pages component',
        meta: [
          { name: 'description' content: 'My websites pages component description' }
        ]
      }}
      // Optional language for the site
      lang='en'
      // Optional locale for the website
      locale='en-US'
      // Optional list of available locales for your website
      availableLocales={[ 'en-US', 'fr-FR' ]}
      // Full URL used for meta data which requires full URL's such as Twitter tags
      // and open graph tags
      // Remove any trailing slash here
      url='https://mywebsite.com'
    />
    <body>
      ...
    </body>
  </div>
)

```

The example above is to show how the props can be passed to the `Head` component. At IOHK we use the [Gatsby](https://www.gatsbyjs.org/) framework, hence why we have split the head data into 3 distinct levels of priority. The meta data we use comes from markdown files and is transformed at build time to be consumed by the `Head` component.
