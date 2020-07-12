import React from 'react'
import {Form, Message, Button} from 'semantic-ui-react'

class NewMessageForm extends React.Component {
  state = {
    email: '',
    msg: '',
    error: ''
  }

  handleChange =(event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  submitMessage=()=> {
    let {msg, email} = this.state
    if (msg && msg.replace(/\s/g, '').length) {
      this.props.onAddFriend(email, msg)
        .then(()=>this.props.onClose())
        .catch((err)=> this.setState({error: err}))
    } else {
      alert('Please type a message to send !')
    }
  }

  render() {
    let {msg, email, error} = this.state
    return (
      <Form error style={{width: 'auto'}}
        onSubmit={this.submitMessage}>
        <Form.Field>
          <input placeholder="Enter your friend's email" value={email} name="email" required onChange={this.handleChange}/>
        </Form.Field>
        <Form.Field>
          <input placeholder='Type your message' value={msg} name="msg" required onChange={this.handleChange}/>
        </Form.Field>
        <Button 
          inverted
          onClick={this.props.onClose}
          color= "red" 
          >
          Cancel
        </Button>
        <Button
          inverted
          type="submit"
          positive
          content='Send'
          color="green"
        />
        {error && 
          (<Message
            error
            content={error}
          />)}
      </Form>
    )
  }
}

export default NewMessageForm