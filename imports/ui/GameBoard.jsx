import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Games } from "../api/games.js";
import { UsersGames } from "../api/usersGames.js";
import { Cards } from "../api/cards.js";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";


export class GameBoard extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		// gameName : this.props.match.params.gameName,
    		gameName: "wow",
    		description : "",
    		finalDescription : ""
    	};
    	this.onChange = this.onChange.bind(this);
    	this.onSubmit = this.onSubmit.bind(this);
    	this.getPlayers = this.getPlayers.bind(this);
	}

	onChange(e){
	    this.setState(
	      {
	        [e.target.id]: e.target.value
	      }
	    );
  }

  	onSubmit() {
  		this.setState(
  		{
  			finalDescription : this.state.description
  		}
  		)
  	}

  	getPlayers() {
  		return Games.findOne({"gameName": this.state.gameName}).players;
  	}

	render() {
		let players = this.state.getPlayers();
		return (
			<div className="container">
				<div className="col-9" id="gameBoard">
					<div className="container" id="cardPool">

					</div>
					<div className="row" id="displayDescrition">
					{this.state.finalDescription}
					</div>
					<div className="row" id="textbox">
						<form>
						  <div className="form-group">
						    <label for="description">Enter Your Description</label>
						    <input type="" className="form-control" id="description" aria-describedby="description" value={this.state.description} onChange={this.onChange}></input>
						    <small id="detail" className="form-text text-muted">Don't describe too many details</small>
						  </div>
						  <button type="submit" className="btn btn-warning" onClick={this.onSubmit}>Submit</button>
						</form>
					</div>
					<div classNmae="container" id="userHand">
					</div>
				</div>
				<div className="col-3" id="scoreBoard">
				{players.map(player => (<span>player:{player}</span>))}
				</div>
				
			</div>
		);
	}
}

GameBoard.propTypes = {
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
  usersGames: PropTypes.arrayOf(PropTypes.object).isRequired,
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  ready: PropTypes.bool.isRequired,
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
    ready : handle.ready() && handle2.ready() && handle3.ready(),
  };
})(GameBoard);

