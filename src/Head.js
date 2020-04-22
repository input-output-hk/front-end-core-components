import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet-async'
import { isRelative } from './lib/url'

const ALLOW_DUPLICATE_TAGS = [ 'og:locale:alternate' ]

/**
 * Generates og:locale:alternative head tags from available locales
 *
 * @param {Array<String>} availableLocales
 * @param {String} locale
 * @returns {Array<Object>}
 */
function getGeneratedHeadData (availableLocales, locale) {
  const alternativeLocales = [ ...availableLocales ]
  alternativeLocales.splice(availableLocales.indexOf(locale), 1)
  return alternativeLocales.map(locale => ({
    name: 'og:locale:alternate',
    content: locale
  }))
}

/**
 * Builds the head tags from three sources from highest to lowest priority i.e.
 * component overwrites duplicate page or site meta data and so on and so forth
 *
 *  - component level meta data
 *  - page level meta data
 *  - site level meta data
 *
 *
 * @param {Object} params
 * @param {Object} params.componentHeadData
 * @param {Object} params.pageHeadData
 * @param {Object} params.siteHeadData
 * @param {Array<String>} params.availableLocales
 * @param {String} params.locale
 * @param {String} params.url
 * @returns {Object} object with title and complete meta array
 */
function getHeadData ({ component, page, site, availableLocales, locale, url }) {
  const filteredPage = {}
  Object.keys(page).forEach(key => {
    if (page[key]) filteredPage[key] = page[key]
  })

  const componentMeta = component.meta || []
  if (component.title) {
    componentMeta.push({ name: 'twitter:title', content: component.title })
    componentMeta.push({ name: 'og:title', content: component.title })
  }

  const metaNames = []
  const meta = []
  const unfilteredMeta = [
    ...(getGeneratedHeadData(availableLocales, locale)),
    ...componentMeta,
    ...(filteredPage.meta || []),
    ...(site.meta || [])
  ]

  const getFileURL = file => isRelative(file) ? `${url}${file}` : file
  unfilteredMeta.forEach((tag) => {
    if (!tag.content && !tag.file) return
    if (ALLOW_DUPLICATE_TAGS.includes(tag.name) || !metaNames.includes(tag.name)) meta.push({ name: tag.name, content: tag.content || getFileURL(tag.file) })
    metaNames.push(tag.name)
  })

  return {
    title: componentMeta.title || filteredPage.title || site.title,
    meta: meta.map(tag => {
      if (tag.name.match(/^og:/)) return { property: tag.name, content: tag.content }
      return tag
    })
  }
}

const Head = ({
  site: { title: siteTitle = '', meta: siteMeta = [] } = {},
  page: { title: pageTitle = '', meta: pageMeta = [] } = {},
  component: { title: componentTitle = '', meta: componentMeta = [] } = {},
  locale,
  availableLocales = [],
  lang,
  url,
  children
}) => {
  const completeHeadData = getHeadData({
    component: { title: componentTitle, meta: componentMeta },
    page: { title: pageTitle, meta: pageMeta },
    site: { title: siteTitle, meta: siteMeta },
    availableLocales,
    locale,
    url
  })

  return (
    <Helmet
      title={completeHeadData.title}
      meta={completeHeadData.meta}
    >
      {lang && <html lang={lang} />}
      {children}
    </Helmet>
  )
}

Head.propTypes = {
  site: PropTypes.shape({
    title: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      content: PropTypes.string,
      file: PropTypes.string
    }))
  }),
  page: PropTypes.shape({
    title: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      content: PropTypes.string,
      file: PropTypes.string
    }))
  }),
  component: PropTypes.shape({
    title: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      content: PropTypes.string,
      file: PropTypes.string
    }))
  }),
  locale: PropTypes.string,
  availableLocales: PropTypes.arrayOf(PropTypes.string),
  lang: PropTypes.string,
  url: (props, propName, componentName) => {
    if (typeof props[propName] !== 'string') return new Error(`'${propName}' prop for component '${componentName}' must be a string`)
    if (!props[propName].match(/^(https?:)\/\/[^/]+$/)) {
      return new Error(
        `'${propName}' prop for component '${componentName}' must be a valid URL starting with "http://", "https://" or "//" with no trailing slash, e.g. "https://example.org" or "http://localhost:8080"`
      )
    }
  },
  children: PropTypes.node
}

export default Head
