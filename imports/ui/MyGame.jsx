import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Games } from "../api/games.js";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";


class MyGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameName : "",
      stage:0,
      count:0,
      clicked: false,
      targetCard:null,//{card, userId}
      description:"",

      players:[],
      hostIdx:0,
      playerIdx:0,

      
      winners:[],//people who guess right
      points: 0,

      cardsOnDesk:[],//[{card, userId},...]
      cards:[]//all cards
    };     
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  ComponentDidMount() {
    this.props.myGame.map(game=>{
      this.setState({
        gameName: game.name,
        stage:game.stage,
        count:game.count,
        targetCard:game.targetCard,
        description:game.description,
        hostIdx:game.hostIdx,
        players:game.players,
        Winners:game.winners,
        cardsOnDesk:game.cardsOnDesk,
        cards:game.cards
      });
    });
  }

  onChange(e){
    this.setState(
      {
        [e.target.id]: e.target.value
      }
    );
  }

  onSubmit(e) {

    if (e.target.id === "exitGame") {//update user status, remove player from game, can exit only on stage 0(before game started)
      Meteor.call("usersGames.exit",this.state.points, (err, res) => {
        if (err) {
          alert("There was error updating check the console");
          console.log(err);
        }
        console.log("succeed",res);
      });
      Meteor.call("games.removePlayer", this.state.gameName, (err, res) => {
        if (err) {
          alert("There was error updating check the console");
          console.log(err);
        }
        console.log("succeed",res);
      });
    }


    if (e.target.id === "readyToStart") {
      if (this.state.clicked) {
        return;
      }

      let ct = this.state.count + 1;
      this.setState({
        count:ct,
        clicked: true
      });
      if (this.state.count == this.state.players.length) {
        this.stage = 1;
      }
      //update db
    }

    if (e.target.id === "descriptionDone") {
      //stage++(= 2)
      //count to 0
      //update db 
      
    }

    if (e.target.id === "pickCard") {
      //add card to pool
      //count++
      //if ct == players.length-1 
      //stage++
      //count = 0
      //update db
    }


    if (e.target.id === "voteCard") {
      //add card to pool
      //count++
      //if ct == players.length-1 
      //stage++
      //count = 0
      //update db
    }

    //function: compute points, display result, stage = 0, idx++, reset all {count = 0, idx++,.....}


    if (e.target.id === "exitGame") {
      Meteor.call("games.removePlayer", this.state.gameName, (err, res) => {
        if (err) {
          alert("There was error updating check the console");
          console.log(err);
        }
        console.log("succeed",res);
      });
      Meteor.call("usersGames.exit",this.state.points,(err, res) => {
        if (err) {
          alert("There was error updating check the console");
          console.log(err);
        }
        console.log("succeed",res);
      });
     
    }
  }

  // WORKED!!!  <div className="row">
  //   {this.props.myGame.map(game  => (
  //     <div key = {game._id}>{game.ingame ? "yes":"no"}</div>
  //   ))}
  // </div>
 

  // ALWAYS NO <div className="row">
  // {this.props.myGame.ingame ? "yes":"no"}
  // </div>
  
  render() {

    const stage0 = (
      <div className="container"id="HomePage" >
        <div className = "row">
          {this.props.myGame.length}
          {this.state.gameName}
          <p>Stage0, game created, click start game, wait for enough players</p>
          <button type="button" className="btn btn-outline-dark" id = "readyToStart" onClick = {this.onSubmit.bind(this)}>Ready!</button>
          {this.stage === 0 ? <button type="button" className="btn btn-outline-dark" id = "exitGame" onClick = {this.onSubmit.bind(this)}>Ready!</button> :null}
        </div>
      </div>
    );
    const stage1 = (
      <div className="container"id="HomePage" >
        <div className = "row">
          <p>Stage1, each players get # of cards, host pick card and write description and submit, others wait</p><br/>
          <input type="text" className="form-control" id="description" placeholder="Enter description" onChange= {this.onChange.bind(this)}/>
          <button type="button" className="btn btn-outline-dark" id = "descriptionDone" onClick = {this.onSubmit.bind(this)}>Submit-stage1</button>
        </div>
      </div>
    );
    const stage2 = (
      <div className="container"id="HomePage" >
        <div className = "row">
          <p>Stage2, description displayed, host wait, others pick one card and submit</p>
          Card:{this.state.selected}
          Description: {this.state.description}
          <button type="button" className="btn btn-outline-dark" id = "pickCard" onClick = {this.onSubmit.bind(this)}>Submit-stage2</button>

        </div>
      </div>
    );
    const stage3 = (
      <div className="container"id="HomePage" >
        <div className = "row">
          <p>Stage3, display # cards, host wait, others vote for card and submit</p>
          <button type="button" className="btn btn-outline-dark" id = "voteCard" onClick = {this.onSubmit.bind(this)}>Submit-stage3</button>
        </div>
      </div>
    );
    const stage4 = (
      <div className="container"id="HomePage" >
        <div className = "row">
          <p>Stage4, compute points and end game, remove game from db</p>
          <p>function: compute points
          DISPLAY RESULT</p>
        </div>
      </div>
    );
   
    return (
      <div>
        { 
          !this.props.ready ?<div>Rendering</div>:
        
        <div className="row">
          {stage0}
          {stage1}
          {stage2}
          {stage3}
          {stage4}
        </div>
      }
      </div>
    );
  }
}

MyGame.propTypes = {
  myGame: PropTypes.arrayOf(PropTypes.object).isRequired,
  ready: PropTypes.bool.isRequired
};

export default withTracker(() => {
  const handle = Meteor.subscribe("myGame");
  return {
    myGame: Games.find({ "name": "wow" }).fetch(),
    user: Meteor.user(),
    ready : handle.ready()
  };
})(MyGame);
