import React from 'react'
import {Modal, Form, Button, Icon, Image} from 'semantic-ui-react'
import AvatarEditor from 'react-avatar-editor'
import '../styles/profile.css'
import firebase from '../firebase'
import mime from 'mime-types'
import {ImageLoader} from './Loader'
import defaultPic from '../assets/blank-profile-pic.png'

class Profile extends React.Component {
  state = {
    scale: 1,
    uploading: false,
    file: '',
    profileImg: this.props.dp,
    newImageChosen: false,
    error: '',
    editImage: false
  }

  changeDp= (event) => {
    const reader =  new FileReader()
    let file = event.target.files[0]
    if(file){
    reader.onload=()=>{
      if(reader.readyState === 2) {
        this.setState({
          file: file,
          profileImg: reader.result,
          newImageChosen: true,
          editImage: true
        })
      }
    }

    reader.onerror=(err)=> {
      this.setState({
        error: 'Image could not be read! Try again!'
      })
      alert(err)
    }

    reader.readAsDataURL(event.target.files[0])
    }
  }

  upload=()=> {
    let email = this.props.user.email,
      {file} = this.state

    if (this.avatarRef) {
      this.setState({
        uploading: true
      })
      this.avatarRef.getImageScaledToCanvas().toBlob(blob=>{
        let userRef = firebase.auth().currentUser

        firebase.storage().ref()
          .child(`avatars/${userRef.uid}`)
          .put(blob, {
            contentType: mime.lookup(file.name)
          })
          .then((snap)=> {
            snap.ref
            .getDownloadURL()
              .then((downloadURL)=>{
                userRef
                .updateProfile({
                  photoURL: downloadURL
                })
                .then(()=>{
                  firebase.firestore()
                  .collection('users')
                    .doc(email)
                    .update({
                      profilePhoto: downloadURL
                    })
                    .then(()=> {
                      this.setState({
                        profileImg: downloadURL,
                        uploading: false,
                        editImage: false,
                        newImageChosen: false,
                        file: ''
                      })
                    })
                })
              })
          })
          .catch(err => {
            this.setState({
              uploading: false
            })
            alert('error uploading image.. Please try again!')
          })
      })
    }
  }

  removeDp=()=> {
    let email = this.props.user.email

    this.setState({
      uploading: true
    })

    let userRef = firebase.auth().currentUser

    firebase.storage().ref()
      .child(`avatars/${userRef.uid}`)
      .delete()
      .then(()=> {
        userRef
          .updateProfile({
            photoURL: null
          })
          .then(() => {
            firebase.firestore()
              .collection('users')
              .doc(email)
              .update({
                profilePhoto: null
              })
              .then(()=> {
                this.setState({
                  profileImg: defaultPic,
                  uploading: false
                })
              })
          })    
      })
      .catch(err => {
        this.setState({
          uploading: false
        })
        alert('error removing profile pic.. Please try again!')
      })
  }

  IncreaseScale = () => {
    this.setState({
      scale: this.state.scale+0.1
    })
  }

  DecreaseScale = () => {
    if(this.state.scale>1) {
      this.setState({
        scale: this.state.scale-0.1
      })
    }
  }

  render() {
    return (
      <Modal
        open={true}
        onClose={this.props.onClose} closeIcon>
        <Modal.Header style={{position: 'relative', backgroundColor: "#009999"}}>
          Profile
        </Modal.Header>
        <Modal.Content image className='bg-profile'>
          {this.state.editImage && 
          (<div><AvatarEditor
            image={this.state.profileImg}
            ref={ref=>this.avatarRef = ref}
            width={250}
            height={250}
            scale={this.state.scale}
            borderRadius={500}
            rotate={0}
            style={{marginRight: '20px'}}
          />
          Zoom:  
          <Icon name="zoom-in" onClick={this.IncreaseScale}/>
          <Icon name="zoom-out" onClick={this.DecreaseScale}/>
            </div>
          )}
          {!this.state.editImage && <Image className="image-holder" circular wrapped size='medium' alt="profile image" src={this.state.profileImg} />}
          <Modal.Description>
          <Form>
            <Form.Input fluid label='User Name' value={this.props.user.displayName} readOnly />
            <Form.Input fluid label='Email' value={this.props.user.email} readOnly />
            <input
              style={{display: 'none'}}
              type="file"
              name="file"
              accept="image/*"
              ref={dpInput=> this.dpInput = dpInput}
              onChange={this.changeDp}
            />
            <Button onClick={()=>this.dpInput.click()}>Update Profile Picture</Button>
            {!this.state.newImageChosen && <Button onClick={this.removeDp}>Remove Profile Picture</Button>}
            {this.state.newImageChosen && <Button onClick={this.upload}>Confirm change</Button>}
            {this.state.uploading && <div className="loader"><ImageLoader /></div>}
          </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}

export default Profile