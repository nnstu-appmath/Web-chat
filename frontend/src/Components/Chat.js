import React, {useEffect, useState} from 'react'
import { useHistory } from "react-router-dom"
import {connect} from 'react-redux'
import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import {projectStorage} from "../firebase/config"
import "./Chat.css"

function Chat({dispatch, user, chatId, chatName, socket, messages, headerImg}) {
    const [text, setText] = useState("")

    useEffect(() => {
        const getMessages = async () => {
            await fetch(`http://192.168.1.202:8080/api/get_messages/${chatId}`).then(data => {
                return data.json()
            }).then(data => {
                dispatch({type: "SET_MESSAGES", payload: data['data']})
            })
        }

        getMessages()
    }, [chatId])
    

    const handleInputChange = (e) => {
        setText(e.target.value)
    }

    const handleMessageSend = (e) => {
        socket.emit('send_message', {
            room: chatId,
            text: text,
            sender: user ? user.user.email: null,
            imageUrl: user.user? user.user.imageUrl: "",
            username: user.user? user.user.username: "",
        })
        setText("")
    }

    const getMessage = (item) => {

        return item.sender == (user.user ? user.user.email: null)? (
            <div className="message-autor">
                <div className="message-autor-text-wrapper">
                    <p className="message-autor-text">{item.text}</p>
                </div>
                <img className="message-autor-img" src={item.imageUrl} alt={item.alt}/>
                
            </div>
        ): (
            <div className="message">
                <img className="message-img" src={item.imageUrl} alt={item.alt}/>
                <div className="message-text-wrapper">
                    <p className="message-text">{item.text}</p>
                </div>
            </div>
        )
    }

    const handleHeaderFileChange = (e) => {
        const file = e.target.files[0]
        const storageRef = projectStorage.ref(file.name);
        console.log(file)
        storageRef.put(file).on('state_changed', () => {}, () => {}, 
        async () => {
          const url = await storageRef.getDownloadURL();
          fetch('http://192.168.1.202:8080/api/update_chat_photo', {
              method: "POST",
              body: JSON.stringify({
                  imageUrl: url,
                  chatId: chatId
              }),
              headers: {
                  "Content-type": "application/json; charset=UTF-8"
              }
          })
          dispatch({type: "SET_CHAT_IMAGE", payload: {imageUrl: url, chatId: chatId}})

        })
      }

    const handleHeaderLogoClick = () => {
        document.getElementById("ccp").click()
    }

    return (
        <>
            {chatId != null? (
                <div className="Chat">
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <p className="chat-header-name">{chatName}</p>
                            <p className="chat-header-id">#{chatId}</p>
                        </div>
                        <div className="chat-header-logo-wrapper">
                            <img onClick={handleHeaderLogoClick} className="chat-header-logo" src={headerImg}/>
                            <input onChange={handleHeaderFileChange} id="ccp" className="change-chat-photo" type="file"/>
                        </div>
                    </div>
                    <div className="main-content">
                        {messages.map(item => {
                            return getMessage(item)
                        })}
                    </div>
                    <div className="chat-input-wrapper">
                        <div className="chat-attach-icon-wrapper">
                            <AttachFileIcon fontSize="large" className="chat-attach-icon"/>
                        </div>
                        <input placeholder="Write a message..." className="chat-input" value={text} onChange={handleInputChange}/>
                        <div className="chat-send-icon-wrapper">
                            <SendIcon fontSize="large" className="chat-send-icon" onClick={handleMessageSend}>Send</SendIcon>
                        </div>
                        
                    </div>
                    
                </div>
            ):(
                <div className="Chat">

                </div>
            )}
        </>
    );
  }

  const mapStateToProps = state => ({
    user: state.user,
    chatId: state.app.chatId,
    chatName: state.app.chatName,
    socket: state.app.socket,
    messages: state.app.messages,
    headerImg: state.app.imageUrl
  })
  

export default connect(mapStateToProps)(Chat);