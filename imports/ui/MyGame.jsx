import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Games } from "../api/games.js";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { UsersGames } from "../api/usersGames.js";
import { Cards } from "../api/cards.js";
import {NavBar} from "./NavBar.jsx";

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
      isOver: false,
      readyCount: 0,
      pickCount:0,
      voteCount:0,
      timeId: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.autoSelect = this.autoSelect.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.myGame != prevProps.myGame) {
      this.updateGame();
      let cur = null;
      let prev = null;
      let host = null;
      this.props.myGame.map(game => (cur=game.stage));
      this.props.myGame.map(game => (host=game.hostIdx));
      prevProps.myGame.map(game => (prev=game.stage));
      if ((cur === 1 && this.state.playerIdx !== host)) {
        return;
      }
      if ((cur === 2 || cur === 3) && this.state.playerIdx === host) {
        return;
      }
      if (cur != prev && this.state.timeId === "") {
        let timeId = setTimeout(this.autoSelect, 10000);
        this.setState({
          timeId:timeId
        });
      }
    }

    if (this.props.gameData != prevProps.gameData) {
      this.updatePoint();
    }

  }

  eventFire(el, etype){
    if (el.fireEvent) {
      el.fireEvent("on" + etype);
      console.log("clicked");
    } else {
      var evObj = document.createEvent("Events");
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }

  autoSelect() {
    if (this.state.stage === 1) {
      // alert("Timeout! System has selected a card and description for you!");
      this.setState({
        description : "Story Teller fell asleep, try your best to guess!",
        selectedCard:this.state.cardsOnHand[0],
        timeId:""
      });
      let describe = document.getElementById("descriptionDone");
      describe.click();
    }
    if (this.state.stage === 2) {
      // alert("Timeout! System has selected a card for you!");
      this.setState({
        selectedCard:this.state.cardsOnHand[0],
        timeId:""
      });
      let pick = document.getElementById("pickCard");
      pick.click();
    }
    if (this.state.stage === 3) {
      // alert("Timeout! System has voted a card for you!");
      this.setState({
        selectedCard:this.state.cardsOnDesk[0],
        timeId:""
      });
      let vote = document.getElementById("voteCard");
      vote.click();
    }

    if (this.state.stage === 4) {
      // alert("Timeout! Next round.");
      this.setState({
        timeId:""
      });
      let next = document.getElementById("readyToStart");
      next.click();
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
          playerName: this.props.myGame[0].players[res],
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
        isOver:game.isOver,
        playerPoints:game.playerPoints
      });
      this.getPlayerIndex();
    });
  }

  updatePoint() {
    this.props.gameData.map(userGame => {
      this.setState({
        points: userGame.totalPoints
      });
    });
  }
  
  getPlayerPoints(player) {
    Meteor.call("usersGames.getPoints", player, (err, res) => {
      if (err) {
        alert("There was error updating check the console");
        console.log(err);
      } else {
        return res;
      }
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

    // if (e.target.id === "final") {
    //   Meteor.call("games.final", this.state.gameName, (err, res) => {
    //     if (err) {
    //       alert("There was error updating check the console");
    //       console.log(err);
    //     } else {
    //       console.log("succeed", res);
    //     }
    //   });
    // }

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
        this.setState({
          readyCount:1,
          voteCount:0,
          pickCount:0,
          timeId:""
        });
      }
      let curPoint = 0;
      if (this.state.stage === 4) {
        if (this.state.winners.includes(this.state.playerName)){
          if (this.state.isHost === true){
            curPoint = 3;
          } else {
            curPoint = 1;
          }
        }
        Meteor.call("usersGames.updateScore", curPoint,(err, res) => {
          if (err) {
            alert("There was error updating check the console");
            console.log(err);
          } else {
            console.log("succeed", res);
          }
        });
        Meteor.call("games.nextHost", this.state.gameName, (err, res) => {
          if (err) {
            alert("There was error updating check the console");
            console.log(err);
          } else {
            console.log("succeed", res);
          }
        });
        this.setState({
          voteCount:0,
          pickCount:0,
          timeId:""
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
          description: "",
          timeId:""
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
          selectedCard: null,
          pickCount:1,
          timeId:""
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
          selectedCard: null,
          voteCount: 1,
          timeId:""
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
/*  Meteor.setTimeout(function() {
    console.log("Timeout called after three seconds...");
  }, 3000);*/
  render() {
    // console.log("TEST: props.myGame.length:", this.props.myGame.length);
    // console.log("TEST: state.gameName: ", this.state.gameName);
    // console.log("TEST: state.stage: ", this.state.stage);
    // console.log("TEST: state.playerIdx: ", this.state.playerIdx);
    // console.log("TEST: state.hostIdx: ", this.state.hostIdx);
    // console.log("TEST: state.points: ", this.state.points);
    // console.log("TEST: state.description: ", this.state.description);
    // console.log("TEST: state.hostDescription: ", this.state.hostDescription);
    // console.log("TEST: state.selectedCard: ", this.state.selectedCard);
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
    const pickCard = 
    (<div id="chooseCard"> 
      <span> You've chosen: 
        {this.state.selectedCard === null ? null : (
          <span
            className="card col-xs-2 col-s-3"
            style={{
              backgroundImage: `url(${this.state.selectedCard.url})`,
              backgroundSize: "cover"
            }}
          />
        )}</span>
      
    </div> );
    
    return (

      <div className="container">
        {NavBar}
        <div className="row">
          <div className="col-s-2 col-xs-hidden part" id="scoreBoard">
            <h2 className="row"> GameRoom </h2>
            <p> NAME: <br/><span className="boardInfo">{this.state.gameName}</span></p>
            <p> ROUND: <span className="boardInfo">{this.state.hostIdx + 1}</span></p>
            <p> STORY TELLER:<br/><span className="boardInfo">{this.state.players[this.state.hostIdx]}</span></p>
            <h2 className="row"> ScoreBoard </h2>
            <div>
              {this.props.gameData.map(game => (
                <div key = {game._id}>{game.username} : <span className="boardInfo">{game.totalPoints}</span></div>
              ))}
            </div>
          </div>

          <div className="col-s-10" id="gameBoard">
            <div className="part">
              {this.state.stage > 1 ?
                <div><h4 id="displayDescrition">Story teller description: <span className="gameInfo">{this.state.hostDescription}</span></h4></div> 
                : 
                <div><h4 id="displayDescrition" style={{"color":"transparent"}}><span className="gameInfo">{this.state.hostDescription}</span></h4></div>
              }
              <h2 className="row"> Pool </h2>
              {this.state.stage == 0? <div> {this.state.readyCount==0? <div className="row">
                <h4>
                  <span id="badge" className="badge badge-pill badge-warning m-2">
                    Click the Ready Button to start game!
                  </span>
                </h4>
              </div> : <div className="row">
                <h4>
                  <span id="badge" className="badge badge-pill badge-warning m-2">
                    Waiting for other players to Start!
                  </span>
                </h4>
              </div>} 
              </div>
                : 
                <div>
                  {this.state.stage === 2 && this.state.isHost? 
                    <div className="row">
                      <h4>
                        <span id="badge" className="badge badge-pill badge-warning m-2">
                          Waiting for other players to Pick!
                        </span>
                      </h4>
                    </div>
                    : 
                    null
                  }
                  {
                    this.state.stage === 5 ? <div><h4>GAME OVER!</h4></div>:null
                  }
                  {this.state.stage === 4?
                    <div>
                      <div><h4>Answer:</h4>
                        {this.props.myGame.map(game => (
                          <div key = {game._id}
                            className="card col-xs-4 col-s-3"
                            style={{
                              backgroundImage: `url(${game.targetCard.url})`,
                              backgroundSize: "cover"
                            }}></div>))}</div>
                      <div><h4>Winners:</h4>
                        {this.props.myGame.map(game => (
                          <div key = {game._id}
                            className="col-xs-4 col-s-3">
                            {game.winners.map(winner =>(
                              <div key = {winner}>{winner}</div>
                            ))}
                          </div>))}</div>
                    </div>
                    : null
                  }

                  {this.state.stage === 3 && this.state.isHost ?
                    <div className="row">
                      <h4>
                        <span id="badge" className="badge badge-pill badge-warning m-2">
                          Waiting for other players to Vote!
                        </span>
                      </h4>
                    </div> : null
                  }

                  {this.state.stage === 3 && !this.state.isHost && this.state.voteCount===0?
                    <div className="row">
                      <div className = "col-7">
                        <h4>
                          <span id="badge" className="badge badge-pill badge-warning m-2">
                           Please vote for a card in POOL!
                          </span>
                        </h4>
                      </div>
                      <div className = "col-3">
                        {pickCard}
                      </div>
                      <div className ="col-2">
                        <button type="button" className="btn btn-danger" id = "voteCard" onClick = {this.onSubmit}>Vote</button> 
                      </div>
                    </div> : null
                  }

                  {this.state.cardsOnDesk.length === this.state.players.length? 
                    (<div className="row" id="cardsOnDesk">
                      {this.state.cardsOnDesk.map(cardOnDesk => (
                        <div key={cardOnDesk._id}
                          className="card col-xs-4 col-s-3"
                          style={{
                            backgroundImage: `url(${cardOnDesk.url})`,
                            backgroundSize: "cover"
                          }}
                          onClick={() =>
                            this.setState({ selectedCard: cardOnDesk })
                          }
                        >
                        </div>
                      ))}
                    </div>)
                    : 
                    <div>{(this.state.stage === 1 && this.state.cardsOnDesk.length === 0) ? 
                      (<div className="row">
                        <h4>
                          <span id="badge" className="badge badge-pill badge-warning m-2">
                          Waiting for "{this.state.players[this.state.hostIdx]}" to pick a card and describe...
                          </span>
                        </h4>
                      </div>)
                      : 
                      (<div className="row">
                        {this.state.stage === 2 ?
                          <h4>
                            <span id="badge" className="badge badge-pill badge-warning m-2">
                            Waiting for { this.state.players.length - this.state.cardsOnDesk.length} player(s) to pick card!
                            </span> </h4>: null}
                      </div>       
                      )
                    }</div>
                  }</div>}

              <div className = "row part">
                <div className = "col-12">
                  <h2 className="row"> Cards In Hand </h2>
                </div>
                <div className = "col-4">
                  <div>{(this.state.stage === 2 && !this.state.isHost && this.state.pickCount===0 ? 
                    (<div className="row">
                      <h4>
                        <span id="badge" className="badge badge-pill badge-warning m-2">
                        Please pick a card from your HAND!
                        </span>
                      </h4>
                    </div>)
                    : 
                    null)}</div>
                  <div>
                    {this.state.stage == 1 && this.state.isHost ? 
                      <div className="row" id="textbox">
                        <form>
                          <div className="form-group from -inline">
                            <input
                              type=""
                              className="form-control"
                              id="description"
                              aria-describedby="description"
                              value={this.state.description}
                              onChange={this.onChange}
                              placeholder="Enter Description..."
                            />
                            <small id="detail" className="form-text text-muted">
                              Tips: You get points when at least ONE but not ALL guess right
                            </small>
                          </div>
                        </form>
                      </div>: null}
                  </div>
                </div>
                
                <div className = "col-3">
                  
                </div>
                <div className = "col-3">
                  {this.state.stage === 0 && this.state.readyCount === 0? (<button type="button" className="btn btn-danger" id = "readyToStart" onClick = {this.onSubmit.bind(this)}>Ready!</button>):
                    <div className="row" >
                      {(this.state.isHost && this.state.stage === 1) || (!this.state.isHost && this.state.stage == 2)? pickCard :null}
                    </div>}
                </div>
                <div className = "col-2">
                  {this.state.stage === 0 || this.state.stage == 5 ? <button type="button" className="btn btn-dark" id = "exitGame" onClick = {this.onSubmit}>Exit</button>: null}
                  {this.state.stage === 1 && this.state.isHost ? <button type="submit" className="btn btn-danger" id="descriptionDone" onClick={this.onSubmit} > Submit </button>:null}
                  {this.state.stage === 2 && !this.state.isHost && this.state.pickCount === 0? <button type="button" className="btn btn-danger" id = "pickCard" onClick = {this.onSubmit}>Pick</button> : null}
                  {(this.state.stage === 4 && this.state.hostIdx < this.state.players.length - 1) ? <button type="button" className="btn btn-dark" id = "readyToStart" onClick = {this.onSubmit}>Next Round</button>: null}     
                  {(this.state.stage === 4 && this.state.hostIdx == this.state.players.length - 1) ? <button type="button" className="btn btn-dark" id = "readyToStart" onClick = {this.onSubmit}>Next</button>: null}     
                </div>
              </div>
              {!this.state.cardsOnHand || this.state.cardsOnHand.length === 0 ? null 
                : (
                  <div className="row" id="cardsInHand">
                    {this.state.cardsOnHand.map(cardOnHand => (
                      <div
                        key={cardOnHand._id}
                        className="card col-xs-6 col-s-3"
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
  gameData: PropTypes.arrayOf(PropTypes.object).isRequired,
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  ready: PropTypes.bool.isRequired
};

export default withTracker(() => {
  const handle = Meteor.subscribe("myGame");
  const handle2 = Meteor.subscribe("gameData");
  const handle3 = Meteor.subscribe("cards");
  return {
    user: Meteor.user(),
    ready: handle.ready() || handle2.ready() || handle3.ready(),
    myGame: Games.find({}).fetch(),
    gameData: UsersGames.find({}).fetch(),
    cards: Cards.find({}).fetch()
  };
})(MyGame);