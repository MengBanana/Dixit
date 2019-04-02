import React, { Component } from "react";
import AccountsUIWrapper from "./AccountsUIWrapper.jsx";
import { NavLink } from "react-router-dom";


export default class NavBar extends Component {
  render() {
    return (
      <div className="navbar-container">
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
          <a className="navbar-brand" href="#">Dixit</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to="/testGameRoom">GameRoom</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to="/testMyGame">MyGame</NavLink>
              </li>
            </ul>
            <div className="nav-item ml-auto signin">
              <AccountsUIWrapper />
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
