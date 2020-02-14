import React from 'react'
import Head from './Head'
import { shallow } from 'enzyme'

const DEFAULT_PROPS = {
  url: 'https://example.iohk.io'
}

function getWrapper (props = {}) {
  return shallow(
    <Head
      {...DEFAULT_PROPS}
      {...props}
    />
  )
}

describe('<Head />', () => {
  test('it renders correctly with minimal props', () => {
    expect(getWrapper()).toMatchSnapshot()
  })

  test('it renders lang correctly', () => {
    expect(getWrapper({ lang: 'en' })).toMatchSnapshot()
  })

  test('it renders locales correctly', () => {
    expect(getWrapper({ locale: 'en-US', availableLocales: [ 'en-GB', 'en-US', 'fr-FR' ] })).toMatchSnapshot()
  })

  test('it renders children components correctly', () => {
    expect(getWrapper({ children: (
      <html lang='en' />
    ) })).toMatchSnapshot()
  })

  test('it renders tags based on levels correctly', () => {
    const props = {
      site: {
        title: 'The website title',
        meta: [
          { name: 'description', content: 'My website description' },
          { name: 'twitter:title', content: 'Share on Twitter!' },
          { name: 'twitter:image', file: '/relative/image.jpeg' },
          { name: 'twitter:image:alt', content: 'My image' },
          { name: 'og:title', content: 'OG' },
          { name: 'og:image', file: 'https://www.images.com/image.jpeg' }
        ]
      },
      page: {
        title: 'Page title',
        meta: [
          { name: 'description', content: 'Page description' },
          { name: 'keywords', content: 'website,site' }
        ]
      },
      component: {
        meta: [
          { name: 'og:title', content: 'Component OG title' },
          { name: 'keywords', content: 'my,website,site' }
        ]
      },
      url: 'https://www.images.com'
    }

    expect(getWrapper(props)).toMatchSnapshot()
  })
})
