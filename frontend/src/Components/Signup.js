import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import { auth } from '../firebase/config';
import { Link, useHistory } from "react-router-dom"
import './form.css'

function Signup({dispatch, location, user}) {

    const history = useHistory()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')

    console.log(user)
    useEffect(() => {
        if (user.authenticated){
            history.push('/')
        }
    }, [user.authenticated])

    const handleUsernameChange = (e) =>{
        setUsername(e.target.value)
    }

    const handleEmailChange = (e) =>{
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e) =>{
        setPassword(e.target.value)
    }

    const handleConfirmPasswordChange = (e) =>{
        setConfirmPassword(e.target.value)
    }


    const handleSubmit = (e) => {
        setError('')
        e.preventDefault()

        fetch('http://192.168.1.202:8080/api/create_user', {
            method: "POST",
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                imageUrl: "https://firebasestorage.googleapis.com/v0/b/gravens-chat.appspot.com/o/NoImg.png?alt=media&token=1697ece8-e26f-46e0-a603-078da521e6f0"
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => res.json())
          .then(message => {
              if (message["error"]){
                  return setError(message["error"])
              }
              auth.createUserWithEmailAndPassword(email, password)
            }).catch(err => console.log(err))
    }

    return (
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="form">
            <p className="text">Sign Up</p>
            <input className="form-item" placeholder='Username' onChange={handleUsernameChange}></input>
            <input className="form-item" placeholder='Email' onChange={handleEmailChange}></input>
            <input type="password" className="form-item" placeholder='Password' onChange={handlePasswordChange}></input>
            <input type="password" className="form-item" placeholder='Confirm password' onChange={handleConfirmPasswordChange}></input>
            <p className="form-error">{error}</p>
            <button className="form-button" type="submit">Sign Up</button>
            <p className="form-helper">Already have an account? <Link to="/login">Log In</Link></p>
        </form>
      </div>
    );
  }

  const mapStateToProps = state => ({
    user: state.user,
  })

  export default connect(mapStateToProps)(Signup);
