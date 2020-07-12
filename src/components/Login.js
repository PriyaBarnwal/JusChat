import React, { Component } from 'react'
import firebase from '../firebase'
import '../styles/Register.css'
import {Link} from 'react-router-dom'
import {Message, Button} from 'semantic-ui-react'
import logo from '../assets/mylogo.png'

class Login extends Component {
  state = {
    email: '',
    password: '',
    loading: false,
    errors: []
  }

  handleChange =(event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  onFormSubmit = async(event) => {
    let {email, password} = this.state

    event.preventDefault()
      this.setState({errors: [], loading: true})
      firebase
        .auth()
          .signInWithEmailAndPassword(email, password)
          .then(signedInUser => {
            this.setState({loading: false})
          })
          .catch(err => {
            this.setState({errors: this.state.errors.concat(err), loading: false})
          })

  }

  render() {
    let {password, email, loading} = this.state

    return (
      <div className="container">
        <div>
          <img src={logo} alt="logo"/>
        </div>
        <form className="ui error inverted segment form" onSubmit={this.onFormSubmit}>
          <div className="field">
            <input type="email" required name="email" value={email} placeholder="Email address" onChange={this.handleChange}/>
          </div>
          <div className="field">
            <input type="password" required name="password" value={password} placeholder="Password" onChange={this.handleChange}/>
          </div>
          <Button disabled={loading} className={loading ? 'loading': ''} type="submit">Sign in</Button>
            <div className="ui inverted segment message">
              Don't have an account?  <Link to="/register">Sign up</Link>  instead.
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

export default Login
