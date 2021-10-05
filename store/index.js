import { createStore, applyMiddleware, combineReducers } from 'redux';
import dataReducer from './data'
import profileReducer from './profile'
import thunk from 'redux-thunk';

const reducer = combineReducers({
    profileReducer: profileReducer,
    dataReducer: dataReducer
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store;
