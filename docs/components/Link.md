# Link

The Link component is intended to be used alongside the [Language](Language.md) state. It can be used without any language state although at that point it's redundant. It is not directly dependent on the [Language](Language.md) component and is compatible with other solutions via it's own Provider (See [usage](#usage) below for details).

## Dependencies

* react `^16.3`
* prop-types `^15.6.2`

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
  <Link>
    {({ href }) => (
      <a href={href}>Language prefixed href when setup for language support</a>
    )}
  </Link>
)

```

#### Expanded example

The below example expands on the functionality provided by the core Link component, by rendering different components. The example assumes usage of Material UI as well as Gatsby, but you can easily swap these libraries for others. The idea is the core Link component handles href resolution.

```javascript
import React from 'react'
import PropTypes from 'prop-types'
import CoreLink from '@input-output-hk/front-end-core-components/components/Link'
import { Link as GatsbyLink } from 'gatsby'
import { Link as MUILink } from '@material-ui/core'

const Link = (props) => {
  const onClick = ({ href, relative }) => (e) => {
    // Do some analytics here
    props.onClick && props.onClick(e)
  }

  const getLinkProps = ({ href, static, relative, ref }) => {
    const linkProps = {
      ...props,
      ref,
      href,
      onClick: onClick({ href, relative }),
      component: relative && !static ? GatsbyLink : 'a'
    }

    if (relative && !static) {
      linkProps.to = props.href
      delete linkProps.href
    }

    return linkProps
  }

  return (
    <CoreLink href={props.href}>
      {({ href, static, relative, ref }) => (
        <MUILink {...getLinkProps({ href, static, relative, ref })} />
      )}
    </CoreLink>
  )
}

Link.propTypes = {
  href: PropTypes.string.isRequired,
  tracking: PropTypes.shape({
    label: PropTypes.string.isRequired
  }),
  onClick: PropTypes.func
}


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
