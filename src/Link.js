import React, { forwardRef, createContext } from 'react'
import PropTypes from 'prop-types'
import { isRelative } from './lib/url'

const LinkContext = createContext()

export const Provider = ({ children, isStatic = (href) => false, lang = '' }) => (
  <LinkContext.Provider
    value={{ lang, isStatic }}
  >
    {children}
  </LinkContext.Provider>
)

Provider.propTypes = {
  children: PropTypes.node.isRequired,
  lang: PropTypes.string,
  isStatic: PropTypes.func
}

const LinkInner = ({ href, lang = '', isStatic = (href) => false, children, ref }) => {
  // Transform original href to prefix language where applicable
  function getHref () {
    if (lang && isRelative(href) && !isStatic(href) && href.substring(1, lang.length + 1) !== lang) return `/${lang}${href}`
    return href
  }

  return children({ href: getHref(), isStatic: isStatic(href), isRelative: isRelative(href), ref })
}

const Link = forwardRef((props, ref) => (
  <LinkContext.Consumer>
    {({ lang, isStatic } = {}) => (
      <LinkInner {...props} ref={ref} lang={lang} isStatic={isStatic} />
    )}
  </LinkContext.Consumer>
))

LinkInner.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  lang: PropTypes.string,
  isStatic: PropTypes.func,
  ref: PropTypes.any
}

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired
}

export default Link
