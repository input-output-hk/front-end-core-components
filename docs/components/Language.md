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

## Reference

| prop name | description | type | required? | default value |
| --------- | ----------- | ---- | --------- | ------------- |
| location | URL mirroring `window.location`, only pathname, search and hash are required. Prop is required when `useURL` is true. When `useURL` is false, location is not required | `Object` | ✗/✓ | {} |
| location.pathname | URL path | `String` | ✓ | - |
| location.search | URL query | `String` | ✓ | - |
| location.hash | URL hash | `String` | ✓ | - |
| availableLanguages | List of available languages | `Array<Object>` | ✓ | - |
| availableLanguages.key | Key of the available language e.g. `en`, `fr` etc., corresponds to URL and local storage values | `String` | ✓ | - |
| availableLanguages.label | Label for the available language e.g. `English`, `French` etc. | `String` | ✓ | - |
| availableLanguages.flag | Unicode flag for the available language e.g.  🇺🇸, 🇫🇷 etc. | `String` | ✗ | - |
| availableLanguages.locale | Locale of the available language e.g. `en-US`, `fr-FR` etc. | `String` | ✓ | - |
| alternativeLanguages | List of alternative languages which correspond to a language key within `availableLanguages` | `Array<Object>` | ✗ | - |
| alternativeLanguages.key | Key for the alternative language e.g. `en-GB`, corresponds to URL and local storage values | `String` | ✓ | - |
| alternativeLanguages.languageKey | Joining key for the alternative language to an available language e.g. `en`, would join on available language `en` | `String` | ✓ | - |
| onUpdate | Called whenever the language is updated with the following arguments - lang, prevLang, url, prevURL. url and prevURL will be null when `useURL` is false. prevLang and prevURL will be null when the component first mounts. | `Function` | ✗ | - |
| persistLang | Whether to persist the selected language to local storage or not and also retrieve values from local storage | `Boolean` | ✗ | true |
| useNavigator | Whether to attempt to read the users locale from `window.navigator.locale` to set a default language (SSR safe) | `Boolean` | ✗ | true |
| useURL | Whether to utilise the URL to read language state. Will also dictate if updated URL's are passed via `onUpdate`. | `Boolean` | ✗ | true |
| children | Child nodes | `Node` | ✓ | - |

## Usage

*The following examples assume the usage of the Gatsby framework.*

### Provider

In order to maintain an accurate URL state it is recommended to use a library such as `@reach/router` with the `Location` component. Other libraries can be used so long as the values for `location.pathname`, `location.search` and `location.hash` are kept up to date. If the prop `useURL` is false then `location` is not required.

```javascript
import React from 'react'
import { Location } from '@reach/router'
import { navigate } from 'gatsby'
import Language from '@input-output-hk/front-end-core-components/components/Language'

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
import Language from '@input-output-hk/front-end-core-components/components/Language'

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
