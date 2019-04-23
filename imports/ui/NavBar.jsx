import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { NavLink } from "react-router-dom";


export default class NavBar extends Component {

  logoutOnClick() {
    Meteor.logout(err => {
      if (err) {
        console.log(err);
      }
    });
  }


  render() {
    let username = "";
    if (Meteor.user()) {
      if (!Meteor.user().username) {
        username = Meteor.user().services.twitter.screenName;
      } else {
        username = Meteor.user().username;
      }
    }

    return (
      <div className="navbar-container">
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
          <div className="navbar-header d-flex justify-content-center h-100">
            <NavLink className="nav-link" activeClassName="active" to="/">
              <img className="navbar-brand" src="http://assets.asmodee.ca/fichiers/Libellud/Dixit/1.Dixit%20-%20Base/Dixit-title.png"/>
            </NavLink>
          </div>
    
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarsExampleDefault">
            <div className="nav-item ml-auto signin">
              {Meteor.user() ? <div className="nav-item btn dropdown"><span className="dropbtn"><i className="fas fa-user"></i><span className="user"> {username} </span> </span>
                <div className="dropdown-content">
                  <NavLink className="nav-link" activeClassName="active" to="/" onClick={this.logoutOnClick.bind(this)}>Log Out</NavLink>
                </div>
              </div> :
                <div className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to="/Login">Sign in</NavLink>
                </div>
              }
            </div>
            <ul className="navbar-nav ml-auto navbar-expand-lg ">
              {Meteor.user() ?<li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to="/gameroom">Game Room</NavLink>
              </li> :null}
              {Meteor.user() ?
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to="/About">Game Rules</NavLink>
                </li>: null}
            </ul>
          </div>
          
        </nav>

      </div>

    );
  }
}
