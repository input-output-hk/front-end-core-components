import React, { forwardRef, createContext } from 'react'
import PropTypes from 'prop-types'
import { isRelative } from './lib/url'

const LinkContext = createContext()

export const Provider = ({ children, component = 'a', isStatic = (href) => false, lang = '' }) => (
  <LinkContext.Provider
    value={{ lang, isStatic, component }}
  >
    {children}
  </LinkContext.Provider>
)

Provider.propTypes = {
  children: PropTypes.node.isRequired,
  lang: PropTypes.string,
  isStatic: PropTypes.func,
  component: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ])
}

const LinkInner = (props) => {
  // Transform original href to prefix language where applicable
  function getHref () {
    if (props.lang && isRelative(props.href) && !props.isStatic(props.href) && props.href.substring(1, props.lang.length + 1) !== props.lang) return `/${props.lang}${props.href}`
    return props.href
  }

  const Component = props.component
  const componentProps = {
    ...props,
    href: getHref(),
    isStatic: props.isStatic(props.href),
    isRelative: isRelative(props.href)
  }

  delete componentProps.component
  if (typeof Component === 'string') {
    delete componentProps.isStatic
    delete componentProps.isRelative
  }

  return (
    <Component {...componentProps} />
  )
}

const Link = forwardRef((props, ref) => (
  <LinkContext.Consumer>
    {({ lang, isStatic = () => false, component = 'a' } = {}) => (
      <LinkInner {...props} ref={ref} lang={lang} isStatic={isStatic} component={component} />
    )}
  </LinkContext.Consumer>
))

LinkInner.propTypes = {
  href: PropTypes.string.isRequired,
  lang: PropTypes.string,
  isStatic: PropTypes.func,
  ref: PropTypes.any,
  component: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ])
}

Link.propTypes = {
  href: PropTypes.string.isRequired
}

export default Link
