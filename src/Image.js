import React, { createContext } from 'react'
import PropTypes from 'prop-types'

const ImageContext = createContext()

const DEFAULT_BREAKPOINTS = [400, 600, 800, 1000, 1500, 2000, 3000]

const getSortedBreakpoints = (breakpoints) => {
  const sortedBreakpoints = [...breakpoints]
  sortedBreakpoints.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
  return sortedBreakpoints
}

export const Provider = ({ children, uploadcareDomains = [], breakpoints = DEFAULT_BREAKPOINTS }) => (
  <ImageContext.Provider value={{ uploadcareDomains, breakpoints: getSortedBreakpoints(breakpoints) }}>
    {children}
  </ImageContext.Provider>
)

Provider.propTypes = {
  children: PropTypes.node.isRequired,
  uploadcareDomains: PropTypes.arrayOf(PropTypes.string),
  breakpoints: PropTypes.arrayOf(PropTypes.number)
}

// Outputs <picture> tag with responsive sources and fallback img
const UploadCareImage = ({ src, sizeFactor = 1, alt, maintainTransparency, component = 'img', componentProps = {}, breakpoints }) => {
  function getSource(type) {
    const imageSrc = `${src}-/format/${type.replace(/^image\//, '')}/`
    return (
      <source
        srcSet={breakpoints.map(breakpoint => `${imageSrc}-/resize/${Math.round(Math.min(3000, breakpoint * sizeFactor))}/ ${Math.round(breakpoint * sizeFactor)}w`).join(', ')}
        sizes={breakpoints.map(breakpoint => `(max-width: ${breakpoint}px) ${Math.round(breakpoint * sizeFactor)}px`).concat('100vw').join(', ')}
        type={type}
      />
    )
  }

  function getDefaultSrc() {
    let defaultSrc = src
    if (!maintainTransparency) defaultSrc = `${defaultSrc}-/format/jpeg/`
    if (maintainTransparency) defaultSrc = `${defaultSrc}-/format/png/`

    return defaultSrc
  }

  const ImgComponent = component
  return (
    <picture>
      {maintainTransparency &&
        <>
          {getSource('image/webp')}
          {getSource('image/png')}
        </>
      }
      {!maintainTransparency && getSource('image/jpeg')}
      <ImgComponent src={getDefaultSrc()} alt={alt} {...componentProps} />
    </picture>
  )
}

UploadCareImage.propTypes = {
  src: PropTypes.string.isRequired,
  sizeFactor: PropTypes.number,
  alt: PropTypes.string.isRequired,
  maintainTransparency: PropTypes.bool,
  component: PropTypes.func,
  componentProps: PropTypes.object,
  breakpoints: PropTypes.arrayOf(PropTypes.number)
}

const ImageInner = (props) => {
  const isUploadeCareImage = () => {
    let uploadcareImage = false
    const uploadcareDomains = ['ucarecdn.com', ...props.uploadcareDomains]
    while (uploadcareDomains.length > 0 && !uploadcareImage) {
      const domain = uploadcareDomains.shift()
      if (props.src.match(new RegExp(`^(https?:)?(//)?${domain}\\/.*$`))) uploadcareImage = true
    }

    return uploadcareImage
  }

  if (isUploadeCareImage()) {
    return <UploadCareImage {...props} breakpoints={props.breakpoints} />
  } else {
    const ImgComponent = props.component || 'img'
    return <ImgComponent src={props.src} alt={props.alt} {...(props.componentProps || {})} />
  }
}

ImageInner.propTypes = {
  component: PropTypes.func,
  componentProps: PropTypes.object,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  sizeFactor: PropTypes.number,
  maintainTransparency: PropTypes.bool,
  uploadcareDomains: PropTypes.arrayOf(PropTypes.string),
  breakpoints: PropTypes.arrayOf(PropTypes.number)
}

const Image = (props) => (
  <ImageContext.Consumer>
    {({ uploadcareDomains = [], breakpoints = getSortedBreakpoints(DEFAULT_BREAKPOINTS) } = {}) => (
      <ImageInner {...props} uploadcareDomains={uploadcareDomains} breakpoints={breakpoints} />
    )}
  </ImageContext.Consumer>
)

export default Image
