import { combineReducers } from 'redux'
import userReducer from './userReducer'
import friendsReducer from './friendsReducer'

const rootReducer = combineReducers({user: userReducer, friends: friendsReducer})

export default rootReducer