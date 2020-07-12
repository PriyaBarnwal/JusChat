import React from 'react'
import '../styles/SidePanel.css'
import UserPanel from './UserPanel'
import ChatsPanel from './ChatsPanel'

const SidePanel =(props) => {
  return (
    <div className="side-panel">
      {props.user ?<UserPanel {...props}/>: null}
      <ChatsPanel {...props}/>
    </div>
  )
}

export default SidePanel