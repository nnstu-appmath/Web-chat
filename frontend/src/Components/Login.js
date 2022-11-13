import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import { auth } from '../firebase/config';
import { Link, useHistory } from "react-router-dom"
import './form.css'

function Login({user}) {
    const history = useHistory()
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    console.log(user)
    useEffect(() => {
        if (user.authenticated){
            history.push('/')
        }
    }, [user.authenticated])

    const handleEmailChange = (e) =>{
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e) =>{
        setPassword(e.target.value)
    }

    const handleSubmit = (e) => {
        setError('')
        e.preventDefault()
        
        auth.signInWithEmailAndPassword(email, password).then((res) => {
            console.log(res)
        }).catch(err => setError("Wrong email or password!"))
    }

    return (
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="form">
            <p className="text">Log In</p>
            <input className="form-item" placeholder='Email' onChange={handleEmailChange}></input>
            <input type="password" className="form-item" placeholder='Password' onChange={handlePasswordChange}></input>
            <p className="form-error">{error}</p>
            <button className="form-button" type="submit">Login</button>
            <p className="form-helper">Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </form>
      </div>
    );
  }

  const mapStateToProps = state => ({
    user: state.user,
  })
  
  export default connect(mapStateToProps)(Login);