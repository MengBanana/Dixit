import React, { Component , Fragment} from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { UsersGames } from "../api/usersGames.js";
import MyGame from "./MyGame.jsx";
import NavBar from "./NavBar.jsx";
import GameRoom from "./GameRoom.jsx";
import HomePage from "./HomePage.jsx";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    
  }
  //NOT WORKING <Route exact path="/" component={HomePage} />
  //               {this.props.myGame[0].ingame ? <Route exact path="/GameRoom" component={MyGame} /> :
  //                 <Route exact path="/GameRoom" component= {GameRoom} />};
  render() {

    return (
      <Router>
        <NavBar />
        <div className = "container">
          <div className = "row">
            <div className = "col-12">
              <Switch>
                <Route exact path="/HomePage" component={HomePage} />
                <Fragment>
                  {this.props.myGame.length === 0 ? <Route exact path="/GameRoom" component= {GameRoom} /> : null}
                  {this.props.myGame.map(game => (
                    <div key = {game._id}>
                      {game.ingame ? <Route exact path="/GameRoom" component={MyGame} /> :
                        <Route exact path="/GameRoom" component= {GameRoom} />}</div>
                  ))}
                </Fragment>
                <Route exact path="/MyGame" component={MyGame} />
                <Route exact path="/GameRoom" component={GameRoom} />

              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  myGame: PropTypes.arrayOf(PropTypes.object).isRequired,
  ready: PropTypes.bool.isRequired
};

export default withTracker(() => {
  const handle = Meteor.subscribe("myGame");
  return {
    user: Meteor.user(),
    myGame: UsersGames.find({}).fetch(),
    ready: handle.ready()
  };
})(App);
