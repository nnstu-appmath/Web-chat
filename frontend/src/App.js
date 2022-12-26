import './App.css';
import { useEffect } from 'react'
import {connect} from 'react-redux'
import {BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './Components/Login'
import Signup from './Components/Signup'
import Home from './Components/Home'
import { auth } from './firebase/config';
import ClipLoader from 'react-spinners/ClipLoader'
import './loader.css'

function App({dispatch, loading}) {

  useEffect(() => {
    auth.onAuthStateChanged((authUser) =>{
      dispatch({type: "SET_LOADING", payload: true})
      if (authUser){
          const getUserCredentials = async () => {
            await fetch('https://chat-8zxl.onrender.com/api/get_user', {
              method: "POST",
              body: JSON.stringify({
                email: authUser.email
              }),
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
            }).then(user => {
              return user.json()
            }).then(data => {
              dispatch({type: "LOGIN", payload: data})
              dispatch({type: "SET_LOADING", payload: false})
            })
          }

          getUserCredentials()
          
      } else{
          dispatch({type: "LOGOUT"})
          dispatch({type: "SET_LOADING", payload: false})
      }


    })
  }, [])

  return (
    <div className="App">
      {loading? (
        <div className="loader-wrapper"><ClipLoader className="loader" size={100} color={'#94f8ff'} loading={loading}/></div>
      ) : (
        <Router>
          <Route exact path="/signup" component={Signup}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/" component={Home}/>
        </Router>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  loading: state.user.loading
})

export default connect(mapStateToProps)(App);
