import React from 'react'
import { Provider } from 'react-redux'
import LandingPageNavigator from './screens/navigator/LandingPageNavigator';
import store from './store/index'

const App = () => {
  return (
    <Provider store={store}>
      <LandingPageNavigator/>
    </Provider>
  )
}

export default App
