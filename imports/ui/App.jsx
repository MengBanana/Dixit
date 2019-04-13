import React, { Component , Fragment} from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { UsersGames } from "../api/usersGames.js";
import MyGame from "./MyGame.jsx";

import About from "./About.jsx";
import NavBar from "./NavBar.jsx";
import GameRoom from "./GameRoom.jsx";
import HomePage from "./HomePage.jsx";
import AddCard from "./AddCard.jsx";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import Footer from "./Footer.jsx";


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
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/AddCard" component={AddCard} />
                 <Route exact path="/About" component={About} />
                <Fragment>
                  {/* You can Do something : <Route exact path="/gameroom" component= { this.props.myData.length === 0 ? GameRoom : this.props.myData[0].ingame ? MyGame : GameRoom} /> */}
                  {this.props.myData.length === 0 ? <Route exact path="/gameroom" component= {GameRoom} /> : <div>
                    {this.props.myData[0].ingame ? <Route exact path="/gameroom" component={MyGame} /> :
                      <Route exact path="/gameroom" component= {GameRoom} />}</div>
                  }
                </Fragment>

              </Switch>
            </div>
        <Footer />
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
