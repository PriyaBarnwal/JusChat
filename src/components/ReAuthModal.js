import React from 'react'
import {Modal, Form, Button, Message} from 'semantic-ui-react'
import '../styles/ReAuthModal.css'

class ReAuthModal extends React.Component {
  state={
    password: "",
    email: "",
    error: this.props.error
  }

  handleChange =(event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  onSubmit =()=> {
    this.props.confirm(this.state)
  }

  render() {
    return (
      <Modal
        className="tiny-modal"
        open={true}
        onClose={this.props.onClose} closeIcon>
        <Modal.Content>
          <Form onSubmit={this.onSubmit}>
            <Form.Input 
              fluid 
              label={'Confirm email to '+this.props.label} 
              value={this.state.email} 
              onChange={this.handleChange}
              name="email"
            />
            <Form.Input 
              fluid 
              label={'Confirm Password to '+this.props.label} 
              value={this.state.password} 
              onChange={this.handleChange}
              type="password"
              name="password"
            />
            <Button type="submit">Confirm Account Removal</Button>
          </Form>
          {this.props.error && 
            (<Message error>
              <h3>Errors:</h3>
              <p>{this.props.error}</p>
            </Message>)
          }
        </Modal.Content>
      </Modal>
    )
  }
}

export default ReAuthModal