let initialState = {
  user: null,
  loading: true
}

const userReducer = (state = initialState, action)=> {
  switch (action.type) {
    case 'SET_USER':
      return {
        user: action.payload.currentUser,
        loading: false
      }
    case 'CLEAR_USER':
      return {
        ...initialState,
        loading: false
      }
    default:
      return state
  }
}

export default userReducer