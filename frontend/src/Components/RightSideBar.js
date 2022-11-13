import React, {useEffect, useState} from 'react'
import { useHistory } from "react-router-dom"
import {connect} from 'react-redux'
import "./RightSideBar.css"

function RightSideBar({dispatch, creator}) {

    

    return (
      <div className="RightSideBar">
        <div className="right-header">
          <p className="rh-info">Chat info</p>
        </div>
        <div className="r-content-wrapper">
          <p className="r-content-item">Creator: {creator}</p>
        </div>
      </div>
    );
  }

  const mapStateToProps = state => ({
    creator: state.app.creator
  })
  

export default connect(mapStateToProps)(RightSideBar);