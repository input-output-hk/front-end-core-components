# Image

The Image component is designed to be used with [Uploadcare](https://uploadcare.com/) and will provide responsive and performant images. The responsiveness of images can be controlled via:

* `breakpoints` using the `Provider` component (uses the [React Context API](https://reactjs.org/docs/context.html))
* the `sizeFactor` prop which defaults to a value of 1, providing a 1:1 scale with breakpoints. Providing a lower value will reduce the size of the images and vice versa on increasing the size.

The component can be used for images not hosted with [Uploadcare](https://uploadcare.com/) and will simply act as a regular `img` tag unless a custom component is provided on the `Component` prop.

## Dependencies

* react `^16.3`
* prop-types `^15.6.2`

## Reference

### Provider

| prop name | description | type | required? | default value |
| --------- | ----------- | ---- | --------- | ------------- |
| uploadcareDomains | List of custom Uploadcare domains | `Array<String>` | ✗ | [ ] |
| breakpoints | List of breakpoints used for responsive images | `Array<Integer>` | ✗ | [ 3000, 2000, 1500, 1000, 800, 600, 400 ] |
| children | Child nodes | `Node` | ✓ | - |


### Image

| prop name | description | type | required? | default value |
| --------- | ----------- | ---- | --------- | ------------- |
| src | Image src | `String` | ✓ | - |
| alt | Image alt | `String` | ✓ | - |
| component | Component to use for rendering image instead of `<img />` | `Function\|String` | ✗ | img |
| componentProps | Props to pass to component used as `<img />` | `Object` | ✗ | {} |
| maintainTransparency | Whether to retain transparency in Uploadcare images or not | `Boolean` | ✗ | false |
| sizeFactor | Used to scale the image responsively in relation to the breakpoints. Smaller numbers == smaller image size and vice versa | `Number` | ✗ | 1 |

## Usage

### Provider (optional)

Put the provider high up in your application component tree, usually within `App.js` or the main entry point to your application/website.

```javascript
import React from 'react'
import { Provider } from '@input-output-hk/front-end-core-components/components/Image'

export default () => (
  // The breakpoints prop provides a list of responsive breakpoints for Uploadcare images
  // there is a sensible default value for this, but can be overwritten. The order of the
  // breakpoints is irrelevant.
  //
  // If hosting Uploadcare images on a custom domain then the uploadcareDomains array can
  // be populated with a list of domains optionally.
  //
  // All provider props are optional
  <Provider breakpoints={[ 500, 800, 2000 ]} uploadcareDomains={[ 'mysite.com' ]}>
    ...
    <p>The rest of your app</p>
    ...
  </Provider>
)

```

### Image

#### Examples uploadcare images

Basic example with a non-transparent image.

```javascript
import React from 'react'
import Image from '@input-output-hk/front-end-core-components/components/Image'

export default () => (
  <Image src='https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/' alt='Shelley' />
)

```

**Output**

```html
<picture>
  <source
    sizes="(max-width: 3000px) 3000px, (max-width: 2000px) 2000px, (max-width: 1500px) 1500px, (max-width: 1000px) 1000px, (max-width: 800px) 800px, (max-width: 600px) 600px, (max-width: 400px) 400px, 100vw"
    srcSet="http://uploadcare.example.org/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/jpeg/-/resize/3000/ 3000w, http://uploadcare.example.org/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/jpeg/-/resize/2000/ 2000w, http://uploadcare.example.org/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/jpeg/-/resize/1500/ 1500w, http://uploadcare.example.org/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/jpeg/-/resize/1000/ 1000w, http://uploadcare.example.org/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/jpeg/-/resize/800/ 800w, http://uploadcare.example.org/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/jpeg/-/resize/600/ 600w, http://uploadcare.example.org/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/jpeg/-/resize/400/ 400w"
  />
  <img src="https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/jpeg/" alt="Shelley" />
</picture>
```

---

To maintain transparency in images use the `maintainTransparency` prop and set it to `true`

```javascript
import React from 'react'
import Image from '@input-output-hk/front-end-core-components/components/Image'

export default () => (
  <Image src='https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/' alt='Shelley' maintainTransparency={true} />
)

```

**Output**

```html
<picture>
  <source
    sizes="(max-width: 3000px) 3000px, (max-width: 2000px) 2000px, (max-width: 1500px) 1500px, (max-width: 1000px) 1000px, (max-width: 800px) 800px, (max-width: 600px) 600px, (max-width: 400px) 400px, 100vw"
    srcSet="https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/webp/-/resize/3000/ 3000w, https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/webp/-/resize/2000/ 2000w, https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/webp/-/resize/1500/ 1500w, https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/webp/-/resize/1000/ 1000w, https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/webp/-/resize/800/ 800w, https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/webp/-/resize/600/ 600w, https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/webp/-/resize/400/ 400w"
  />
  <source
    sizes="(max-width: 3000px) 3000px, (max-width: 2000px) 2000px, (max-width: 1500px) 1500px, (max-width: 1000px) 1000px, (max-width: 800px) 800px, (max-width: 600px) 600px, (max-width: 400px) 400px, 100vw"
    srcSet="https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/png/-/resize/3000/ 3000w, https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/png/-/resize/2000/ 2000w, https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/png/-/resize/1500/ 1500w, https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/png/-/resize/1000/ 1000w, https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/png/-/resize/800/ 800w, https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/png/-/resize/600/ 600w, https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/png/-/resize/400/ 400w"
  />
  <img src="https://ucarecdn.com/c19187bc-6028-45fa-bf23-18dd31cd7636/-/format/png/" alt="Shelley" />
</picture>
```
