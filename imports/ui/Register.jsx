
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Accounts } from "meteor/accounts-base";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import { Alert } from "reactstrap";

import { Redirect } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      username : "",
      password :"",
      password2 : "",
      avatar :"",
      error: ""
    });
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e){
    this.setState(
      {
        [e.target.id]: e.target.value
      }
    );
  }

  onSubmit (e) {
    e.preventDefault();
    if (this.state.password === this.state.password2) {
      let avatarURL = "https://api.adorable.io/avatars/285/" + this.state.username;
      let userData = {
        username: this.state.username,
        password: this.state.password,
        profile: {
          avatar: avatarURL
        }
      };
      Accounts.createUser(userData, function(error) {
        if (error) {
          alert(error);
        } else {
          console.log("succeed");
        }
      });
    } else {
      this.setState({error: "password doesn't match"});
    }
  }

  render() {
    if (Meteor.user()) return <Redirect to="/gameroom" user={Meteor.user()}/>;
    return (
      <div className="container">
        <br/><br/>
        {this.state.error ? (
          <Alert color="danger">{this.state.error}</Alert>
        ) : 
          null
        }
        <br/><br/>
        <div className="d-flex justify-content-center h-100">
          <div className="card loginCard">
            <div className="card-header">
              <br/><h3>Sign up & Play!</h3>
            </div>
            <div className="card-body">
              <form>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fas fa-user-plus"></i></span>
                  </div>
                  <input id= "username" type="text" autoComplete="username" className="form-control" placeholder="username" onChange = {this.onChange.bind(this)}/>
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fas fa-key"></i></span>
                  </div>
                  <input id="password" type="password" autoComplete="current-password" className="form-control" placeholder="password, at least 6 digits"  min-length="6" required onChange = {this.onChange.bind(this)}/>
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fas fa-key"></i></span>
                  </div>
                  <input id="password2" type="password" autoComplete="current-password" className="form-control" placeholder="confirm password"  min-length="6" required onChange = {this.onChange.bind(this)}/>
                </div>
                <div className="card-footer">
                  <div className="form-group">
                    <button className="btn float-right login_btn" id="register" onClick={this.onSubmit.bind(this)}>Register</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  history: PropTypes.object.isRequired
};

export default withTracker(() => {
  return {
    user: Meteor.user()
  };
})(withRouter(Register));