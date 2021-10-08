import React from 'react'
import { Provider } from 'react-redux'
import LandingScreenNavigator from './screens/navigator/LandingScreenNavigator';
import store from './store/index'

const App = () => {
  return (
    <Provider store={store}>
      <LandingScreenNavigator/>
    </Provider>
  )
}

export default App
