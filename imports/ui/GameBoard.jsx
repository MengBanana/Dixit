import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Games } from "../api/games.js";
import { UsersGames } from "../api/cards.js";
import { Cards } from "../api/usersGames.js";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";


export class GameBoard extends Component {
	constructor(props) {
    	super(props);
	}
	
	render() {
		return (
			<div></div>
		);
	}
}

GameBoard.propTypes = {
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
  usersGames: PropTypes.arrayOf(PropTypes.object).isRequired,
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  ready: PropTypes.bool.isRequired
};

export default withTracker(() => {
  const handle = Meteor.subscribe("games");
  const handle2 = Meteor.subscribe("usersGames");
  const handle3 = Meteor.subscribe("cards");
  
  return {
    games: Games.find({}).fetch(), 
    usersGames: UsersGames.find({}).fetch(),
    cards: Cards.find({}).fetch(),
    user: Meteor.user(),
    ready : handle.ready() && handle2.ready() && handle3.ready();
  };
})(GameBoard);

