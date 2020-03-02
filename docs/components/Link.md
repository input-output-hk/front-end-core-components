# Link

The Link component is intended to be used alongside the [Language](Language.md) state. It can be used without any language state although at that point it's redundant. It is not directly dependent on the [Language](Language.md) component and is compatible with other solutions via it's own Provider (See [usage](#usage) below for details).

## Dependencies

* react `^16.3`
* prop-types `^15.6.2`

## Reference

### Provider

| prop name | description | type | required? | default value |
| --------- | ----------- | ---- | --------- | ------------- |
| lang | Current language in the URL | `String` | ✗ | - |
| isStatic | Callback to check if a URL is static, accepts single argument of href (String) and should return a Boolean | `Function` | ✗ | (href) => false |
| children | Child nodes | `Node` | ✓ | - |
| component | The component to use to render the Link | `String\|Function` | ✗ | a |

### Link

| prop name | description | type | required? | default value |
| --------- | ----------- | ---- | --------- | ------------- |
| href | The URL for the link with or without a language prefix | `String` | ✓ | - |
| children | Child nodes | `Node` | ✓ | - |

Any other props are forwarded to the component defined on the Provider.

## Usage

### Provider (optional)

Put the provider high up in your application component tree, usually within `App.js` or the main entry point to your application/website.

```javascript
import React from 'react'
import { Provider } from '@input-output-hk/front-end-core-components/components/Link'

export default () => (
  // The lang prop and the isStatic prop are completely optional.
  // By default the isStatic prop will be a function returning false
  <Provider lang='' isStatic={(href) => {
    // check if href is static for your use case
    return false
  }}>
    ...
    <p>The rest of your app</p>
    ...
  </Provider>
)

```

### Link (consumes data from Provider where provided)

#### Basic example

The example below is the most basic and simply utilises the Link feature of transforming the href.

```javascript
import React from 'react'
import Link from '@input-output-hk/front-end-core-components/components/Link'

export default () => (
  // This will render the component (by default <a />) with the
  // normalized href
  <Link href='/'>
    Language prefixed href when setup for language support
  </Link>
)

```

## Example using Language state

An example making use of the [Language](Language.md) state, as well as implementing a solution for `isStatic`.

### Provider

```javascript
import React from 'react'
import Language from '@input-output-hk/front-end-core-components/components/Language'
import { Provider } from '@input-output-hk/front-end-core-components/components/Link'

export default () => (
  <Language.Consumer>
    {({ lang }) => (
      <Provider lang={lang} isStatic={(href) => {
        // Any href starting with /static/ is assumed a static href
        if (href.match(/^\/static\//)) return true
        return false
      }}>
        ...
        <p>The rest of your app</p>
        ...
      </Provider>
    )}
  </Language.Consumer>
)

```
