export const setFriend = friend => {
    return {
      type: 'SET_FRIEND',
      payload: friend   
    }
  }
  export const removeFriend = email => {
    return {
      type: 'REMOVE_FRIEND'
    }
  }