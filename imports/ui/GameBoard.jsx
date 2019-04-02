import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Games } from "../api/games.js";
import { UsersGames } from "../api/usersGames.js";
import { Cards } from "../api/cards.js";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { random } from "../utils/random";


export class GameBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameName: "",
      description : "",
      finalDescription : "",
      newUrl: "",
      distributedCards: random(this.props.cards, 4),
      players: [],
      stage:0
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  getGame(){
    this.props.myGame.map(game =>{
      this.setState({
        gameName: game.name
      });
    });
  }
    // distribute 6 cards to each player and save into db
    /*let players = Games.findOne({"name": this.state.gameName }).players;*/

/*  onChange(e){
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
    );
  }*/


  onChange(e) {
    this.setState(
      {
        [e.target.id]: e.target.value
      }
    );
  }

  onSubmit() {
    let url= this.state.newUrl;
    Meteor.call("cards.insert",url, (err, res) => {
      if (err) {
        alert("There was error updating check the console");
        console.log(err);
      }
      console.log("succeed",res);
    });
    this.setState({
      newUrl:""
    });
  }

/*  getCardsInHand(username) {
    return Games.findOne({"cardsInHand.username": username});
  }*/

  getGame() {
      return Games.findOne({"name": this.state.gameName });
  }

  render() {
    // let players = Games.findOne({"name": this.state.gameName }).players;
    // let numberOfPlayers = this.getGame().numberOfPlayers;
    console.log(this.state.gameName);
    let players = ["meng", "ines"];
    let numberOfPlayers = 6;
    let cardsInPool = [];
    for (let i=0; i<numberOfPlayers; i++) {
      cardsInPool.push(0);
    }
    let i=0;
    return (
      <div className="container">
        <div className="row">
          <div className="col-10" id="gameBoard">
            <h2 className="row"> Pool </h2>
            <div className="row" id="cardPool">
              {cardsInPool.map(cardInPool => (
                <div key={i++} className="card col-xs-4 col-s-3">
                  <div className = "container">
                    <div className ="container img-box"><img src="" className="card-img-top img-rounded"/></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="row" id="displayDescrition">
              {this.state.finalDescription}
            </div>
            <div className="row" id="textbox">
              <form>
                <div className="form-group">
                  <label htmlFor="description">Enter Your Description</label>
                  <input type="" className="form-control" id="description" aria-describedby="description" value={this.state.description} onChange={this.onChange}></input>
                  <small id="detail" className="form-text text-muted">Don't describe too many details</small>
                </div>
                <button type="submit" className="btn btn-warning" onClick={this.onSubmit}>Submit</button>
              </form>
            </div>
            <h2 className="row"> Cards In Hand </h2>
            <div className="row" id="cardsInHand">
              {cardsInPool.map(cardInPool => (
                <div key={i++} className="card col-xs-4 col-s-3">
                  <div className = "container">
                    <div className ="container img-box"><img className="card-img-top img-rounded"/></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-2 ml-auto" id="scoreBoard">
            {players.map(player => (<div key={i++} className="row">{player}:score</div>))}
          </div>

          <div className="container">
            <div className="row">
              <div id="magic-button">
                <br/>
                <button type="button" className= "btn btn-danger my-2 my-sm-0 " data-toggle="modal" data-target="#myModal">Add Card</button>
              </div>
              <div id="myModal" className="modal fade" role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Enter card info</h4>
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                      <form id="newItemForm">
                        <div className = "form-group">
                          <label>Image Url</label>
                          <input type="text" className="form-control" id="newUrl" onChange= {this.onChange.bind(this)}/>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer d-flex justify-content-center">
                      <button className="btn btn-danger" data-dismiss="modal" onClick={this.onSubmit}>Add It</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
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

