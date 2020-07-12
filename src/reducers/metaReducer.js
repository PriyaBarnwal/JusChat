/* meta info of each friend*/
let initialState = {
    email: '',
    profilepic: '',
    userName: ''
  }
  
  const metaReducer = (state = initialState, action)=> {
    switch (action.type) {
      case 'SET_FRIEND':
        return {
          email: action.payload.meta.email,
          profilepic: action.payload.meta.profilePhoto,
          displayName: action.payload.meta.displayName
        }
      case 'REMOVE_FRIEND':
        return {
          ...initialState
        }
      default:
        return state
    }
  }
  
  export default metaReducer