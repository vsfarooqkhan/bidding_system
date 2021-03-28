import logo from './logo.svg';
import './App.css';
import Login from './components/auth/Login';
import Signup from './components/auth/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebaseConfig from './components/config';
import firebase from 'firebase/app'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Dashboard from './components/admin/Dashboard';
import BDashboard from './components/buyer/Dashboard';
import Products from './components/admin/Products'
// firebase.initializeApp(firebaseConfig)
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Signup} />
          <Route exact path = "/dashboard" component = {Dashboard}/>
          <Route exact path = "/home" component = {Dashboard}/>
          <Route exact path = "/products" component = {Products}/>
          <Route exact path = "/buy" component = {BDashboard}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
