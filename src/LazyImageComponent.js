import React, { Fragment, Suspense } from 'react'
import PropTypes from 'prop-types'
import Image from './Image'

const LazyImage = React.lazy(() => import('./Image'))

const LazyImageComponent = (props, { lazyLoad }) => {
  return (
    <Fragment>
      {lazyLoad
        ?
        <Suspense fallback={<h2>Loading...</h2>}>
          <LazyImage {...props} />
        </Suspense>
        :
        <Image {...props} />
      }
    </Fragment>
  )
}

LazyImageComponent.propTypes = {
  props: PropTypes.object,
  lazyLoad: PropTypes.bool
}

export default LazyImageComponent