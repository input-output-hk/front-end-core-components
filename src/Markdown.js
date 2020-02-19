import React, { createContext } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'

const MarkdownContext = createContext()

export const Provider = ({ markdownProps = {}, children }) => (
  <MarkdownContext.Provider value={{ markdownProps }}>
    {children}
  </MarkdownContext.Provider>
)

Provider.propTypes = {
  // Props used in ReactMarkdown component, can be overwritten at local component level
  // see https://github.com/rexxars/react-markdown
  markdownProps: PropTypes.object,
  children: PropTypes.node
}

const Markdown = (props) => (
  <MarkdownContext.Consumer>
    {({ markdownProps = {} } = {}) => (
      <ReactMarkdown
        {...markdownProps}
        {...props}
        renderers={{ ...markdownProps.renderers, ...props.renderers }}
        parserOptions={{ ...markdownProps.parserOptions, ...props.parserOptions }}
      />
    )}
  </MarkdownContext.Consumer>
)

Markdown.propTypes = {
  renderers: PropTypes.object,
  parserOptions: PropTypes.object
}

export default Markdown
