import React, { Component } from 'react'
import firebase from '../firebase'
import '../styles/Register.css'
import {Link} from 'react-router-dom'
import {Message, Button} from 'semantic-ui-react'
import logo from '../assets/mylogo.png'

class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    confirmPassowrd: '',
    loading: false,
    errors: []
  }

  handleChange =(event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  saveUser =(createdUser) => {
    const userObj = {
      email: createdUser.user.email,
      profilePhoto: createdUser.user.photoURL,
      displayName: createdUser.user.displayName
    }

    return firebase
      .firestore()
      .collection('users')
      .doc(createdUser.user.email)
      .set(userObj)
  }

  isPasswordValid = () => {
    let {password, confirmPassword} = this.state,
      errors = []

    if (password !== confirmPassword) {
      this.setState({
        errors: errors.concat("password and confirm password don't match")
      })
      return false
    } else if (password.length<8) {
      this.setState({
        errors: errors.concat("password length should be greater than 8")
      })
      return false
    }
    return true
  }

  onFormSubmit = async(event) => {
    let {email, password, username} = this.state
    event.preventDefault()
    if (this.isPasswordValid()) {
      this.setState({errors: [], loading: true})
      firebase
        .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(createdUser => {
            if (createdUser){
              createdUser.user.updateProfile({
                displayName: username
              })
              .then(()=> {
              this.setState({loading: false})
                this.saveUser(createdUser)
                  .then(()=> {})
                  .catch((err)=>alert(err.message))
              })
              .catch((err) => this.setState({errors: this.state.errors.concat(err), loading: false}) )
            }
          })
          .catch(err => {
            this.setState({errors: this.state.errors.concat(err), loading: false})
          })
    } 
  }

  render() {
    let {username, password, confirmPassword, email, loading} = this.state

    return (
      <div className="container">
        <div>
          <img src={logo} alt="logo"/>
        </div>
        <form className="ui error inverted segment form" onSubmit={this.onFormSubmit}>
          <div className="field">
            <input required type="text" name="username" value={username} placeholder="UserName" onChange={this.handleChange}/>
          </div>
          <div className="field">
            <input type="email" required name="email" value={email} placeholder="Email address" onChange={this.handleChange}/>
          </div>
          <div className="field">
            <input type="password" required name="password" value={password} placeholder="Password" onChange={this.handleChange}/>
          </div>
          <div className="field">
            <input type="password" required name="confirmPassword" value={confirmPassword} placeholder="Confirm Password" onChange={this.handleChange}/>
          </div>
          <Button disabled={loading} className={loading ? 'loading': ''} type="submit">Submit</Button>
          <div className="ui inverted segment message">
            Already signed up?  <Link to="/login">Login here</Link>  instead.
          </div>
        </form>
        {this.state.errors.length>0 && 
          (<Message error>
            <h3>Errors:</h3>
            <p>{this.state.errors.join(',')}</p>
          </Message>)
        }
      </div>
    )
  }
}

export default Register
