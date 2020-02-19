import React from 'react'
import Markdown, { Provider } from './Markdown'
import { mount } from 'enzyme'

function getWrapper ({ props = {}, providerProps = {} } = {}) {
  return mount(
    <Provider {...providerProps}>
      <Markdown {...props} />
    </Provider>
  )
}

describe('<Markdown />', () => {
  test('it renders correctly with minimal props', () => {
    expect(getWrapper({ props: { source: '# A title' } })).toMatchSnapshot()
  })

  describe('setting props at a global level', () => {
    test('it renders using the global props', () => {
      expect(getWrapper({
        providerProps: { markdownProps: { source: '# A global title' } } })).toMatchSnapshot()
    })

    describe('overwriting the global props', () => {
      test('it renders with the local props overwriting the global props', () => {
        expect(getWrapper({
          providerProps: { markdownProps: { source: '# A global title' } },
          props: { source: '# A local title' }
        })).toMatchSnapshot()
      })
    })

    describe('setting renderers at a global level', () => {
      let GlobalTitle
      beforeEach(() => {
        GlobalTitle = (props) => (
          <h1 {...props} className='my-global-title' />
        )
      })

      test('it renders with the renderers at a global level', () => {
        expect(getWrapper({
          providerProps: { markdownProps: { renderers: { heading: GlobalTitle } } },
          props: { source: '# A custom title' }
        })).toMatchSnapshot()
      })

      describe('overwriting the global renderers', () => {
        let LocalTitle
        beforeEach(() => {
          LocalTitle = (props) => (
            <h1 {...props} className='my-local-title' />
          )
        })

        test('it renders with the local renderers overwriting the global renderers', () => {
          expect(getWrapper({
            providerProps: { markdownProps: { renderers: { heading: GlobalTitle } } },
            props: { source: '# Another custom title', renderers: { heading: LocalTitle } }
          })).toMatchSnapshot()
        })
      })
    })

    describe('setting parserOptions at a global level', () => {
      let globalParserOptions
      beforeEach(() => {
        globalParserOptions = { pedantic: true }
      })

      test('it renders with the renderers at a global level', () => {
        expect(getWrapper({
          providerProps: { markdownProps: { parserOptions: globalParserOptions } },
          props: { source: 'Some markdown' }
        })).toMatchSnapshot()
      })

      describe('overwriting the global renderers', () => {
        test('it renders with the local renderers overwriting the global renderers', () => {
          expect(getWrapper({
            providerProps: { markdownProps: { parserOptions: globalParserOptions } },
            props: { source: 'Some more markdown', parserOptions: { pedantic: false } }
          })).toMatchSnapshot()
        })
      })
    })
  })

  describe('when no Provider is present', () => {
    test('it still renders the markdown correctly', () => {
      expect(mount(<Markdown source='no global state' />)).toMatchSnapshot()
    })
  })
})
