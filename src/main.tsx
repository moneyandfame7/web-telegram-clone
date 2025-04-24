import {createRoot} from 'react-dom/client'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'

import {persistor, store} from './app/store'

import App from './app/App'

import {DEBUG} from './app/environment'

import './shared/styles/index.scss'
import {BrowserRouter} from 'react-router-dom'

if (DEBUG) {
  window.addEventListener('dblclick', () => {
    // eslint-disable-next-line no-console
    console.log(store.getState())
  })
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {(bootstrapped) => <App bootstrapped={bootstrapped} />}
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
