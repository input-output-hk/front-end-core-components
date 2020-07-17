import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const ThemeContext = createContext()
const Consumer = ThemeContext.Consumer

const Provider = ({
  children,
  themes,
  onUpdate = ({ theme, prevTheme }) => {},
  persistTheme = true,
  transformTheme = (theme) => theme.config
}) => {
  const [ theme, updateTheme ] = useState(getInitialTheme())

  useEffect(() => {
    const localTheme = getInitialTheme()
    persistToLocalStorage(localTheme)
    onUpdate({ theme: localTheme, prevTheme: null })
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
    if (persistTheme && global.window && global.window.localStorage && global.window.localStorage.getItem) theme = global.window.localStorage.getItem('theme') || ''
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
    if (persistTheme && global.window && global.window.localStorage && global.window.localStorage.setItem) global.window.localStorage.setItem('theme', theme)
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
    updateTheme(newTheme)
  }

  /**
   * Gets the theme configuration for the theme key (untransformed)
   *
   * @returns {Object}
   */
  function getOriginalTheme () {
    return themes.filter(({ key }) => key === theme).shift() || {}
  }

  /**
   * Gets the theme configuration for the theme key (transformed)
   *
   * @returns {Object}
   */
  function getTheme () {
    return transformTheme(getOriginalTheme())
  }

  return (
    <ThemeContext.Provider
      value={{
        key: theme,
        theme: getTheme(),
        originalTheme: getOriginalTheme(),
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
  persistTheme: PropTypes.bool,
  transformTheme: PropTypes.func
}

export {
  Provider,
  Consumer
}

export default {
  Provider,
  Consumer
}
