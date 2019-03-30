import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import Game from "./Game.jsx";
import NavBar from "./NavBar.jsx";
import GameRoom from "./GameRoom.jsx";
import HomePage from "./HomePage.jsx";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <NavBar />
        <div className = "container">
          <div className = "row">
            <div className = "col-12">
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/GameRoom" component={GameRoom} />
                <Route exact path="/game" component={Game} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default withTracker(() => {
  return {
    user: Meteor.user(),
  };
})(App);
