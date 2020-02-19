# Markdown

Markdown renderer, essentially a wrapper for [react-markdown](https://github.com/rexxars/react-markdown) providing a way of setting global default props via the [React Context API](https://reactjs.org/docs/context.html).

## Dependencies

* react `^16.3`
* prop-types `^15.6.2`
* react-markdown `^4.2.2`

## Reference

### Provider

| prop name | description | type | required? | default value |
| --------- | ----------- | ---- | --------- | ------------- |
| markdownProps | Props forwarded to [ReactMarkdown](https://github.com/rexxars/react-markdown) | `Array<Object>` | ✗ | - |
| children | Child nodes | `Node` | ✓ | - |

### Markdown

See [ReactMarkdown](https://github.com/rexxars/react-markdown) for available props. Will consume props from `Provider` where specified, any props defined directly on `Markdown` will overwrite props set via the `Provider`.

## Usage

### Provider (optional)

Put the provider high up in your application component tree, usually within `App.js` or the main entry point to your application/website.

```javascript
import React from 'react'
import { Provider } from '@input-output-hk/front-end-core-components/components/Markdown'

export default () => (
  <Provider markdownProps={{ ... }}>
    ...
    <p>The rest of your app</p>
    ...
  </Provider>
)

```

### Markdown

```javascript
import React from 'react'
import Markdown from '@input-output-hk/front-end-core-components/components/Markdown'

export default () => (
  <Markdown>
    {myMarkdown}
  </Markdown>
)

```
