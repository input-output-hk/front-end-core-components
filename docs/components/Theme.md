# Theme

The Theme component provides global theme configuration state via React's [context API](https://reactjs.org/docs/context.html). It has support built in for:

* Multiple themes
* Persisting to local storage

Each of the above features are optional.

## Dependencies

* react `^16.3`
* prop-types `^15.6.2`

## Usage

### Provider

```javascript
import React from 'react'
import { Theme } from '@input-output-hk/front-end-core-components'

const App = () => (
  <Location>
    {({ location }) => (
      <Theme.Provider
        themes={[
          {
            key: 'iohk-dark',
            config: {
              name: 'Dark',
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
              name: 'Light',
              colors: {
                primary: 'thistle',
                secondary: 'dodgerblue'
              },
              typography: {
                fontFamily: 'Helvetica'
              }
            }
          }
        ]}
        onUpdate={({ theme, prevTheme }) => {
          // Optional callback whenever the theme is updated
          // When the component mounts `prevTheme` will be null
          // An alternative to using this prop would be to use the consumer
          // and useEffect(() => { ... }, [ key ]) where appropriate

          // Examples
          // * track event to analytics
          // * display an on screen confirmation
        }}
        persistTheme={
          true // defaults to true, whether to persist theme to local storage or not
        }
      >
        <MyComponent />
      </Theme.Provider>
    )}
  </Location>
)

```

### Consumer

```javascript
import React from 'react'
import { Theme } from '@input-output-hk/front-end-core-components'

const MyComponent = () => (
  <Theme.Consumer>
    {({
      theme: { key, config },
      setTheme,
      themes
    }) => (
      <div>
        <select value={key} onChange={e => setTheme(e.target.value)}>
          {themes.map(({ key, config }) => (
            <option key={key} value={key}>
              {config.name}
            </option>
          ))}
        </select>
        <p>Selected theme, {config.name}</p>
      </div>
    )}
  </Theme.Consumer>
)

```
