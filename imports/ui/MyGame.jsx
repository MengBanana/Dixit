import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Games } from "../api/games.js";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { UsersGames } from "../api/usersGames.js";
import { Cards } from "../api/cards.js";

class MyGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //fixed in the whole game
      gameName: "",
      playerIdx: -1,

      //round-level changes
      points: 0, //once at the end
      hostIdx: 0, //once at the start
      hostDescription: "",
      cardsOnDesk: [],

      //if user is host
      description: "",
      //host's picked card, other's picked and voted card
      selectedCard: null, //OBJECT

      //stage-level changes
      stage: 0,
      cardsOnHand: [],
      players: [],
      winners:[],//people who guess right
      isHost: false,
      newUrl: "",
      buttonClick: 0,
      cardsPool: [],
      isOver: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.myGame != prevProps.myGame) {
      this.updateGame();
    }
    if (this.props.usersGames != prevProps.usersGames) {
      this.updatePoint();
    }
  }

  getPlayerIndex() {
    Meteor.call(
      "games.getPlayerIndex",
      this.props.myGame[0].name,
      (err, res) => {
        if (err) {
          alert("There was error updating check the console");
          console.log(err);
        }
        let isHost = res === this.state.hostIdx;
        this.setState({
          playerIdx: res,
          cardsOnHand: this.state.cardsPool[res],
          isHost: isHost
        });
      }
    );
  }

  updateGame() {
    this.props.myGame.map(game => {
      this.setState({
        gameName: game.name,
        stage: game.stage,
        hostIdx: game.hostIdx, //get hostName
        hostDescription: game.description,
        cardsOnDesk: game.cardsOnDesk,
        winners: game.winners,
        cardsPool: game.cardsOnHand,
        players: game.players,
        isOver:game.isOver
        //players, points
      });
      this.getPlayerIndex();
    });
  }

  updatePoint() {
    this.props.usersGames.map(userGame => {
      this.setState({
        point: userGame.totalPoints
      });
    });
  }

  onChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  onSubmit(e) {
    this.setState({
      buttonClick: 1
    });
    if (e.target.id === "readyToStart") {
      if (this.state.stage === 0) {
        Meteor.call("games.updateReady", this.state.gameName, (err, res) => {
          if (err) {
            alert("There was error updating check the console");
            console.log(err);
          } else {
            console.log("succeed", res);
          }
        });
      }
      if (this.state.stage === 4) {
        Meteor.call("games.nextHost", this.state.gameName, (err, res) => {
          if (err) {
            alert("There was error updating check the console");
            console.log(err);
          } else {
            console.log("succeed", res);
          }
        });
      }
    }

    if (e.target.id === "descriptionDone") {
      if (this.state.selectedCard != null && this.state.description != "") {
        let info = {
          game: this.state.gameName,
          card: this.state.selectedCard,
          description: this.state.description,
          playerIdx: this.state.playerIdx
        };
        Meteor.call("games.updateAnswer", info, (err, res) => {
          //TODO: db test
          if (err) {
            alert("There was error updating check the console");
            console.log(err);
          } else {
            console.log("succeed", res);
          }
        });
        Meteor.call("games.addCardToDesk", info, (err, res) => {
          //TODO: db test
          if (err) {
            alert("There was error updating check the console");
            console.log(err);
          } else {
            console.log("succeed", res);
          }
        });
        this.setState({
          selectedCard: null,
          description: ""
        });
      }
    }

    if (e.target.id === "pickCard") {
      if (this.state.selectedCard != null) {
        let info = {
          game: this.state.gameName,
          card: this.state.selectedCard,
          playerIdx:this.state.playerIdx
        };
        Meteor.call("games.addCardToDesk", info, (err, res) => {
          //TODO: db test
          if (err) {
            alert("There was error updating check the console");
            console.log(err);
          } else {
            console.log("succeed", res);
          }
        });
        this.setState({
          selectedCard: null
        });
      }
    }

    if (e.target.id === "voteCard") {
      if (this.state.selectedCard != null) {
        let info = {
          game: this.state.gameName,
          card: this.state.selectedCard
        };
        Meteor.call("games.updateWinners", info, (err, res) => {
          //TODO: db test,combine with players, update winners
          if (err) {
            alert("There was error updating check the console");
            console.log(err);
          } else {
            console.log("succeed", res);
          }
        });
        this.setState({
          selectedCard: null
        });
      }
    }

    if (e.target.id === "exitGame") {//update user status, remove player from game, can exit only on stage 0 or 4?(before game starts
      Meteor.call("usersGames.exit", (err, res) => {
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
      //function: compute points, display result, stage = 0, idx++, reset all {count = 0, idx++,.....}
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
    // console.log("TEST: props.myGame.length:", this.props.myGame.length);
    // console.log("TEST: state.gameName: ", this.state.gameName);
    // console.log("TEST: state.stage: ", this.state.stage);
    // console.log("TEST: state.playerIdx: ", this.state.playerIdx);
    // console.log("TEST: state.hostIdx: ", this.state.hostIdx);
    // console.log("TEST: state.points: ", this.state.points);
    console.log("TEST: state.description: ", this.state.description);
    // console.log("TEST: state.hostDescription: ", this.state.hostDescription);
    console.log("TEST: state.selectedCard: ", this.state.selectedCard);
    let i = 0;
    // const stage0 = (
    //   <div className="container"id="HomePage" >
    //     <div className = "row">
    //       <p>Stage0, game created, click start game, wait for enough players</p>
    //       {this.state.buttonClick === 0?
    //         <button type="button" className="btn btn-outline-dark" id = "readyToStart" onClick = {this.onSubmit.bind(this)}>Ready!</button>
    //         :
    //         null
    //       }
    //     </div>
    //   </div>
    // );
    // const stage1 = (
    //   <div className="container"id="HomePage" >
    //     <div className = "row">
    //       <p>Stage1, each players get # of cards, host pick card and write description and submit, others wait</p><br/>
    //       <input type="text" className="form-control" id="description" placeholder="Enter description" onChange= {this.onChange.bind(this)}/>
    //       <button type="button" className="btn btn-outline-dark" id = "descriptionDone" onClick = {this.onSubmit.bind(this)}>Submit-stage1</button>
    //     </div>
    //   </div>
    // );
    // const stage2 = (
    //   <div className="container"id="HomePage" >
    //     <div className = "row">
    //       <p>Stage2, description displayed, host wait, others pick one card and submit</p>
    //       Card:{}
    //       Description: {}
    //       

    //     </div>
    //   </div>
    // );
    // const stage3 = (
    //   <div className="container"id="HomePage" >
    //     <div className = "row">
    //       <p>Stage3, display # cards, host wait, others vote for card and submit</p>
    //       
    //     </div>
    //   </div>
    // );
    // const stage4 = (
    //   <div className="container"id="HomePage" >
    //     <div className = "row">
    //       <p>Stage4, compute points and end game, remove game from db</p>
    //       <p>function: compute points
    //       DISPLAY RESULT</p>
    //     </div>
    //   </div>
    // );

    return (
      <div className="container">
        <div className="row">
          <div className="col-2" id="scoreBoard">
            <h2 className="row part"> GameRoom </h2>
            <p> GAME: {this.state.gameName}</p>
            <p> ROUND: {this.state.hostIdx + 1}</p>
            <p> STORY TELLER: {this.state.players[this.state.hostIdx]}</p>
            <h2 className="row part"> ScoreBoard </h2>
            {this.state.players.map(player => (
              <h6 key={player}>{player}:{this.state.points}</h6>
            ))}
          </div>

          <div className="col-10" id="gameBoard">
            <div className="part">
              {this.state.stage > 1 ?
                <div><h4 id="displayDescrition">
                  Story teller description: "{this.state.hostDescription}"
                </h4></div> : <div><h4 id="displayDescrition" style={{"color":"white"}}>
                  Story teller description: "{this.state.hostDescription}"
                </h4></div>
              }
              <h2 className="row"> Pool </h2>

              {this.state.stage === 0 ? <div className="row">
                <span id="badge" className="badge badge-warning m-2">
                  Click the Ready Button to start the game!
                </span>
              </div> 
                : 
                <div>
                  {this.state.cardsOnDesk.length === this.state.players.length? 
                    (<div className="row">
                      {this.state.cardsOnDesk.map(cardOnDesk => (
                        <div key={cardOnDesk._id}><div
                          className="card col-xs-4 col-s-3"
                          style={{
                            backgroundImage: `url(${cardOnDesk.url})`,
                            backgroundSize: "cover"
                          }}
                        />
                        {this.state.stage === 3 && !this.state.isHost? 
                          <div>
                            <button onClick={() =>this.setState({ selectedCard: cardOnDesk })}></button>
                          </div>
                          : 
                          null
                        }
                        {this.state.stage === 4 ?
                          <div>
                            {this.state.winners.map(winner => {
                              <div key = {i++}>
                                winner
                              </div>;
                            })}
                          </div> : null
                        }
                        </div>
                      ))}
                    </div>)
                    : 
                    <div>{(this.state.stage === 1 && this.state.cardsOnDesk.length === 0) ? 
                      (<div className="row">
                        <span id="badge" className="badge badge-warning m-2">
                          Waiting for {this.state.players[this.state.hostIdx]} to pick a card and describe...
                        </span>
                      </div>)
                      : 
                      (<div className="row">
                        {!this.state.stage === 4 ?
                          <span id="badge" className="badge badge-warning m-2">
                          Waiting for { this.state.players.length - this.state.cardsOnDesk.length} players to pick a card!
                          </span> : null}
                      </div>       
                      )
                    }</div>
                  }</div>}
              <div className = "row part">
                <div className = "col-4">
                  <h2 className="row"> Cards In Hand </h2>
                  <h6 className="row">TODO: NOW DO WHAT?</h6>
                </div>
                
                <div className = "col-3">
                  {(this.state.stage !== 1 ? null :
                    <div>
                      {!this.state.isHost ? null : (
                        <div className="row" id="textbox">
                          <form>
                            <div className="form-group">
                              <input
                                type=""
                                className="form-control"
                                id="description"
                                aria-describedby="description"
                                value={this.state.description}
                                onChange={this.onChange}
                                placeholder="Enter Your Description..."
                              />
                              <small id="detail" className="form-text text-muted">
                                Tips: not too much, not too little
                              </small>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className = "col-3">
                  {this.state.stage === 0 ? (<button type="button" className="btn btn-outline-dark" id = "readyToStart" onClick = {this.onSubmit.bind(this)}>Ready!</button>):
                    <div className="row" id="chooseCard">
                      {(this.state.isHost && this.state.stage === 1) || (!this.state.isHost && this.state.stage > 1 && this.state.stage < 4)? <div> 
                        <span> You've chosen: 
                          {this.state.selectedCard === null ? null : (
                            <span
                              className="card col-xs-4 col-s-3"
                              style={{
                                backgroundImage: `url(${this.state.selectedCard.url})`,
                                backgroundSize: "cover"
                              }}
                            />
                          )}</span></div> :null}
                    </div>}
                </div>
                <div className = "col-2">
                  {this.state.stage === 0 || this.state.isOver ?
                    <div><button type="button" className="btn btn-outline-dark" id = "exitGame" onClick = {this.onSubmit}>Exit</button></div>
                    : null}
                  {(this.state.stage === 4 && this.state.hostIdx < this.state.players.length - 1) ?
                    <div><button type="button" className="btn btn-outline-dark" id = "readyToStart" onClick = {this.onSubmit}>Continue</button></div>
                    : null}

                  {this.state.isHost ? <div>{this.state.stage === 1 ? 
                    <div>
                      <button
                        type="submit"
                        className="btn btn-warning"
                        id="descriptionDone"
                        onClick={this.onSubmit}
                      >
                      Submit
                      </button></div>:null}</div>:null}
                  {!this.state.isHost ? <div>{this.state.stage === 2 ? 
                    <div><button type="button" className="btn btn-outline-dark" id = "pickCard" onClick = {this.onSubmit}>Submit-stage2</button></div>
                    :
                    <div>{this.state.stage === 3 ? 
                      <div><button type="button" className="btn btn-outline-dark" id = "voteCard" onClick = {this.onSubmit}>Submit-stage3</button></div>
                      :
                      null}
                    </div>}
                  </div>:null}
                </div>
              </div>
              {!this.state.cardsOnHand || this.state.cardsOnHand.length === 0 ? null 
                : (
                  <div className="row" id="cardsInHand">
                    {this.state.cardsOnHand.map(cardOnHand => (
                      <div
                        key={cardOnHand._id}
                        className="card col-xs-4 col-s-3"
                        onClick={() =>
                          this.setState({ selectedCard: cardOnHand })
                        }
                        style={{
                          backgroundImage: `url(${cardOnHand.url})`,
                          backgroundSize: "cover"
                        }}
                      />
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MyGame.propTypes = {
  myGame: PropTypes.arrayOf(PropTypes.object).isRequired,
  usersGames: PropTypes.arrayOf(PropTypes.object).isRequired,
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  ready: PropTypes.bool.isRequired
};

export default withTracker(() => {
  const handle = Meteor.subscribe("myGame");
  const handle2 = Meteor.subscribe("usersGames");
  const handle3 = Meteor.subscribe("cards");
  return {
    user: Meteor.user(),
    ready: handle.ready() || handle2.ready() || handle3.ready(),
    myGame: Games.find({}).fetch(),
    usersGames: UsersGames.find({}).fetch(),
    cards: Cards.find({}).fetch()
  };
})(MyGame);