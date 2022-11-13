import React, {useEffect, useState} from 'react'
import { useHistory } from "react-router-dom"
import {connect} from 'react-redux'
import {timestamp} from '../firebase/config'
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import SearchIcon from '@material-ui/icons/Search';

import "./LeftSideBar.css"

function LeftSideBar({dispatch, user, chatRooms, socket, currentRoomId, chatId}) {

    const [search, setSearch] = useState("")

    const handleCreateChatRoom = () => {
        const roomName = prompt("Enter a new room name")
        const roomData = {
            name: roomName,
            creator: user.user.email,
            username: user.user.username,
            imageUrl: user.user? user.user.imageUrl: ""
        }

        fetch('http://192.168.1.202:8080/api/create_chat_room', {
            method: "POST",
            body: JSON.stringify(roomData),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          }).then((data) => {
              return data.json()
          }).then(data => {
            roomData.roomId = data.roomId
            roomData.lastUpdate = data.lastUpdate
            dispatch({type: "ADD_USER_CHAT_ROOM", payload: roomData})
          })
        

    }


    const handleChatClick = (e) => {
        if (currentRoomId) {
            socket.emit("leave_room", {
                room: currentRoomId
            })
        }
        
        socket.emit("join_room", {
            room: e.currentTarget.id
        })

        chatRooms.forEach(room => {
            if (room.roomId == e.currentTarget.id){
                dispatch({type: "SET_CURRENT_CHAT", payload: {id: e.currentTarget.id, name: room.name, imageUrl: room.imageUrl, creator: room.creator}})
            }
        })
    }

    const getRoom = (item) => {
      return <div key={item.roomId} id={item.roomId} name={item.name} onClick={handleChatClick} className="chat-instance"> 
          <div className="chat-instance-img-wrapper">
            <img className="chat-instance-img" src={item.imageUrl}/>
          </div>
          <div className="chat-instance-content-wrapper">
            <div className="chat-instance-content-name-wrapper">
              <p className="chat-instance-content-name">{item.name}</p>
            </div>
            <div className="chat-instance-content-msg-wrapper">
              <p className="chat-instance-content-msg">{item.username}</p>
            </div>
          </div>
      </div>
    }


    const handleSearchChange = (e) => {
        setSearch(e.target.value)
    }

    const handleSearchSend = () => {
      fetch('http://192.168.1.202:8080/api/search_room', {
            method: "POST",
            body: JSON.stringify({
                room_id: search,
                email: user.user? user.user.email: null
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(data => {
          return data.json()
        }).then(data => {
          if (data.Success){
            dispatch({type: "ADD_USER_CHAT_ROOM", payload: data.Success})
          } else {
            alert(data.Fail)
          }
        })
    }

    return (
      <div className="LeftSideBar" style={{borderRight: chatId? "1px solid #dfebe8": "none", flex: chatId? "0.25": "0.6"}}>
        <div className="left-header">
            <div className={chatId? "media-v1": "no-media-v1"}>
              <p className="left-header-text">Chats</p>
              <div className="left-input-wrapper">
                <input placeholder="Search" className="left-input" type="text" value={search} onChange={handleSearchChange}/>
                <SearchIcon onClick={handleSearchSend} className="left-search-icon"/>
              </div>
              <div className="left-add-icon-wrapper">
                <AddRoundedIcon onClick={handleCreateChatRoom} fontSize="large" className="left-add-icon"/>
              </div>
            </div>
            {chatId && <div className="media-v2">
              <p className="left-header-text-m">Chats</p>
              <div className="left-add-icon-wrapper-m">
                <AddRoundedIcon onClick={handleCreateChatRoom} fontSize="large" className="left-add-icon-m"/>
              </div>
            </div>}
        </div>
        <div className="left-rooms-wrapper">
          {chatRooms && chatRooms.map(room => {
              return getRoom(room)
          })}
        </div>
      </div>
    );
  }

  const mapStateToProps = state => ({
    user: state.user,
    chatRooms: state.user.chatRooms,
    socket: state.app.socket,
    currentRoomId: state.app.chatId,
    chatId: state.app.chatId
  })
  

export default connect(mapStateToProps)(LeftSideBar);