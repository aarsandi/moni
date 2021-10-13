import { createStore, applyMiddleware, combineReducers } from 'redux';
import dataReducer from './data'

import financeReducer from './finance'
import planReducer from './plan'

import historyLoanReducer from './historyLoan'
import historyActivityDompetReducer from './historyActivityDompet'
import historyActivityDompetCashReducer from './historyActivityDompetCash'
import historyActivityTabunganReducer from './historyActivityTabungan'
import historyPengeluaranReducer from './historyPengeluaran'

import thunk from 'redux-thunk';

const reducer = combineReducers({
    dataReducer: dataReducer,
    financeReducer: financeReducer,
    planReducer: planReducer,
    historyLoanReducer: historyLoanReducer,
    historyActivityDompetReducer: historyActivityDompetReducer,
    historyActivityDompetCashReducer: historyActivityDompetCashReducer,
    historyActivityTabunganReducer: historyActivityTabunganReducer,
    historyPengeluaranReducer: historyPengeluaranReducer
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store;
