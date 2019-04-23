import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { Alert } from "reactstrap";


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      username : "",
      password : "",
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

  onSubmit(e){
    e.preventDefault();
    if (e.target.id == "login") {
      //let username = this.state.username.trim();
      //let password = this.state.password.trim();
      Meteor.loginWithPassword({username: this.state.username}, this.state.password, function(error) {
        if (error) {
          console.log(error);
          this.setState({ error: "Incorrect login" });
        } else {
          console.log(Meteor.user());
          //this.props.history.push("/");
        }
      });
    }

    if (e.target.id =="twitterSignIn") {
      Meteor.loginWithTwitter({

      },(err) => {
        if (err) {
        console.log(err);
        } else {
        console.log("login successful");// successful login!
        }
      });
    }
  }
  render() {
    if (Meteor.user()) return <Redirect to="/gameroom" user={Meteor.user()}/>;
    console.log("username",this.state.username);
    console.log("password",this.state.password);
    console.log("error",this.state.error);
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
              <br/><h3>Sign In</h3>
            </div>
            <div className="card-body">
              <form>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                  </div>
                  <input id= "username" type="text" autoComplete="username" className="form-control" placeholder="username" onChange = {this.onChange.bind(this)}/>
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fas fa-key"></i></span>
                  </div>
                  <input id="password" type="password" autoComplete="current-password" className="form-control" placeholder="password" required onChange = {this.onChange.bind(this)}/>
                </div>
                <div className="form-group">
                  <button className="btn float-right login_btn" id="login" onClick={this.onSubmit.bind(this)} >Login</button>
                </div>
              </form>
            </div>
            <div className="card-footer">
              <div className="justify-content-center row">
                <div className = "col-6"> <button className="btn btn-primary btn-inline-block twitterLogin" type="button" onClick={this.onSubmit.bind(this)} id= "twitterSignIn" ><i className="fab social_icon fa-twitter"></i> Sign in</button></div>
                <div className = "col-6">  <Link to="/register" className="links"><button className="btn btn-danger btn-inline-block newSignup links" type="button"><i className="fas fa-user-plus"></i> Sign up</button></Link></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.object.isRequired
};

export default withTracker(() => {
  return {
    user: Meteor.user()
  };
})(withRouter(Login));