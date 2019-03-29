import React, { Component } from "react";
import Game from "./Game.jsx";
import NavBar from "./NavBar.jsx"

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

export default App;
