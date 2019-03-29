import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import Game from "./Game.jsx";
import NavBar from "./NavBar.jsx";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {
	render() {
		return (
			<div>
			<NavBar />
			<Game />
			</div>
		)
	}
}

export default withTracker(() => {
  return {
    user: Meteor.user(),
  };
})(App);
