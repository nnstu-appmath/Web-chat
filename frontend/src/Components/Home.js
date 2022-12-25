import React, {useEffect, useState} from 'react'
import { useHistory } from "react-router-dom"
import {connect} from 'react-redux'
import LeftSideBar from "./LeftSideBar"
import Chat from "./Chat"
import RightSideBar from "./RightSideBar"
import Navbar from "./Navbar"
import "./Home.css"
import {io} from "./socket"

function Home({dispatch, authenticated, chatId}) {
    const history = useHistory()

    useEffect(() => {
          if (!authenticated){
              history.push('/login')
          }
      }, [authenticated])


    useEffect(() => {
        const getS = async () => {
            const s = await io("https://chat-8zxl.onrender.com/")
        
            s.on('join_room_announcement', (data) => {
                console.log("Joined")
            })
        
            s.on('receive_message', (data) => {
                dispatch({type: "ADD_MESSAGE", payload: data})
            })

            dispatch({type: "SET_SOCKET", payload: s})
        }

        getS();
    }, [])

    return (
      <div className="Home">
        <Navbar/>
        <div className="Content">
          <LeftSideBar/>
          {chatId && <Chat/>}
          {chatId && <RightSideBar/>}
        </div>
      </div>
    );
  }

  const mapStateToProps = state => ({
    authenticated: state.user.authenticated,
    chatId: state.app.chatId
  })
  

export default connect(mapStateToProps)(Home);
