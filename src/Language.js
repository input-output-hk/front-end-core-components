import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const LanguageContext = createContext()
const Consumer = LanguageContext.Consumer

const Provider = ({
  children,
  location: { pathname, search, hash } = {},
  availableLanguages,
  alternativeLanguages = [],
  onUpdate = ({ lang, prevLang, url, prevURL }) => {},
  persistLang = true,
  useNavigator = true,
  useURL = true
}) => {
  const [ lang, setLanguage ] = useState(resolveLanguage(getDefaultLanguage()))

  /**
   * Persists language key to local storage when persistLang is true
   *
   * @param {String} language The language to persist to local storage
   * @returns {Void}
   */
  function persistToLocalStorage (language) {
    if (persistLang) window && window.localStorage && window.localStorage.setItem('lang', language)
  }

  /**
   * Fetches an initial default language going through all possible sources as follows
   *   - url
   *   - local storage
   *   - navigator
   *   - first language in availableLanguages
   *
   * @returns {String} Language key
   */
  function getDefaultLanguage () {
    const urlLang = useURL ? getURLLang() : ''
    // Use URL language where available
    if (isValidLanguage(urlLang)) return urlLang
    // Fallback to local storage or default config
    const localStorageLang = (persistLang && (window && window.localStorage && window.localStorage.getItem('lang'))) || ''
    // Users browser language
    const navigatorLanguage = ((useNavigator && (window && window.navigator && window.navigator.language)) || '').substring(0, 2)
    // Use local storage first as they have already visited the site
    if (isValidLanguage(localStorageLang)) return localStorageLang
    // Use the users browser language if it supported by the site
    if (isValidLanguage(navigatorLanguage)) return navigatorLanguage
    // Fall back to the first available language in the config
    return availableLanguages[0].key
  }

  /**
   * Resolves any potential language from alternativeLanguages to availableLanguages
   *
   * @param {String} lang Language key
   * @returns {String} Language key
   */
  function resolveLanguage (lang) {
    const filteredAlternativeLanguages = alternativeLanguages.filter(({ key }) => key === lang)
    if (filteredAlternativeLanguages.length > 0) return filteredAlternativeLanguages.shift().languageKey
    return lang
  }

  /**
   * Fetches the language object for a specific key from availableLanguages
   * or resolves from alternativeLanguages
   *
   * @param {String} language Language key
   * @returns {<Object|undefined>}
   */
  function getLanguage (language) {
    const lang = availableLanguages.filter(({ key }) => key === language).shift()
    if (!lang) language = (alternativeLanguages.filter(({ key }) => key === language).shift() || {}).languageKey
    return lang || availableLanguages.filter(({ key }) => key === language).shift()
  }

  /**
   * Checks is a language key is valid, i.e. is valid from availableLanguages
   * or alternativeLanguages
   *
   * @param {String} language Language key
   * @returns {Boolean}
   */
  function isValidLanguage (language) {
    return Boolean(getLanguage(language))
  }

  /**
   * Fetches the possible language from the URL
   *
   * @returns {String}
   */
  function getURLLang () {
    return pathname.split('/').splice(1)[0] || ''
  }

  /**
   * Checks if the language from the URL is a valid language
   *
   * @returns {Boolean}
   */
  function languageSetInURL () {
    return isValidLanguage(getURLLang())
  }

  /**
   * Builds the URL for a particular language
   *
   * @param {String} language Language key
   * @returns {String}
   */
  function getURL (language) {
    const pathParts = pathname.split('/').splice(1)
    if (languageSetInURL()) {
      pathParts.splice(0, 1, language)
    } else {
      pathParts.unshift(language)
    }

    return `/${pathParts.filter(part => Boolean(part)).join('/').replace(/\/{2,}/g, '/')}/${search}${hash}`
  }

  useEffect(() => {
    persistToLocalStorage(lang)
    const updateArgs = {
      lang,
      prevLang: null
    }

    if (useURL) {
      updateArgs.url = getURL(lang)
      updateArgs.prevURL = null
    }

    onUpdate(updateArgs)
  }, [])

  /**
   * Runs through all steps when updating the language
   *
   * @param {String} language Language key
   * @returns {Void}
   */
  function setLang (language) {
    if (!isValidLanguage(language)) throw new Error(`Invalid language ${language}`)
    persistToLocalStorage(language)

    const updateArgs = {
      lang: language,
      prevLang: lang
    }

    if (useURL) {
      updateArgs.url = getURL(language)
      updateArgs.prevURL = `${pathname}${search}${hash}`
    }

    onUpdate(updateArgs)
    setLanguage(language)
  }

  return (
    <LanguageContext.Provider
      value={{
        key: lang,
        setLang,
        locale: getLanguage(lang).locale,
        flag: getLanguage(lang).flag,
        label: getLanguage(lang).label,
        availableLanguages,
        alternativeLanguages
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

Provider.propTypes = {
  children: PropTypes.node.isRequired,
  location: (props, propName, componentName) => {
    const requiredKeys = [ 'pathname', 'search', 'hash' ]
    if (props.useURL && (!props[propName] || typeof props[propName] !== 'object' || Array.isArray(props[propName]))) {
      return new Error(`When 'useURL' is true, location must be provided as an object with location.pathname, location.search and location.hash`)
    } else if (props.useURL) {
      while (requiredKeys.length > 0) {
        const key = requiredKeys.shift()
        if (typeof props[propName][key] !== 'string') return new Error(`location.${key} must be a string`)
      }
    }
  },
  availableLanguages: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    flag: PropTypes.string,
    locale: PropTypes.string.isRequired
  })).isRequired,
  alternativeLanguages: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    languageKey: PropTypes.string.isRequired
  })),
  onUpdate: PropTypes.func,
  persistLang: PropTypes.bool,
  useNavigator: PropTypes.bool,
  useURL: PropTypes.bool
}

export {
  Provider,
  Consumer
}
