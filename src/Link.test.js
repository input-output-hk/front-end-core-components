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
        {({ href, isStatic, isRelative }) => (
          <a data={{ isStatic, isRelative }} href={href}>
            A link
          </a>
        )}
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

  describe('when the provider is not used', () => {
    test('it renders correctly', () => {
      expect(mount(
        <Link href='/'>
          {({ href, isStatic, isRelative }) => (
            <a data={{ isStatic, isRelative }} href={href}>
              A link
            </a>
          )}
        </Link>
      )).toMatchSnapshot()
    })
  })
})
