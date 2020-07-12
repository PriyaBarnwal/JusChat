import React from 'react'
import {Header, Segment} from 'semantic-ui-react'
import '../styles/MessagesPanel.css'
import MessageForm from './MessageForm'
import Messages from './Messages'
import logo from '../assets/mylogo.png'

class MessagesPanel extends React.Component {
  componentDidUpdate() {
    const container = document.querySelector('.chat-box')
    container && container.scrollTo(0, container.scrollHeight)

    let lastMessage = this.props.friend && this.props.friend.chats.messages.slice(-1)[0]

    if (this.props.friend && lastMessage 
        && this.props.friend.chats.receiverHasRead === false 
        && this.props.user.email!==lastMessage.sender)
      this.props.updateRead(this.props.friend.id)
  }

  render() {
    return (
      this.props.friend ?
     (
      <div className="message-panel">
        <Header inverted as='h2' className="messages-header" dividing>
          {this.props.friend.meta.displayName}
          <img src={logo} alt="logo"/>
        </Header>
        <Segment className ="chat-box">
          <Messages {...this.props}/>
        </Segment>
        <MessageForm onSendMessage={this.props.onSendMessage}/>
      </div>
    ): (
      <div className="empty-panel">
        <div><img src={logo} alt="logo"/></div>
        <div>Hey {this.props.user.displayName}! Welcome to JusChat..</div>
      </div>
    )
    )
  }
    
}

export default MessagesPanel