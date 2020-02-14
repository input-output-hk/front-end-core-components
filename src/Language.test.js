import React from 'react'
import { Provider, Consumer } from './Language'
import { mount, shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'

const DEFAULT_PROVIDER_PROPS = {
  location: {
    pathname: '/',
    search: '',
    hash: ''
  },
  availableLanguages: [
    {
      key: 'en',
      locale: 'en-US',
      label: 'US English',
      flag: '‎🇺🇸'
    },
    {
      key: 'fr',
      locale: 'fr-FR',
      'label': 'French',
      flag: '‎🇫🇷'
    }
  ],
  children: (<p>Language provider children</p>)
}

function getProviderWrapper ({ props = {}, renderFunction }) {
  return renderFunction(
    <Provider
      location={props.location === null ? undefined : { ...DEFAULT_PROVIDER_PROPS.location, ...(props.location || {}) }}
      availableLanguages={props.availableLanguages || DEFAULT_PROVIDER_PROPS.availableLanguages}
      alternativeLanguages={props.alternativeLanguages}
      onUpdate={props.onUpdate}
      persistLang={props.persistLang}
      useNavigator={props.useNavigator}
      useURL={props.useURL}
    >
      {props.children ? props.children : DEFAULT_PROVIDER_PROPS.children}
    </Provider>
  )
}

describe('Language context', () => {
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

      test('the language is persisted to local storage', () => {
        expect(window.localStorage.setItem).toBeCalledWith('lang', 'en')
      })

      test('onUpdate is called with the correct arguments', () => {
        expect(onUpdate).toBeCalledWith({ lang: 'en', prevLang: null, url: '/en/', prevURL: null })
      })

      describe('when there is a URL path, search and hash', () => {
        beforeEach(() => {
          onUpdate.mockReset()
          provider = getProviderWrapper({
            renderFunction: mount,
            props: {
              onUpdate,
              location: { pathname: '/path/to/resource/', search: '?query=some%20search%20term', hash: '#id' }
            }
          })
        })

        test('onUpdate is called with the correct arguments', () => {
          expect(onUpdate).toBeCalledWith({ lang: 'en', prevLang: null, url: '/en/path/to/resource/?query=some%20search%20term#id', prevURL: null })
        })
      })

      describe('when persistLang is false', () => {
        beforeEach(() => {
          window.localStorage.setItem.mockReset()
          provider = getProviderWrapper({ renderFunction: mount, props: { onUpdate, persistLang: false } })
        })

        test('the language is not persisted to local storage', () => {
          expect(window.localStorage.setItem).not.toBeCalled()
        })
      })

      describe('when useURL is false', () => {
        beforeEach(() => {
          onUpdate.mockReset()
          provider = getProviderWrapper({ renderFunction: mount, props: { onUpdate, useURL: false, location: null } })
        })

        test('onUpdate is called with the correct arguments', () => {
          expect(onUpdate).toBeCalledWith({ lang: 'en', prevLang: null })
        })

        describe('when location is still used', () => {
          beforeEach(() => {
            onUpdate.mockReset()
            provider = getProviderWrapper({ renderFunction: mount, props: { onUpdate, useURL: false, location: { pathname: '/fr/' } } })
          })

          test('onUpdate is called with the correct arguments', () => {
            expect(onUpdate).toBeCalledWith({ lang: 'en', prevLang: null })
          })
        })
      })

      describe('when the language is set in the URL initially', () => {
        beforeEach(() => {
          onUpdate.mockReset()
          provider = getProviderWrapper({
            renderFunction: mount,
            props: {
              onUpdate,
              location: { pathname: '/fr/path/to/resource/' }
            }
          })
        })

        test('onUpdate is called with the correct arguments', () => {
          expect(onUpdate).toBeCalledWith({ lang: 'fr', prevLang: null, url: '/fr/path/to/resource/', prevURL: null })
        })

        describe('when a valid alternative language is used', () => {
          beforeEach(() => {
            onUpdate.mockReset()
            provider = getProviderWrapper({
              renderFunction: mount,
              props: {
                onUpdate,
                alternativeLanguages: [
                  {
                    key: 'fr-CA',
                    languageKey: 'fr'
                  }
                ],
                location: { pathname: '/fr-CA/path/to/resource/' }
              }
            })
          })

          test('onUpdate is called with the correct arguments', () => {
            expect(onUpdate).toBeCalledWith({ lang: 'fr', prevLang: null, url: '/fr/path/to/resource/', prevURL: null })
          })
        })
      })

      describe('when the language is set in local storage initially', () => {
        beforeEach(() => {
          onUpdate.mockReset()
          window.localStorage.getItem.mockImplementation((key) => key === 'lang' ? 'fr' : undefined)
          provider = getProviderWrapper({
            renderFunction: mount,
            props: {
              onUpdate
            }
          })
        })

        afterEach(() => {
          window.localStorage.getItem.mockReset()
        })

        test('onUpdate is called with the correct arguments', () => {
          expect(onUpdate).toBeCalledWith({ lang: 'fr', prevLang: null, url: '/fr/', prevURL: null })
        })

        describe('when the language in local storage is invalid', () => {
          beforeEach(() => {
            onUpdate.mockReset()
            window.localStorage.getItem.mockImplementation((key) => key === 'lang' ? 'de' : undefined)
            provider = getProviderWrapper({
              renderFunction: mount,
              props: {
                onUpdate
              }
            })
          })

          test('onUpdate is called with the correct arguments', () => {
            expect(onUpdate).toBeCalledWith({ lang: 'en', prevLang: null, url: '/en/', prevURL: null })
          })
        })
      })

      describe('when the language is set from the navigator initially', () => {
        beforeEach(() => {
          onUpdate.mockReset()
          window.navigator.language = 'fr-FR'
          provider = getProviderWrapper({
            renderFunction: mount,
            props: {
              onUpdate
            }
          })
        })

        afterEach(() => {
          window.navigator.language = 'de-DE'
        })

        test('onUpdate is called with the correct arguments', () => {
          expect(onUpdate).toBeCalledWith({ lang: 'fr', prevLang: null, url: '/fr/', prevURL: null })
        })

        describe('when useNavigator is false', () => {
          beforeEach(() => {
            onUpdate.mockReset()
            provider = getProviderWrapper({
              renderFunction: mount,
              props: {
                onUpdate,
                useNavigator: false
              }
            })
          })

          test('onUpdate is called with the correct arguments', () => {
            expect(onUpdate).toBeCalledWith({ lang: 'en', prevLang: null, url: '/en/', prevURL: null })
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
              {({ lang, setLang, locale, flag, label, availableLanguages }) => (
                <div
                  id='consumer-value-holder'
                  consumervalue={{
                    lang,
                    setLang,
                    locale,
                    flag,
                    label,
                    availableLanguages
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

    describe('when setLang is called', () => {
      beforeEach(() => {
        act(() => {
          wrapper.find('#consumer-value-holder').prop('consumervalue').setLang('fr')
        })
        wrapper.update()
      })

      test('the new language is persisted to local storage', () => {
        expect(window.localStorage.setItem).toBeCalledWith('lang', 'fr')
      })

      test('the consumer values are correctly updated', () => {
        expect(wrapper.find('#consumer-value-holder').prop('consumervalue')).toMatchSnapshot()
      })

      test('when attempting to set an invalid language', () => {
        expect(() => {
          wrapper.find('#consumer-value-holder').prop('consumervalue').setLang('zh-CN')
        }).toThrow('Invalid language zh-CN')
      })
    })
  })
})
