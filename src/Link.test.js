import React from 'react'
import Link, { Provider } from './Link'
import { mount } from 'enzyme'

const DEFAULT_PROPS = {
  href: '/'
}

function getWrapper ({ props = {}, providerProps = {} } = {}) {
  return mount(
    <Provider {...providerProps}>
      <Link
        {...DEFAULT_PROPS}
        {...props}
      >
        A link
      </Link>
    </Provider>
  )
}

describe('<Link />', () => {
  test('it renders correctly with minimal props', () => {
    expect(getWrapper()).toMatchSnapshot()
  })

  describe('when the context provider has a lang set', () => {
    let lang
    beforeEach(() => {
      lang = 'en'
    })

    test('it prefixes the URL with the lang', () => {
      expect(getWrapper({ providerProps: { lang }, props: { href: '/page/' } })).toMatchSnapshot()
    })

    test('/enter/ is still prefixed by the language', () => {
      expect(getWrapper({ providerProps: { lang }, props: { href: '/enter/' } })).toMatchSnapshot()
    })

    test('/en is not prefixed by the language', () => {
      expect(getWrapper({ providerProps: { lang }, props: { href: '/en' } })).toMatchSnapshot()
    })

    test('/en/ is not prefixed by the language', () => {
      expect(getWrapper({ providerProps: { lang }, props: { href: '/en/' } })).toMatchSnapshot()
    })

    test('already language prefixed URL\'s are unaffected', () => {
      expect(getWrapper({ providerProps: { lang }, props: { href: '/en/page/' } })).toMatchSnapshot()
    })

    test('absolute URL\'s are unaffected', () => {
      expect(getWrapper({ providerProps: { lang }, props: { href: 'https://site.com/page/' } })).toMatchSnapshot()
    })

    describe('when validation for static URL\'s are in place', () => {
      let isStatic
      beforeEach(() => {
        isStatic = (href) => {
          if (href.match(/\.jpeg$/i)) return true
          return false
        }
      })

      test('static URL\'s are unaffected', () => {
        expect(getWrapper({ providerProps: { lang, isStatic }, props: { href: '/images/myimage.jpeg' } })).toMatchSnapshot()
      })

      test('non-static URL\'s are prefixed with the language', () => {
        expect(getWrapper({ providerProps: { lang, isStatic }, props: { href: '/non-static/page/' } })).toMatchSnapshot()
      })
    })
  })

  describe('when a custom component is used', () => {
    let CustomLink
    beforeEach(() => {
      CustomLink = (props) => {
        const componentProps = { ...props }
        Object.keys(props).forEach(key => {
          if (key.toLowerCase() !== key) {
            componentProps[key.toLowerCase()] = componentProps[key]
            delete componentProps[key]
          }

          componentProps[key.toLowerCase()] = componentProps[key.toLowerCase()].toString()
        })

        return (
          <div {...componentProps} />
        )
      }
    })

    test('it renders correctly', () => {
      expect(getWrapper({ providerProps: { component: CustomLink }, props: { href: '/page/' } })).toMatchSnapshot()
    })
  })

  describe('when the provider is not used', () => {
    test('it renders correctly', () => {
      expect(mount(
        <Link href='/'>
          A link
        </Link>
      )).toMatchSnapshot()
    })
  })
})
