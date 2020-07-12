//stores chats for each friend
let initialState = {
    receiverHasRead: '',
    messages: [],
    lastMessageAt: 0
  }
  
  const chatsReducer = (state = initialState, action)=> {
    switch (action.type) {
      case 'SET_FRIEND':
        return {
          receiverHasRead: action.payload.receiverHasRead,
          messages: action.payload.messages,
          lastMessageAt: action.payload.lastMessageAt
        }
      case 'REMOVE_FRIEND':
        return {
          ...initialState,
        }
      default:
        return state
    }
  }
  
  export default chatsReducer