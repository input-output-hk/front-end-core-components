# Language

The Language component provides global localization state via React's [context API](https://reactjs.org/docs/context.html). It has support built in for:

* URL based language in the form of `/<lang>/path/to/resource/`
* Multiple languages
* Alternative languages redirecting to a main language e.g. `en-US` -> `en`
* Persisting to local storage
* Accepting languages via `window.navigator.locale` when supported

Each of the above features are optional.

## Dependencies

* react `^16.3`
* prop-types `^15.6.2`

## Usage

*The following examples assume the usage of the Gatsby framework.*

### Provider

In order to maintain an accurate URL state it is recommended to use a library such as `@reach/router` with the `Location` component. Other libraries can be used so long as the values for `location.pathname`, `location.search` and `location.hash` are kept up to date. If the prop `useURL` is false then `location` is not required.

```javascript
import React from 'react'
import { Location } from '@reach/router'
import { navigate } from 'gatsby'
import { Language } from '@input-output-hk/front-end-core-components'

const App = () => (
  <Location>
    {({ location }) => (
      <Language.Provider
        location={{
          // location is optional when the useURL prop is false
          pathname: location.pathname,
          search: location.search,
          hash: location.hash
        }}
        availableLanguages={[
          {
            key: 'en',
            label: 'English US',
            // flag is optional
            flag: '🇺🇸',
            locale: 'en-US'
          },
          {
            key: 'fr',
            label: 'French FR',
            flag: '‎🇫🇷',
            locale: 'fr-FR'
          }
        ]}
        alternativeLanguages={[
          // Alternative languages are optional
          {
            key: 'en-GB',
            languageKey: 'en'
          },
          {
            key: 'fr-CA',
            languageKey: 'fr'
          }
        ]}
        onUpdate={({ lang, prevLang, url, prevURL }) => {
          // Optional callback whenever the language is updated
          // When the component mounts `prevLang` and `prevURL` will be null
          // An alternative to using this prop would be to use the consumer
          // and useEffect(() => { ... }, [ lang ]) where appropriate

          // When useURL is false the `url` and `prevURL` arguments are undefined

          // Examples
          // * track event to analytics
          // * navigate to the new URL
          // * display an on screen confirmation
          if (prevURL && prevURL !== url) navigate(url)
        }}
        persistLang={
          true // defaults to true, whether to persist language to local storage or not
        }
        useNavigator={
          true // defaults to true, whether to attempt to grab language from window.navigator.language or not
        }
        useURL={
          true // defaults to true, whether to use the URL from the given location or not
        }
      >
        <MyComponent />
      </Language.Provider>
    )}
  </Location>
)

```

### Consumer

```javascript
import React from 'react'
import { Language } from '@input-output-hk/front-end-core-components'

const MyComponent = () => (
  <Language.Consumer>
    {({
      lang,
      setLang,
      locale,
      flag,
      label,
      availableLanguages,
      alternativeLanguages
    }) => (
      <div>
        <select value={key} onChange={e => setLang(e.target.value)}>
          {availableLanguages.map(({ key, label, flag, locale }) => (
            <option key={key} value={key}>
              {flag} {label} ({locale})
            </option>
          ))}
        </select>
        <p>Selected language, {flag} {label}</p>
      </div>
    )}
  </Language.Consumer>
)

```
