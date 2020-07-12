import React from 'react'
import moment from 'moment'
import '../styles/Messages.css'
import defaultPic from '../assets/blank-profile-pic.png'

class Messages extends React.Component {
  render() {
    let {friend, user} = this.props
    //let defaultPicPath='./blank-profile-pic.png'

    return (
      <div>
        {friend.chats.messages.map((msg, index)=>{
          return (
            <div key={index} className={msg.sender===user.email ? 'my-msg' : 'friend-msg'}>
              {msg.sender!==user.email &&
              <img src={friend.meta.profilepic || defaultPic} alt='sender' className='icon'/>}
              <div>
                {msg.type === 'file' &&
                  (
                    <div className="message-text">
                    <img src={msg.message} style={{height: "200px"}}alt="some attachment failed to load"/>
                    </div>
                  )
                }
                {msg.type!=='file' &&(
                  <div className="message-text">
                    {msg.message}
                  </div>
                )}
                <span className="message-time">
                  {moment(msg.timeStamp).format('DD MMM h:mm A')}</span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default Messages