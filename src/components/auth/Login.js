import React, { useState } from "react";
import { Button,Form, Input,FormGroup,Label } from 'reactstrap';
import firebaseConfig from '../config';
import firebase from 'firebase/app'
import Swal from 'sweetalert2'
//import Signup from './Register';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import "./Login.css";
firebase.initializeApp(firebaseConfig)
const Register = React.lazy(() => import('./Register'));
const Home = React.lazy(() => import('../admin/Dashboard'))
const db = firebase.firestore();
db.settings({


});

class Login extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        email: '',
        password : '',
        isRegister : false,
      };
      this.handleSubmit = this.handleSubmit.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.goToRegister = this.goToRegister.bind(this)
  }
  goToRegister = () => {
    this.setState({isRegister : true})
  }
  handleChange = (e) => {
    this.setState({
        [e.target.id] : e.target.value
    })
  }
  handleSubmit = (event) => {
    event.preventDefault();
    var email = this.state.email;
    var pass = this.state.password;
    firebase.auth().signInWithEmailAndPassword(email, pass)
    .then((user) => {
      db.collection("user").doc(user.user.uid).get().then(doc => {
          var addData = doc.data();
          localStorage.setItem('userId' , user.user.uid)
          localStorage.setItem('role',addData.Role)
          localStorage.setItem('email', this.state.email)
          this.setState({userData : addData})
          this.setState({redirect : true})
      });
      
    })
    .catch((error) => {
      this.setState({ error: error });
      Swal.fire(error.message)
    });
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={{
        pathname: "/dashboard",
        
      }}/>
    }  
    return (
        <div style={{"backgroundImage": './bg.jpg'}} className="Login">
          <Form onSubmit={this.handleSubmit}>
            <FormGroup size="lg" controlId="email">
              <Label>Email</Label><br/>
              <Input
                autoFocus
                type="email"
                id = "email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup size="lg" controlId="password">
              <Label>Password</Label><br/>
              <Input
              placeholder = "Password"
                type="password"
                id = "password"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </FormGroup>
            <Button block size="lg" type="submit">
              Login
            </Button>
          </Form>
          <Form>
          <Link to="/register">
          <Button block size = "lg" type = "button" color = "primary">
              New User ? Sign Up 
            </Button>
          </Link>
            
          </Form>
          {this.state.isRegister ?
            <div/>
            :
            ''
          }
        </div>
    );
  }
  
}

//const firebaseAppAuth = firebaseApp.auth();


export default Login;
