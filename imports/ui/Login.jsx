import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";


class Login extends Component {
  constructor(props) {
    super(props);

    this.name = "";
    this.password = "";
    this.onSubmit = this.onSubmit.bind(this);

  }

  onSubmit(e){
    e.preventDefault();
    Meteor.loginWithPassword(this.name.value, this.password.value, function(error) {
      if (error) {
        console.log(error);
      } else {
        console.log(Meteor.user());
      }
    });

  }

  render() {
    if (Meteor.user()) return <Redirect to="/dashboard" user={Meteor.user()}/>;
    return (
      <div className="container">
        <div className="row">
          <div className="sizebox col-lg-10 col-xl-9 mx-auto">
            <h1>Login to Dixit</h1>
            <div className="card card-signin flex-row my-5">
              <div className="card-body">
                <p className="grey-text text-darken-1">
                  Don't have an account? <Link to="/register">Register</Link>
                </p>
                <form
                  className="form-signin"
                  noValidate
                  onSubmit={this.onSubmit}
                >
                  <div className="form-label-group">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      ref={input => (this.name = input)}
                    />
                  </div>
                  <div className="form-label-group">
                    <label htmlFor="password">Password</label>

                    <input
                      id="password"
                      type="password"
                      ref={input => (this.password = input)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-dark btn-xl"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    user: Meteor.user()
  };
})(Login);