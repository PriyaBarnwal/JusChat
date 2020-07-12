import metaReducer from './metaReducer'
import chatsReducer from './chatsReducer'

/* state structure
  -----------------
  {
    friends: [
      {
        'friend1_email': {
          meta:{
            email,
            profilePic,
            displayName
          },
          chats:{}
        }
      },
      {
        'friend2_email': {
          meta:{},
          chats:{}
        }
      }
    ]
  }
*/
let initialState = {}
  
const friendsReducer = (state = initialState, action)=> {
    switch (action.type) {
      case 'SET_FRIEND':
        return  {
            ...state,
            [action.payload.email]:{
              id: action.payload.email,
              meta: metaReducer(state[action.payload.email]? state[action.payload.email].meta: {}, action),
              chats: chatsReducer(state[action.payload.email]? state[action.payload.email].chats: {}, action)
            }
        }
      case 'REMOVE_FRIEND':
        return initialState
      default:
        return state
    }
  }
  
  export default friendsReducer