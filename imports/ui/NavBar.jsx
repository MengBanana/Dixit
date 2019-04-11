import React, { Component } from "react";
import AccountsUIWrapper from "./AccountsUIWrapper.jsx";
import { NavLink } from "react-router-dom";


export default class NavBar extends Component {
  // <div className="navbar-header">
  //           <NavLink className="nav-link" activeClassName="active" to="/">
  //             <img className="navbar-brand" src="http://www.sophia-jezykiobce.pl/wp-content/uploads/2018/02/dixit-logo-1-1170x630.png" width="250px"/>
  //           </NavLink>
  //         </div>
  render() {
    return (
      <div className="navbar-container">
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
          <div className="nav-item ml-auto signin">
            <AccountsUIWrapper />
          </div>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarsExampleDefault">
            
            <ul className="navbar-nav ml-auto navbar-expand-lg ">
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to="/About">Game Rules</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to="/gameroom">Game Room</NavLink>
              </li>
            </ul>
          </div>
          
        </nav>
      </div>
    );
  }
}
