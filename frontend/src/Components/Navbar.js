import React, {useEffect, useState} from 'react'
import { useHistory } from "react-router-dom"
import { auth } from '../firebase/config';
import {connect} from 'react-redux'
import "./Navbar.css"
import ChatBubbleOutlineRoundedIcon from '@material-ui/icons/ChatBubbleOutlineRounded';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {projectStorage} from "../firebase/config"

function Navbar({dispatch, socket, chatId, user}) {

    const logout = () => {
      socket.emit("leave_room", {
        room: chatId
      })
      auth.signOut()
    }

    const handleAvaClick = () => {
      document.getElementById("cp").click()
    }

    const handleFileChange = (e) => {
      const file = e.target.files[0]
      const storageRef = projectStorage.ref(file.name);
      console.log(file)
      storageRef.put(file).on('state_changed', () => {}, () => {}, 
      async () => {
        const url = await storageRef.getDownloadURL();
        fetch('https://chat-8zxl.onrender.com/api/update_user_photo', {
            method: "POST",
            body: JSON.stringify({
                imageUrl: url,
                userId: user.user? user.user.userId : null
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        fetch('https://chat-8zxl.onrender.com/api/update_messages_photo', {
            method: "POST",
            body: JSON.stringify({
                imageUrl: url,
                email: user.user? user.user.email : ""
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        dispatch({type: "SET_USER_IMAGE", payload: {imageUrl: url, sender: user.user? user.user.email: null}})
      })
    }

    return (
      <div className="Navbar">
        <div className="left-nav">
            <ChatBubbleOutlineRoundedIcon className="left-nav-icon"/>
            <p className="left-nav-text">Messaging</p>
        </div>
        <div className="right-nav">
          <div className="rn-items-wraper">
            <div className="nav-logo-wrapper">
              <img onClick={handleAvaClick} className="nav-logo" src={user.user? user.user.imageUrl: ""}/>
              <input onChange={handleFileChange} id="cp" className="change-photo" type="file"/>
            </div>
            <div className="logout-wrapper">
              <ExitToAppIcon className="logout" onClick={logout}/>
            </div>
          </div>

        </div>
      </div>
    );
  }

  const mapStateToProps = state => ({
    socket: state.app.socket,
    chatId: state.app.chatId,
    user: state.user
  })
  

export default connect(mapStateToProps)(Navbar);