import { Route,Switch } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Signup from "./components/Signup";
import About from "./components/About";
import Admin from "./components/Admin";
import Footer from "./components/Footer";
import './App.css'
function App() {
  return (
    <div className="App">
        <Navbar/>
    <Switch>
    <Route  exact path="/" component={Home} />
<Route exact path="/contact" component={Contact} />
<Route exact path="/signup" component={Signup} />
<Route  exact path="/login" component={Login} />
<Route  exact path="/about" component={About} />
<Route  exact path="/logout" component={Logout} />
<Route  exact path="/Admin" component={Admin} />

    </Switch>
    <Footer/>

    </div>
  );
}

export default App;
