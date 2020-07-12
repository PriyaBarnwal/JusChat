import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import Login from './components/Login'
import firebase from './firebase'
import Register from './components/Register'
import {BubbleLoader} from './components/Loader'
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom'
import {Provider, connect} from 'react-redux'
import {createStore} from 'redux'
import {setUser, clearUser} from './actions/userAction'
import rootReducer from './reducers/rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension'


class Root extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user=> {
      if (user) {
        this.props.setUser(user)
        this.props.history.push("/")
      } else {
        this.props.history.push("/login")
        this.props.clearUser()
      }
    })
  }

  render() {
    return (
      this.props.isLoading 
      ? <BubbleLoader/>
      :(
        <Switch>
          <Route path = "/" component={App} exact/>
          <Route path = "/login" component={Login}/>
          <Route path = "/register" component={Register}/>
        </Switch>)
    )
  }
}

const store = createStore(rootReducer, composeWithDevTools())

let mapStateToProps = (state) => {
  return {
    isLoading: state.user.loading
  }
}
const RootAuth = withRouter(connect(mapStateToProps, {setUser, clearUser})(Root))

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <RootAuth/>
    </BrowserRouter>
  </Provider>, 
  document.getElementById('root')
)
registerServiceWorker();
