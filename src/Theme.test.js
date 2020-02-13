import React from 'react'
import { Provider, Consumer } from './Theme'
import { mount, shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'

const DEFAULT_PROVIDER_PROPS = {
  themes: [
    {
      key: 'iohk-dark',
      config: {
        colors: {
          primary: 'tomato',
          secondary: 'papayawhip'
        },
        typography: {
          fontFamily: 'Arial'
        }
      }
    },
    {
      key: 'iohk-light',
      config: {
        colors: {
          primary: 'thistle',
          secondary: 'dodgerblue'
        },
        typography: {
          fontFamily: 'Helvetica'
        }
      }
    }
  ],
  children: (<p>Theme provider children</p>)
}

function getProviderWrapper ({ props = {}, renderFunction }) {
  return renderFunction(
    <Provider
      themes={props.themes || DEFAULT_PROVIDER_PROPS.themes}
      onUpdate={props.onUpdate}
      persistTheme={props.persistTheme}
    >
      {props.children ? props.children : DEFAULT_PROVIDER_PROPS.children}
    </Provider>
  )
}

describe('Theme context', () => {
  describe('<Provider />', () => {
    let provider
    beforeEach(() => {
      provider = getProviderWrapper({ renderFunction: shallow })
    })

    test('it renders the provider component correctly', () => {
      expect(provider).toMatchSnapshot()
    })

    describe('when the provider is mounted', () => {
      let onUpdate
      beforeEach(() => {
        onUpdate = jest.fn()
        provider = getProviderWrapper({ renderFunction: mount, props: { onUpdate } })
      })

      test('the theme is persisted to local storage', () => {
        expect(window.localStorage.setItem).toBeCalledWith('theme', 'iohk-dark')
      })

      test('onUpdate is called with the first theme in the themes list', () => {
        expect(onUpdate).toBeCalledWith({ theme: 'iohk-dark', prevTheme: null })
      })

      describe('when a theme pre-exists in local storage', () => {
        beforeEach(() => {
          onUpdate.mockReset()
          window.localStorage.getItem.mockImplementation((key) => key === 'theme' ? 'iohk-light' : undefined)
          provider = getProviderWrapper({ renderFunction: mount, props: { onUpdate } })
        })

        test('onUpdate is called with the theme from local storage', () => {
          expect(onUpdate).toBeCalledWith({ theme: 'iohk-light', prevTheme: null })
        })

        describe('when the theme in local storage is invalid', () => {
          beforeEach(() => {
            onUpdate.mockReset()
            window.localStorage.getItem.mockImplementation((key) => key === 'theme' ? 'iohk-orange' : undefined)
            provider = getProviderWrapper({ renderFunction: mount, props: { onUpdate } })
          })

          test('onUpdate is called with the first theme in the themes list', () => {
            expect(onUpdate).toBeCalledWith({ theme: 'iohk-dark', prevTheme: null })
          })
        })

        describe('when persistTheme is false', () => {
          beforeEach(() => {
            onUpdate.mockReset()
            window.localStorage.setItem.mockReset()
            window.localStorage.getItem.mockImplementation((key) => key === 'theme' ? 'iohk-light' : undefined)
            provider = getProviderWrapper({ renderFunction: mount, props: { onUpdate, persistTheme: false } })
          })

          test('onUpdate is called with the first theme in the themes list', () => {
            expect(onUpdate).toBeCalledWith({ theme: 'iohk-dark', prevTheme: null })
          })

          test('the theme is not persisted to local storage', () => {
            expect(window.localStorage.setItem).not.toBeCalled()
          })
        })
      })
    })
  })

  describe('<Consumer />', () => {
    let onUpdate, wrapper
    beforeEach(() => {
      onUpdate = jest.fn()
      wrapper = getProviderWrapper({
        renderFunction: mount,
        props: {
          onUpdate,
          children: (
            <Consumer>
              {({ key, theme, setTheme, themes }) => (
                <div
                  id='consumer-value-holder'
                  consumervalue={{
                    key,
                    theme,
                    setTheme,
                    themes
                  }}
                />
              )}
            </Consumer>
          )
        }
      })
    })

    afterEach(() => {
      onUpdate.mockReset()
    })

    test('the consumer values are correct', () => {
      expect(wrapper.find('#consumer-value-holder').prop('consumervalue')).toMatchSnapshot()
    })

    describe('when setTheme is called', () => {
      beforeEach(() => {
        act(() => {
          wrapper.find('#consumer-value-holder').prop('consumervalue').setTheme('iohk-light')
        })
        wrapper.update()
      })

      test('the new theme is persisted to local storage', () => {
        expect(window.localStorage.setItem).toBeCalledWith('theme', 'iohk-light')
      })

      test('the consumer values are correctly updated', () => {
        expect(wrapper.find('#consumer-value-holder').prop('consumervalue')).toMatchSnapshot()
      })

      test('when attempting to set an invalid theme', () => {
        expect(() => {
          wrapper.find('#consumer-value-holder').prop('consumervalue').setTheme('cardano')
        }).toThrow('Theme cardano does not exist')
      })
    })
  })
})
