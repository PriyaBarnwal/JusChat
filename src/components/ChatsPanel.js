import React from 'react'
import moment from 'moment'
import { List, Icon, Divider, Label} from 'semantic-ui-react'
import '../styles/ChatsPanel.css'
import defaultPic from '../assets/blank-profile-pic.png'

class ChatsPanel extends React.Component {
  isSenderUser=(chat) => {
    return chat.messages[chat.messages.length-1].sender === this.props.user.email
  }

  render() {
    let {friends, selectedChat} = this.props
    let friend_keys = Object.keys(friends)
    
    friend_keys = friend_keys.sort((a,b)=>{
      return (friends[a].chats.lastMessageAt>friends[b].chats.lastMessageAt) ? -1: 1
    })
    return (
      friend_keys && friend_keys.length ?
      (
        <List relaxed divided>
          {friend_keys.map((key, index)=>{
            return (
              <div key ={index} className={selectedChat === key ? 'selected': ''}>
                <div className="chat-item" onClick={()=>this.props.onSelectChat(key)}>
                  <img className='chat-icon' alt ='chat icon' src={friends[key].meta.profilepic || defaultPic} />
                  <div>
                    <div className='chat-name'>{friends[key].meta.displayName}</div>
                    <div className='last-message'>{
                      friends[key].chats.messages.slice(-1)[0].type==='file' 
                      ? 'attachment' 
                      : friends[key].chats.messages.slice(-1)[0].message.slice(0,30)+'...'}
                    </div>
                  </div>
                  <div className='chat-time'>{moment(friends[key].chats.lastMessageAt).format('DD MMM h:mm A')}</div>
                  {!friends[key].chats.receiverHasRead && !this.isSenderUser(friends[key].chats) && 
                    <Label color='red' floating>
                      <Icon className="notif-icon" name='bell'/>
                    </Label>
                  }
                </div>
                <Divider style={{margin:0}}/>
              </div>
            ) 
          })} 
        </List>
      ): null
    )
  }
}

export default ChatsPanel