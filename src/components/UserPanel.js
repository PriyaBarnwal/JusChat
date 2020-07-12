import React from 'react'
import firebase from '../firebase'
import '../styles/SidePanel.css'
import Profile from './Profile'
import ReAuthModal from './ReAuthModal'
import { Image, Dropdown, Button, Dimmer, Header } from 'semantic-ui-react'
import FadeLoader from "react-spinners/FadeLoader"
import defaultPic from '../assets/blank-profile-pic.png'

class UserPanel extends React.Component {
  state = {
    openModal: false,
    confirmDeleteOpen: false,
    isloading: false,
    error: ''
  }

  handleSignout = () => {
    firebase.auth().signOut()
      .then(()=> {
      })
      .catch((err) => alert(err.message))
  }

  openProfileModal =()=> {
    this.setState({
      openModal: true
    })
  }

  onClose = () => {
    this.setState({
      openModal: false
    })
  }

  toggleConfirmDelete = () => {
    this.setState({
      confirmDeleteOpen: !this.state.confirmDeleteOpen
    })
  }

  removeAccnt = () => {
    this.setState({
      isloading: true
    })

    let {friends, user} = this.props
    
    Object.keys(friends).map(friend=> {
      let key = [friend, user.email].sort().join(':')

      firebase.firestore()
        .collection('chats')
        .doc(key)
        .delete()
      })
    
    let userRef = firebase.auth().currentUser
    firebase.firestore()
      .collection('users')
      .doc(userRef.email)
      .delete()
      .then(()=>{
        if(userRef.photoURL) {
          firebase.storage().ref()
          .child(`avatars/${userRef.uid}`)
          .delete()
        }
        userRef.delete()
          .then(()=>{
            this.setState({
              isLoading: false
            })
          })
          .catch((err)=>{
            this.setState({
              isLoading: false
            })
            alert(err)
          })
      })
      .catch((err)=>{
        this.setState({
          isLoading: false
        })
        alert(err)
      })
  }

  reAuthenticate= async({email, password}) => {
    let userRef = firebase.auth().currentUser,
      credential = firebase.auth.EmailAuthProvider.credential(email, password);

    userRef.reauthenticateWithCredential(credential)
      .then(()=> {
        this.removeAccnt()
        this.setState({
          confirmDeleteOpen: false,
          error: ''
        })
      })
      .catch((err)=> {
        this.setState({
          error: err.message
        })
      })
  }

  render() {
    let options = [
      {
        key: 'user',
        text: (
          <span>
            Signed in as <strong>{this.props.user.displayName}</strong>
          </span>
        ),
        disabled: true,
      },
      { key: 'profile', text: <span onClick={this.openProfileModal}>Your Profile</span> },
      { key: 'remove-accnt', text: <span onClick={this.toggleConfirmDelete}>Remove Account</span> },
      { key: 'sign-out', text: <span onClick={this.handleSignout}>Sign Out</span> },
    ]
    
    return (
      <div>
        <div className="user-panel-header">
          <div>
            <Image className="user-panel-avatar" circular src={this.props.user.photoURL || defaultPic} />
          </div>
          <Dropdown className="dropdown-trigger" trigger={<span > Hello, {this.props.user.displayName||'New user'} </span>} options={options} />
        </div>
        <Button className="add-new-btn" fluid onClick={this.props.onNewChat}>
          Click here to start a new chat
        </Button>
        {this.state.openModal && 
          <Profile 
            onClose={this.onClose}
            dp={this.props.user.photoURL|| defaultPic}
            {...this.props}
          />
        }
        {this.state.confirmDeleteOpen &&
          <ReAuthModal label="delete account" error={this.state.error} onClose={this.toggleConfirmDelete} confirm={this.reAuthenticate}/>
        }
        {this.state.isloading && 
          <Dimmer active={true} page>
            <Header as='h2' icon inverted>
              <FadeLoader color="white" loading="true"/>
            </Header>
          </Dimmer>
        }
      </div>
    )
  }
}




export default UserPanel
  

