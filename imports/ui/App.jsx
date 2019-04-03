import React, { Component , Fragment} from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { UsersGames } from "../api/usersGames.js";
import MyGame from "./MyGame.jsx";
import NavBar from "./NavBar.jsx";
import GameRoom from "./GameRoom.jsx";
import HomePage from "./HomePage.jsx";
import GameBoard from "./GameBoard.jsx";
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
  // {this.props.myGame.map(game => (<div key = {game._id}>
  //                     {game.ingame === ? <Route exact path="/GameRoom" component={MyGame} /> :
  //                       <Route exact path="/GameRoom" component= {GameRoom} />}</div>))}
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
                  {this.props.myData.length === 0 ? <Route exact path="/gameroom" component= {GameRoom} /> : <div>
                        {this.props.myData[0].ingame ? <Route exact path="/gameroom" component={MyGame} /> :
                          <Route exact path="/gameroom" component= {GameRoom} />}</div>
                  }
                </Fragment>
                <Route exact path="/GameBoard" component={GameBoard} />

              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  myData: PropTypes.arrayOf(PropTypes.object).isRequired,
  ready: PropTypes.bool.isRequired
};

export default withTracker(() => {
  const handle = Meteor.subscribe("myData");
  return {
    user: Meteor.user(),
    myData: UsersGames.find({}).fetch(),
    ready: handle.ready()
  };
})(App);
