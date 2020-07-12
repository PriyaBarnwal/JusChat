import React from 'react'
import {Segment, Input, Button,Modal,Image, Icon} from 'semantic-ui-react'
import { Picker } from 'emoji-mart'
import "emoji-mart/css/emoji-mart.css"
import '../styles/MessageForm.css'
import ClickOutside from 'react-click-outside'
import mime from 'mime-types'

class MessageForm extends React.Component {
  state = {
    file: '',
    message: '',
    emojiPickerDisplay: false,
    imageEditorDisplay: false,
  }

  handleChange =(event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  uploadMedia=()=> {
    this.props.onSendMessage({file: this.state.file, contentType: mime.lookup(this.state.file.name)})
    this.setState({
      file: '',
      message: '',
      imageEditorDisplay: false
    })
  }

  close =()=> {
    this.setState({imageEditorDisplay: false})
  }

  previewImage=(event) => {
    let file = event.target.files[0]
    if(file) {
      let reader = new FileReader()
      reader.onload=(e)=>{
        if(reader.readyState === 2) {
          this.setState({
            imageEditorDisplay: true,
            imageUrl:reader.result,
            file
          })
        }
      }
      reader.onerror=()=> {
        alert('Error reading the file.. try again')
      }
      reader.readAsDataURL(file)
    }
    
  }

  setEmoji =(emoji) => {
    this.setState({
      message: this.state.message+emoji,
    })
  }

  toggleEmojiPicker = () => {
    this.setState({emojiPickerDisplay: !this.state.emojiPickerDisplay})
  } 

  OntypeCheck =(event) => (event.keyCode===13)? this.submitMessage(): null

  submitMessage=()=> {
    let msg = this.state.message
    if (msg && msg.replace(/\s/g, '').length) {
      this.props.onSendMessage(msg)
      this.setState({
        message: '',
        emojiPickerDisplay: false
      })
    } else {
      alert('Please type a message to send !')
    }
  }

  render() {
    let {message, emojiPickerDisplay, imageEditorDisplay} = this.state
    
    return(
      <div>
        {imageEditorDisplay && 
          <Modal
            className="previewImage"
            dimmer="blurring"
            small
            open={true} 
          >
            <Modal.Content style={{backgroundColor: 'black'}}>
              <Image
                style={{margin: 'auto'}}
                height={300}
                src={this.state.imageUrl}
                alt="attachment"
              />
            </Modal.Content>
            <Modal.Actions style={{backgroundColor: 'black'}}>
              <Button color='red' inverted onClick={this.close}>
                <Icon name='remove' />Cancel
              </Button>
              <Button color='green' inverted onClick={this.uploadMedia}>
                <Icon name='checkmark' />Send
              </Button>
            </Modal.Actions>
          </Modal>
        }
        <Segment raised inverted>
          {emojiPickerDisplay && (
          <ClickOutside onClickOutside={this.toggleEmojiPicker}>
            <Picker
              className="emoji-picker"
              title="Pick your emoji"
              emoji="point_up"
              onSelect={emoji => this.setEmoji(emoji.native)}
            />
          </ClickOutside>
          )}
          <Icon className='message-icon' name="smile outline" onClick={this.toggleEmojiPicker}/>
            <Input
              className="message-input"
              onKeyUp={e=>this.OntypeCheck(e)}
              placeholder="type message" 
              required 
              name="message" 
              value={message} 
              label={<Button type="submit" color="grey" icon={'send'} onClick={this.submitMessage}/>}
              labelPosition="right"
              onChange={this.handleChange}/>
            <input
              style={{display: 'none'}}
              type="file"
              name="file"
              accept=".jpg, .png"
              ref={fileinput=> this.fileinput= fileinput}
              onChange={this.previewImage}
            />
            <Button animated='fade' onClick={()=>this.fileinput.click()}>
              <Button.Content hidden>attach</Button.Content>
              <Button.Content visible>
              <Icon name='attach' />
            </Button.Content>
          </Button>
        </Segment>
      </div>
    )  
  }
}

export default MessageForm