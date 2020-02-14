import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const ThemeContext = createContext()
const Consumer = ThemeContext.Consumer

const Provider = ({
  children,
  themes,
  onUpdate = ({ theme, prevTheme }) => {},
  persistTheme = true
}) => {
  const [ theme, updateTheme ] = useState(getInitialTheme())

  useEffect(() => {
    persistToLocalStorage(theme)
    onUpdate({ theme, prevTheme: null })
  }, [])

  /**
   * Get the initial theme by first searching localStorage when
   * persistTheme is true, falling back to the first theme in the
   * themes array
   *
   * @returns {String} Theme key
   */
  function getInitialTheme () {
    let theme
    if (persistTheme && window && window.localStorage && window.localStorage.getItem) theme = window.localStorage.getItem('theme') || ''
    return isValidTheme(theme)
      ? theme
      : themes[0].key
  }

  /**
   * Persists the theme to local storage if persistTheme is true
   *
   * @param {String} theme
   * @returns {Void}
   */
  function persistToLocalStorage (theme) {
    if (persistTheme && window && window.localStorage && window.localStorage.setItem) window.localStorage.setItem('theme', theme)
  }

  /**
   * Checks if a theme exists i.e. is valid
   *
   * @param {String} theme Theme key
   * @returns {Boolean}
   */
  function isValidTheme (theme) {
    return Boolean(themes.filter(({ key }) => key === theme).shift())
  }

  /**
   * Sets a new theme, will do nothing when setting the same theme
   *
   * @param {String} newTheme Theme key
   * @returns {Void}
   */
  function setTheme (newTheme) {
    if (newTheme === theme) return
    if (!isValidTheme(newTheme)) throw new Error(`Theme ${newTheme} does not exist`)
    persistToLocalStorage(newTheme)
    onUpdate({ theme: newTheme, prevTheme: theme })
    updateTheme(theme)
  }

  /**
   * Gets the theme configuration for the theme key
   *
   * @returns {Object}
   */
  function getTheme () {
    return (themes.filter(({ key }) => key === theme).shift() || {})
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: getTheme(),
        setTheme,
        themes
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

Provider.propTypes = {
  children: PropTypes.any,
  themes: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired
  })).isRequired,
  onUpdate: PropTypes.func,
  persistTheme: PropTypes.bool
}

export {
  Provider,
  Consumer
}
