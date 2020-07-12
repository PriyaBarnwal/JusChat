import React, { Component } from 'react'
import {Grid, Modal} from 'semantic-ui-react'
import firebase from '../firebase'
import {v4 as uuidv4} from 'uuid'
import {connect} from 'react-redux'
import SidePanel from './SidePanel'
import NewMessageForm from './NewMessageForm'
import MessagesPanel from './MessagesPanel'
import {setFriend, removeFriend} from '../actions/friendsAction'

class App extends Component {
  state = {
    selectedChat : null,
    addNewFriend : false,
    currentUser: this.props.user.user,
    listeners: []
  }

  updateRead=(friendEmail)=> {
    let {currentUser} = this.state,
      {friends} = this.props,
      sender = friends[friendEmail].chats.messages.slice(-1)[0].sender
      
    if (sender !== currentUser.email) {
      let key = this.buildUniqueKeyToChat(currentUser.email, friendEmail )

      firebase
        .firestore()
        .collection('chats')
        .doc(key)
        .update({
          receiverHasRead: true
        })
    }
  }

  onSelectChat =(friendEmail)=>{
    this.setState({
      selectedChat: friendEmail
    })
  }

  onNewChat=()=> {
    this.setState({
      addNewFriend: true
    })
  }

  onClose = () => {
    this.setState({
      addNewFriend: false
    })
  }

  onAddFriend = async(email, msg) => {
    let promise = new Promise((resolve, reject)=> {
      let usersRef = firebase.firestore().collection('users')
      let userUnsubscribe =
        usersRef
        .where('email', '==', email)
        .onSnapshot(res=> {
          if(res.docs[0]) {
            this.onSendMessage(msg, email)
              .then(()=>resolve())
              .catch((err)=> reject(err))
          } else {
            reject('Your friend has not registered with us yet!! ')
          }
        })
        this.setState({
          listeners: this.state.listeners.concat(userUnsubscribe)
        })
    })
    return promise
  }

  UpdateFriends =(chats) => {
    let {setFriend} = this.props,
      {currentUser} = this.state

    let friends = chats.map(chat=> {
      return {
        email: chat.users.filter(user=> user!==currentUser.email)[0],
        messages: chat.messages,
        lastMessageAt: chat.lastMessageAt,
        receiverHasRead: chat.receiverHasRead
      }
    })

    friends.map(friend => {
      let friendUnsubscribe =
        firebase.firestore().collection('users').where('email', '==', friend.email)
        .onSnapshot(res => {
          if(res.docs[0])
          friend['meta'] = {
            email: friend.email,
            profilePhoto: res.docs[0].data().profilePhoto,
            displayName: res.docs[0].data().displayName
          }
          
          setFriend(friend)
          this.setState({
            listeners: this.state.listeners.concat(friendUnsubscribe)
          })
        })
    })
  }

  componentWillUnmount() {
    this.state.listeners.map(listener=> listener())
    this.setState({
      selectedChat : null,
      addNewFriend : false,
      listeners: []
    })
    this.props.removeFriend()
  }

  componentDidMount() {
    if (this.props.user.user) {
      let chatUnsubscribe = firebase
        .firestore()
        .collection('chats')
        .where('users', 'array-contains', this.state.currentUser.email)
        .onSnapshot(res => {
          let chats = res.docs.map(doc => doc.data())
          this.UpdateFriends(chats)
        })

        this.setState({
          listeners: this.state.listeners.concat(chatUnsubscribe)
        })
    }
  }

  buildUniqueKeyToChat = (sender,receiver) => [sender, receiver].sort().join(':')

  onSendMessage = async(msg, receiver)=> {
    let sender = this.state.currentUser.email,
      msgObj = {
        message: msg,
        type: 'text',
        sender,
        timeStamp: Date.now()
      }
    receiver = receiver ? receiver : this.state.selectedChat
    let key = this.buildUniqueKeyToChat(sender, receiver)

    if (msg.file) {
      let uploadTask = 
        firebase.storage().ref().child(`chats/public/${key}/${uuidv4()}`).put(msg.file, {
          contentType: msg.contentType
        })
        uploadTask.on('state_changed', 
          snap => {
            let percentUpload = Math.round((snap.bytesTransferred/snap.totalBytes)*100)
            console.log(percentUpload)
          },
          err=> {
            alert('Either the extension is not supported or the size is too large!! please make sure your file is less than 1 MB')
          },
          ()=> {
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadURL => {
                msgObj['message'] = downloadURL
                msgObj['type']= 'file'
                this.sendFinalMessage(msgObj, sender, receiver, key)
              })
          }
        )
    } else {
      this.sendFinalMessage(msgObj, sender, receiver, key)
    }
  }

  sendFinalMessage = (msgObj, sender, receiver, key) => {
    let chatsRefDoc =firebase.firestore().collection('chats').doc(key)
      chatsRefDoc.get()
        .then((snapshot)=> {
          if(snapshot.exists) 
            chatsRefDoc.update({
            receiverHasRead: false,
            lastMessageAt: msgObj.timeStamp,
            messages: firebase.firestore.FieldValue.arrayUnion(msgObj)
            })
          else
            chatsRefDoc.set({
              receiverHasRead: false,
              messages: [msgObj],
              lastMessageAt: msgObj.timeStamp,
              users: [sender, receiver]
            })
            return
        })
  }

  render() {
    return (
      <div style={{backgroundColor: '#202020'}}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              <SidePanel 
                user={this.state.currentUser} 
                friends={this.props.friends}
                selectedChat={this.state.selectedChat}
                onSelectChat={this.onSelectChat}
                onNewChat={this.onNewChat}
              />
            </Grid.Column>
            <Grid.Column width={12}>
              <MessagesPanel 
                user={this.state.currentUser}
                friend={this.props.friends? this.props.friends[this.state.selectedChat]: undefined}
                onSendMessage={this.onSendMessage}
                updateRead={this.updateRead}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {this.state.addNewFriend && (
          <Modal
            basic
            open={true}
            closeOnEscape={true}
            closeOnDimmerClick={true}
            onClose={this.close}
          >
            <Modal.Header>Add New Friend to chat..</Modal.Header>
            <Modal.Content>
              <NewMessageForm onAddFriend={this.onAddFriend} onClose={this.onClose}/>
            </Modal.Content>
          </Modal>
        )}
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return state
}
export default connect(mapStateToProps, {setFriend, removeFriend})(App);
