import React from 'react'
import Image, { Provider } from './Image'
import { mount } from 'enzyme'

const DEFAULT_PROPS = {
  src: '/static/image.jpeg',
  alt: 'An image'
}

function getWrapper ({ props = {}, providerProps = {} } = {}) {
  return mount(
    <Provider {...providerProps}>
      <Image
        {...DEFAULT_PROPS}
        {...props}
      />
    </Provider>
  )
}

describe('<Image />', () => {
  test('it renders correctly with minimal props', () => {
    expect(getWrapper()).toMatchSnapshot()
  })

  describe('when no provider exists', () => {
    test('it still renders the image', () => {
      expect(mount(<Image {...DEFAULT_PROPS} />)).toMatchSnapshot()
    })

    describe('uploadcare images', () => {
      test('it still renders using the default breakpoints', () => {
        expect(mount(<Image {...DEFAULT_PROPS} src='https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/' />)).toMatchSnapshot()
      })
    })
  })

  describe('when a custom component is provided', () => {
    let wrapper
    beforeEach(() => {
      // eslint-disable-next-line react/prop-types
      const CustomComponent = ({ src, alt, width }) => (
        <img src={src} alt={alt} width={width} />
      )

      wrapper = getWrapper({ props: { component: CustomComponent, componentProps: { width: 45 } } })
    })

    test('the it renders the img with the custom component', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('uploadcare images', () => {
    let src
    beforeEach(() => {
      src = 'https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/'
    })

    test('it renders the uploadcare picture correctly', () => {
      expect(getWrapper({ props: { src } })).toMatchSnapshot()
    })

    test('it maintains transparency with maintainTransparency', () => {
      expect(getWrapper({ props: { src, maintainTransparency: true } })).toMatchSnapshot()
    })

    describe('size factor', () => {
      test('a higher size factor increases image size', () => {
        expect(getWrapper({ props: { src, sizeFactor: 1.5 } })).toMatchSnapshot()
      })

      test('a lower size factor decreases image size', () => {
        expect(getWrapper({ props: { src, sizeFactor: 0.5 } })).toMatchSnapshot()
      })
    })

    describe('when a custom component is provided', () => {
      let wrapper
      beforeEach(() => {
        // eslint-disable-next-line react/prop-types
        const CustomComponent = ({ src, alt, width }) => (
          <img src={src} alt={alt} width={width} />
        )

        wrapper = getWrapper({ props: { src, component: CustomComponent, componentProps: { width: 45 } } })
      })

      test('the it renders the upload care image with the custom component', () => {
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('using custom breakpoints', () => {
      let breakpoints
      beforeEach(() => {
        breakpoints = [ 2000, 1800, 1200, 800, 500 ]
      })

      test('it renders correctly with the breakpoints', () => {
        expect(getWrapper({ providerProps: { breakpoints }, props: { src } })).toMatchSnapshot()
      })
    })

    describe('custom domain images on uploadcare', () => {
      let uploadcareDomains
      beforeEach(() => {
        uploadcareDomains = [ 'uploadcare.example.org' ]
      })

      test('images on uploadcare.example.org use the uploadcare image', () => {
        expect(getWrapper({
          providerProps: { uploadcareDomains },
          props: { src: 'http://uploadcare.example.org/c19187bc-6028-45fa-bf23-18dd31cd7636/' }
        })).toMatchSnapshot()
      })
    })
  })
})
