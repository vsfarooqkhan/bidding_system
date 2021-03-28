import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Table,Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
  } from "react-router-dom";
import firebase from 'firebase/app'
import Swal from 'sweetalert2'
import { Button,Form, Input,FormGroup,Label } from 'reactstrap';

const db = firebase.firestore();


export default class BDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isProducts : true,
            isOpen: false,
            proData : []
        }
        this.getData = this.getData.bind(this)
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id] : e.target.value
        })
    }
    componentDidMount() {
        console.log(localStorage.getItem('userId'))
        console.log(localStorage.getItem('role'))
        console.log(localStorage.getItem('email'))
        if(!localStorage.getItem('userId')) {
            this.setState({isLogout : true})
        }
        else {
            if(localStorage.getItem('role') !== 2){
                this.setState({buyerDashboard : true})
            }
            this.getData()
        }
        
    }  
    toggle = () => {
        this.setState({isOpen : true})
    }
    showProducts = () => {
        this.setState({isProducts : true})
    }
    logOut = () => {
        this.setState({isLogout : true})
    }
    async getData() {
        const events = await db.collection('products')
        events.get().then((querySnapshot) => {
            const tempDoc = querySnapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() }
            })
            this.setState({proData : tempDoc })
        })
    }
    addBid = (id, i) => {
        var currentBid = this.state.proData[i].currentBid ? this.state.proData[i].currentBid : 0; 
        Swal.fire({
            title: 'Enter your Bid Amount',
            input: 'text',
            inputLabel: 'Bid Amount',
            inputValue: this.state.proData[i].currentBid ? this.state.proData[i].currentBid : 0,
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) {
                return 'You need to write something!'
              }
              else if(value <= currentBid) {
                  return 'Amount should be greater than current Bid amount'
              }
              else {
                db.collection("products").doc(id).set({
                    status : 'approved',
                    id : id,
                    name : this.state.proData[i].name ? this.state.proData[i].name : '',
                    modelName : this.state.proData[i].modelName ? this.state.proData[i].modelName : '',
                    color : this.state.proData[i].color ? this.state.proData[i].color : '',
                    engine : this.state.proData[i].engine ? this.state.proData[i].engine : '',
                    maxPower : this.state.proData[i].maxPower ? this.state.proData[i].maxPower : '',
                    mileage : this.state.proData[i].mileage ? this.state.proData[i].mileage : '',
                    fuelCapacity : this.state.proData[i].fuelCapacity ? this.state.proData[i].fuelCapacity : '',
                    currentBid : value,
                    isActive : this.state.proData[i].isActive ? this.state.proData[i].isActive : '',
                    userId : localStorage.getItem('userId')
                }).then(doc => {
                    this.getData();
                    Swal.fire({
                        icon : 'success',
                        title : 'Bidding amount added Successfully!',
                        text: 'We will let you know soon .'
                    })
                    
                })
              }
            }
          })
    }
    render() {
        if (this.state.isLogout) {
            localStorage.clear()
            return <Redirect to={{
              pathname: "/",
              
            }}/>
        }
        return (
            <div>
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand href="/home">Bidding System</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                        <NavLink style = {{cursor : 'pointer'}} onClick = {this.showProducts}>Available Products</NavLink>
                        </NavItem>
                        <NavItem>
                        <NavLink style = {{cursor : 'pointer'}} onClick = {this.showUsers}>Bucket List</NavLink>
                        </NavItem>
                        
                    </Nav>
                    <NavbarText style = {{cursor: 'pointer'}} onClick = {this.logOut}>Logout</NavbarText>
                    </Collapse>
                </Navbar>

                {this.state.isProducts ?
                    <div>
                        <Table hover>
                            <thead>
                            <tr>
                                <th>id</th>

                                <th>Product Name</th>
                                <th>color</th>
                                <th>Model Name</th>
                                <th> Engine</th>
                                <th>Max Power</th>
                                <th> Mileage</th>
                                <th> Fuel Capacity</th>
                                <th> Current Bid</th>
                                <th> Approve</th>
                            </tr>
                            </thead>
                            <tbody>
                                {this.state.proData.map((i,index) => {
                                    
                                    return(
                                        
                                        i.isActive !== 0 ?
                                        <tr>
                                            <td>{i.id}</td>
                                            <td>{i.name}</td>
                                            <td>{i.color}</td>
                                            <td>{i.modelName}</td>
                                            <td>{i.engine}</td>
                                            <td> {i.maxPower}</td>
                                            <td> {i.mileage}</td>
                                            <td>{i.fuelCapacity}</td>
                                            <td>{i.currentBid}</td>
                                            <td>
                                                <Button onClick = {(e) => this.addBid(i.id,index) } color = "primary"> Bid Amount</Button>
                                            </td>
                                            
                                        </tr>
                                        :
                                        ''
                                    )
                                    })
                                }
                            </tbody>
                        </Table>
                        
                    </div>
                    :
                    ''
                }
            </div>
        )
    }
}
