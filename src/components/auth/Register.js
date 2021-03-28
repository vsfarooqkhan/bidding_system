import React from 'react'
import { Button,Form, Input,FormGroup,Label } from 'reactstrap';
import {useHistory} from 'react-router-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
  } from "react-router-dom";

import firebase from 'firebase/app'
import Swal from 'sweetalert2'
import "./Login.css";
//firebase.initializeApp(firebaseConfig)
const db = firebase.firestore();
export default class Signup extends React.Component {
    state = {
        email :'',
        password:'',
        firstName:'',
        lastName:'',
        user:null,
    }      
    handleChange = (e) => {
        this.setState({
            [e.target.id] : e.target.value
        })
    }
    
    handleSubmit = (e) => {
        e.preventDefault()
        e.preventDefault()
        console.log(this.state)
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((user) => {
            
            db.collection("user").doc(user.user.uid).set({
                email: this.state.email,
                Role: 2,
                status: 1,
                UID: user.user.uid,
            }).then(doc => {
                Swal.fire("Register Success!")
                //const history = useHistory();
                //history.push('/dashboard');
            })
            

        }).catch(function(error) {
            alert('Error :'+error.message);
           })
    }
    logOut = (e) => {
        e.preventDefault()
        firebase.auth().signOut()
    }
    signIn1 = () => {
        //window.location.href ='/signin'
    }
    getDetails = () => {
        firebase.auth().onAuthStateChanged(user => {
            user
              ? this.setState({ user })
              : this.setState({ user: null });
          });   
    }
    componentDidMount() {
        this.getDetails()
    }
    render() {
        return (
            
            <div>
            
            {
                this.state.user != null ?
                <div> 
                <h4>User already logged in </h4>
                <p>{this.state.user.email}</p>
                <Button className="btn dark ilghten-4 z-depth-0" onClick={this.logOut}>Signout </Button>
                </div>
                :
            <div className="Login">
                <h2> Signup</h2>
                <form onSubmit={this.handleSubmit} className="white">
                    <div className="Input-field">
                        <Label htmlFor="FirstName"> First Name</Label>
                        <Input type = "text" id="firstName" onChange={this.handleChange}></Input>
                    </div>
                    <div className="Input-field">
                        <Label htmlFor="lastName"> Last Name</Label>
                        <Input type = "text" id="lastName" onChange={this.handleChange}></Input>
                    </div>
                    <div className="Input-field">
                        <Label htmlFor="email"> Email</Label>
                        <Input type = "text" id="email" onChange={this.handleChange}></Input>
                    </div>
                    <div className="Input-field">
                        <Label htmlFor="password"> Password</Label>
                        <Input type="text" id ="password" onChange={this.handleChange}></Input>
                    </div>
                    <div className="Input-field">
                        {/* <Button  className ="btn pink lighten-2 z-depth-0">Signup</Button> <p></p> */}
                        <Button type="submit" color = "info"  className="btn blue lighten-2 z-depth-0">Sign Up </Button>
                    </div>
                    <div>
                    <Link to="/">
                        <Button block size = "lg" type = "button" color = "primary">
                            Already user ? Sign In 
                            </Button>
                    </Link>
                    </div>
                </form>
            </div>
            }
            </div>
        )
    }
}