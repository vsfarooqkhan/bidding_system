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

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isOpen: false,
          isLogout : false,
          isProducts : true,
          isAddProduct : false,
          isUserPage : false,
          buyerDashboard : false,
          proData : [],
          userData : []
        }
        this.getData = this.getData.bind(this)
        this.showUsers = this.showUsers.bind(this)
    }  
    toggle = () => {
        this.setState({isOpen : true})
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id] : e.target.value
        })
    }

    toggleModal = () => {
        this.setState({isAddProduct : !this.state.isAddProduct})
    }
    componentDidMount() {
        console.log(localStorage.getItem('userId'))
        console.log(localStorage.getItem('role'))
        console.log(localStorage.getItem('email'))
        if(!localStorage.getItem('userId')) {
            this.setState({isLogout : true})
        }
        else {
            if(localStorage.getItem('role') !== '1'){
                this.setState({buyerDashboard : true})
            }
            this.getData()
        }
        
    }
    showDisabled = () => {
        this.setState({showDisabled : !this.state.showDisabled})
    }
    async getData() {
        const events = await db.collection('products')
        events.get().then((querySnapshot) => {
            const tempDoc = querySnapshot.docs.map((doc) => {
                
                    return { id: doc.id, ...doc.data() }
                
                
            })
            console.log(tempDoc)
            this.setState({proData : tempDoc })
            })

    }
    addProduct = () => {
        this.setState({isAddProduct : !this.state.isAddProduct})
    }
    logOut = () => {
        this.setState({isLogout : true})
    }
    showProducts = () => {
        this.setState({
            isProducts : !this.state.isProducts,
            isUserPage : !this.state.isUserPage            
        })
    }
    approveProd = (id,i) => {
        console.log(i)
        Swal.fire({
            title: 'Are you sure You want to approve this?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Approve it!'
        })
        .then((result) => {
            if (result.isConfirmed) {
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
                    currentBid : this.state.proData[i].currentBid ? this.state.proData[i].currentBid : '',
                    isActive : this.state.proData[i].isActive ? this.state.proData[i].isActive : 0,
                }).then(doc => {
                    Swal.fire({
                        icon : 'success',
                        title : 'Updated Successfully!'
                    })
                })
            }
        })
          
    }
    disableProd = (id,i) => {
        Swal.fire({
            title: 'Are you sure You want to Delete this?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!'
        })
        .then((result) => {
            if (result.isConfirmed) {
                db.collection("products").doc(id).set({
                    isActive : 0,
                    id : id,
                    name : this.state.proData[i].name ? this.state.proData[i].name : '',
                    modelName : this.state.proData[i].modelName ? this.state.proData[i].modelName : '',
                    color : this.state.proData[i].color ? this.state.proData[i].color : '',
                    engine : this.state.proData[i].engine ? this.state.proData[i].engine : '',
                    maxPower : this.state.proData[i].maxPower ? this.state.proData[i].maxPower : '',
                    mileage : this.state.proData[i].mileage ? this.state.proData[i].mileage : '',
                    fuelCapacity : this.state.proData[i].fuelCapacity ? this.state.proData[i].fuelCapacity : '',
                    currentBid : this.state.proData[i].currentBid ? this.state.proData[i].currentBid : '',
                    status : this.state.proData[i].status ? this.state.proData[i].status : '' 
                }).then(doc => {
                    Swal.fire({
                        icon : 'success',
                        title : 'Updated Successfully!'
                    })
                })
            }
        })
          
    }
    disableUser = (id,index) => {
        Swal.fire({
            title: 'Are you sure You want to Delete this?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!'
        })
        .then((result) => {
            if (result.isConfirmed) {
            }
            
        
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        
        let id = Math.random().toString(36).substring(7);
        var data = {
            id : id,
            name : this.state.name,
            modelName : this.state.modelName,
            color : this.state.color,
            engine : this.state.engine,
            maxPower : this.state.maxPower,
            mileage : this.state.mileage,
            fuelCapacity : this.state.fuelCapacity,
            currentBid : this.state.currentBid,
        }
        console.log(data)
        db.collection("products").doc(id).set({
            name : this.state.name ? this.state.name : '',
            modelName : this.state.modelName ? this.state.modelName : '',
            color : this.state.color ? this.state.color : '',
            engine : this.state.engine ? this.state.engine : '',
            maxPower : this.state.maxPower ? this.state.maxPower : '',
            mileage : this.state.mileage ? this.state.mileage : '',
            fuelCapacity : this.state.fuelCapacity ? this.state.fuelCapacity : '',
            currentBid : this.state.currentBid ? this.state.currentBid : '',
        }).then(doc => {
            this.addProduct();
            this.getData();
            Swal.fire({
                icon : 'success',
                title : "Stored SuccessFully!"
            });
        })
        console.log(data)
    }

    async showUsers() {
        this.setState({isUserPage : !this.state.isUserPage,
                        isProducts : !this.state.isProducts})
        const events = await db.collection('user')
        events.get().then((querySnapshot) => {
            const tempDoc = querySnapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() }
            })
            console.log(tempDoc)
            this.setState({userData : tempDoc })
            })

    }
    render() {
        if (this.state.isLogout) {
            localStorage.clear()
            return <Redirect to={{
              pathname: "/",
              
            }}/>
        }  
        if(this.state.buyerDashboard) {
            return <Redirect to={{
                pathname: "/buy",
                
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
                        <NavLink active = {this.state.isProducts} style = {{cursor : 'pointer'}} onClick = {this.showProducts}>Products</NavLink>
                        </NavItem>
                        <NavItem>
                        <NavLink active = {this.state.isUserPage} style = {{cursor : 'pointer'}} onClick = {this.showUsers}>Users</NavLink>
                        </NavItem>
                        
                    </Nav>
                    <NavbarText style = {{cursor: 'pointer'}} onClick = {this.logOut}>Logout</NavbarText>
                    </Collapse>
                </Navbar>
                {this.state.isProducts ?
                <div>
                    <Button className = "" type = "button" color = "primary" onClick = {this.addProduct}> Add Product</Button>
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
                            <th> Current Bidding User</th>
                            <th> Approve</th>
                            <th> Delete</th>
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
                                        <td>{i.userId ? i.userId : 'No Users'}</td>
                                        <td>
                                            <Button disabled = {i.userId ? false : true} onClick = {(e) => this.approveProd(i.id,index) } color = "primary">{i.status == 'approved' ? 'Approved' : i.userId ? 'Approve' : 'Waiting for Users' }</Button>
                                        </td>
                                        <td>
                                            <Button onClick = {(e) => this.disableProd(i.id, index)} color = "danger">Delete</Button>
                                        </td>
                                    </tr>
                                    :
                                    this.state.showDisabled ?
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
                                        <td>{i.userId ? i.userId : 'No Users'}</td>
                                        <td>
                                            <Button onClick = {(e) => this.approveProd(i.id,index) } color = "primary">{i.status == 'approved' ? 'Approved' : 'Approve' }</Button>
                                        </td>
                                        <td>
                                            <Button onClick = {(e) => this.disableProd(i.id, index)} color = "danger">Delete</Button>
                                        </td>
                                    </tr>
                                    :
                                    ''
                                )
                                })
                            }
                        </tbody>
                    </Table>
                    <Button onClick = {this.showDisabled}>{this.state.showDisabled ? 'Hide' : 'Show'} Disabled Products</Button>
                </div>
                    
                  :
                  this.state.isUserPage ?
                    <Table hover>
                        <thead>
                        <tr>
                            <th>id</th>

                            <th>First Name</th>
                            <th>Email ID</th>
                            <th>Role</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.state.userData.map((i,index) => {
                                
                                return(
                                    <tr>
                                        <td>{i.id}</td>
                                        <td>{i.firstName}</td>
                                        <td>{i.email}</td>
                                        <td>{i.Role == 2 ? 'Buyer' : 'Admin'}</td>
                                        <td>
                                            <Button onClick = {(e) => this.disableUser(i.id, index)} color = "danger">Delete</Button>
                                        </td>
                                    </tr>
                                )
                                })
                            }
                        </tbody>
                    </Table>
                : ''
                }
                <Modal size = "lg" isOpen={this.state.isAddProduct} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Modal title</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup size="lg" controlId="email">
                            <Label>Product Name : </Label>
                                <Input
                                    autoFocus
                                    type="text"
                                    id = "name"
                                    placeholder="Product Name"
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup size="lg">
                                <Label>Model Name</Label><br/>
                                <Input
                                placeholder = "Model Name"
                                    type="text"
                                    id = "modelName"
                                    value={this.state.modelName}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup size="lg" controlId="engine">
                                <Label>Engine</Label><br/>
                                <Input
                                placeholder = "Engine"
                                    type="text"
                                    id = "Engine"
                                    value={this.state.engine}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup size="lg">
                                <Label>Color</Label><br/>
                                <Input
                                placeholder = "Color"
                                    type="text"
                                    id = "color"
                                    value={this.state.color}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup size="lg">
                                <Label>Fuel Capacity</Label><br/>
                                <Input
                                placeholder = "Fuel Capacity"
                                    type="text"
                                    id = "fuelCapacity"
                                    value={this.state.fuelCapacity}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup size="lg">
                                <Label>Max Power</Label><br/>
                                <Input
                                placeholder = "Max Power"
                                    type="text"
                                    id = "maxPower"
                                    value={this.state.maxPower}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup size="lg">
                                <Label>Mileage</Label><br/>
                                <Input
                                placeholder = "Mileage"
                                    type="text"
                                    id = "mileage"
                                    value={this.state.mileage}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup size="lg">
                                <Label>Starting Bid (In Rupees)</Label><br/>
                                <Input
                                placeholder = "Starting Bid"
                                    type="text"
                                    id = "currentBid"
                                    value={this.state.currentBid}
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                            <FormGroup size="lg">
                                <Button type = "submit" color = "primary">Save </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                    
                    <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
  
}

export default Dashboard;
