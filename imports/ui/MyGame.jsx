import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Games } from "../api/games.js";
import { UsersGames } from "../api/usersGames.js";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";


class MyGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
    //WORKED!!!  <div className="row">
        //   {this.props.myGame.map(game  => (
        //     <div key = {game._id}>{game.ingame ? "yes":"no"}</div>
        //   ))}
        // </div>

        // ALWAYS NO <div className="row">
          // {this.props.myGame.ingame ? "yes":"no"}
        // </div>
  }
  render() {

    return (
      <div>
        <div className="row">
         
        </div>
      </div>
    );
  }
}
MyGame.propTypes = {
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
  myGame: PropTypes.arrayOf(PropTypes.object).isRequired,
  ready: PropTypes.bool.isRequired
};

export default withTracker(() => {
  const handle = Meteor.subscribe("games");
  const handle2 = Meteor.subscribe("myGame");
  return {
    games: Games.find({}).fetch(), 
    myGame: UsersGames.find({}).fetch(),
    user: Meteor.user(),
    ready : handle.ready() && handle2.ready()
  };
})(MyGame);
