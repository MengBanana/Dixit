import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Accounts } from "meteor/accounts-base";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";

class Register extends Component {
  constructor(props) {
    super(props);

    this.name = "";
    this.password = "";
    this.password2 = "";
    this.avatar = "";
    this.charname = "";
    this.role = "";
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit (e) {
    e.preventDefault();

    // check password is valid
    if (this.password.value === this.password2.value) {

      // set the user avatar
      let avatarURL = "https://api.adorable.io/avatars/285/" + this.name.value;

      let userData = {
        username: this.name.value,
        email: this.email.value,
        password: this.password.value,
        profile: {
          avatar: avatarURL
        }
      };
      Accounts.createUser(userData, function(error) {
        if (Meteor.user()) {
          console.log(Meteor.userId());
          // redirect to dashboard
        } else {
          console.log("err: " + error.reason);
        }
      });
    } else {
      console.log("password doesn't match");
    }

  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="sizebox col-lg-10 col-xl-9 mx-auto">
            <h1>Reigster for Dixit</h1>
            <div className="card card-signin flex-row my-5">
              <div className="card-img-left d-none d-md-flex col-6" />
              <div className="card-body">
                <p>
                  Already have an account? <Link to="/login">Log in</Link>
                </p>
                <form
                  className="form-signin"
                  noValidate
                  onSubmit={this.onSubmit}
                >
                  <label><b>User Information</b></label>
                  <div className="form-label-group">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      ref={input => (this.name = input)}
                    />
                  </div>

                  <div className="form-label-group">
                    <label htmlFor="email">Email</label>

                    <input
                      id="email"
                      type="email"
                      ref={input => (this.email = input)}
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

                  <div className="form-label-group">
                    <label htmlFor="password2">Confirm Password</label>

                    <input
                      id="password2"
                      type="password"
                      ref={input => (this.password2 = input)}
                    />
                  </div>

                  <label><b>Character Basics</b></label>
                  <div className="form-label-group">
                    <label htmlFor="charname">Character Name</label>
                    <input
                      id="charname"
                      type="text"
                      ref={input => (this.charname = input)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-dark btn-xl"
                  >
                    Sign up
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
})(Register);