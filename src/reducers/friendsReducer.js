import metaReducer from './metaReducer'
import chatsReducer from './chatsReducer'

/* state structure
  -----------------
  {
    friends: [
      {
        'friend1_email': {
          id:email
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
          id:email
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
      case 'REMOVE_ALL_FRIENDS':
        return initialState
      case 'REMOVE_FRIEND': {
        return {
          ...state,
          [action.payload.email]: {}
        }
      }
      default:
        return state
    }
  }
  
  export default friendsReducer