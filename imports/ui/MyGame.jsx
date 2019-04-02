import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Games } from "../api/games.js";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { UsersGames } from "../api/usersGames.js";
import { Cards } from "../api/cards.js";
import { random } from "../utils/random";
import "./GameBoard.css";

class MyGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //fixed in the whole game
      gameName : "",
      playerIdx: 0,

      //round-level changes
      points: 0, //once at the end
      hostIdx:0, //once at the start
      hostDescription:"",
      cardsOnDesk: [],

      //if user is host
      description: "",
      //host: answer card, others picked card
      selectedCard: null, //OBJECT
      
      //stage-level changes
      stage:0,
      cardsOnHand:[],

      //count:0,
      players:[],
      //winners:[],//people who guess right
      //cards:[],//all cards

      newUrl: "",
      distributedCards: random(this.props.cards, 4),
      buttonClick:0,

    };     
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  start() {
    Meteor.call("games.start", this.state.distributedCards, this.state.gameName, (err, res) => {
      if (err) {
        alert("There was error updating check the console");
        console.log(err);
      }
      console.log("succeed",res);
    });
    // distribute 6 cards to each player and save into db
    /*let players = Games.findOne({"name": this.state.gameName }).players;*/
  }

  
  componentDidMount() {
    this.updateGame();
    this.getGame();
  }

  componentDidUpdate(prevProps) {
    if (this.props.myGame!= prevProps.myGame){
      this.updateGame();
    }
  }

  //////do not change through out the whole game//////
  getGame(){ 
    this.props.myGame.map(game =>{
      this.setState({
        gameName: game.name
      });
    });
  }
  getPlayerIndex(){ //TODO: db test // NOT WORKING
    return Meteor.call("games.getPlayerIndex",this.state.gameName,(err, res) => {
      if (err) {
        alert("There was error updating check the console");
        console.log(err);
      }
      console.log("succeed",res);
    });
  }
  //////////////////////////////////////////////////


  /////update for each move during each stage///////
  updateGame(){
    if (this.stage === 1) {
      this.setState({
        playerIdx: this.getPlayerIndex()
      });
    }
    this.props.myGame.map(game =>{
      this.setState({
        gameName: game.name,
        playerIdx: 0,
        stage: game.stage,
        hostIdx: game.hostIdx, //get hostName
        hostDescription: game.description,
        cardsOnDesk: game.cardsOnDesk,
        cardsOnHand: game.cardsOnHand[0],
        player: game.players,
        //players, points
      });
    });
  }
  //////////////////////////////////////////////////

  // updateCount(){
  //   Meteor.call("games.addCount", this.state.gameName,(err, res) => {
  //     if (err) {
  //       alert("There was error updating check the console");
  //       console.log(err);
  //     } else {
  //       console.log("succeed",res);
  //     }
  //   });
  // }

  onChange(e){
    this.setState(
      {
        [e.target.id]: e.target.value
      }
    );
  }

  onSubmit(e) {
    this.setState({
      buttonClick : 1
    });

    if (e.target.id === "readyToStart") {
      this.props.myGame.map(game  => (
        this.setState({
          gameName: game.name
        })
      ));
      Meteor.call("games.updateReady", this.state.gameName,(err, res) => {
        if (err) {
          alert("There was error updating check the console");
          console.log(err);
        } else {
          console.log("succeed",res);
        }
      });
    }

    if (e.target.id === "descriptionDone") { 
      if (this.state.selectedCard != null && this.state.description != "") {
        let info = {
          game:this.state.gameName,
          card: this.state.selectedCard,
          description:this.state.description
        };
        Meteor.call("games.updateAnswer", info, (err, res) => {//TODO: db test
          if (err) {
            alert("There was error updating check the console");
            console.log(err);
          } else {
            console.log("succeed",res);
          }
        });
        Meteor.call("games.addCardToDesk", info, (err, res) => {//TODO: db test
          if (err) {
            alert("There was error updating check the console");
            console.log(err);
          } else {
            console.log("succeed",res);
          }
        });
        this.setState({
          selectedCard: null,
          description:""
        });
      }

      if (e.target.id === "pickCard") {
        if (this.state.selectedCard != null) {
          let info = {
            game:this.state.gameName,
            card: this.state.selectedCard
          };
          Meteor.call("games.addCardToDesk", info, (err, res) => {//TODO: db test
            if (err) {
              alert("There was error updating check the console");
              console.log(err);
            } else {
              console.log("succeed",res);
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
            game:this.state.gameName,
            card: this.state.selectedCard
          };
          Meteor.call("games.updateWinners", info, (err, res) => {//TODO: db test,combine with players, update winners
            if (err) {
              alert("There was error updating check the console");
              console.log(err);
            } else {
              console.log("succeed",res);
            }
          });
          this.setState({
            selectedCard: null
          });
        }
      }

      //function: compute points, display result, stage = 0, idx++, reset all {count = 0, idx++,.....}


    // if (e.target.id === "exitGame") {//update user status, remove player from game, can exit only on stage 0(before game starts)
    //   Meteor.call("usersGames.exit",this.state.points, (err, res) => {
    //     if (err) {
    //       alert("There was error updating check the console");
    //       console.log(err);
    //     }
    //     console.log("succeed",res);
    //   });
    //   Meteor.call("games.removePlayer", this.state.gameName, (err, res) => {
    //     if (err) {
    //       alert("There was error updating check the console");
    //       console.log(err);
    //     }
    //     console.log("succeed",res);
    //   });
    // }
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
    let i=0;
    const stage0 = (
      <div className="container"id="HomePage" >
        <div className = "row">
          <p>Stage0, game created, click start game, wait for enough players</p>
          {this.state.buttonClick === 0? 
            <button type="button" className="btn btn-outline-dark" id = "readyToStart" onClick = {this.onSubmit.bind(this)}>Ready!</button>
            :
            null
          }
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
          Card:{}
          Description: {}
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
      <div className="container">
        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        <div> 
          <div className="row">TEST: props.myGame.length: should be 1, actual data: {this.props.myGame.length}</div>
          <br/><div className="row">TEST: state.gameName: {this.state.gameName}</div>
          <br/><div className="row">TEST: state.stage: {this.state.stage}</div>
          <br/><div className="row">TEST: state.playerIdx: {this.state.playerIdx}</div>
          <br/><div className="row">TEST: state.hostIdx: {this.state.hostIdx}</div>
          <br/><div className="row">TEST: state.points: {this.state.points}</div>
          <br/><div className="row">TEST: state.description: {this.state.description}</div>
          <br/><div className="row">TEST: state.hostDescription: {this.state.hostDescription}</div>
          {stage0}
          {stage1}
          {stage2}
          {stage3}
          {stage4}
        </div>
         @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        
        <div className="container">
          <div className="row">
            <div className="col-10" id="gameBoard">
              <h2 className="row"> Pool </h2>
              <div className="row" id="cardPool">
                {this.state.cardsOnDesk.map( cardOnDesk=> (
                  <div key={i++} className="card col-xs-4 col-s-3">
                    <div className = "container">
                      <div className ="container img-box"><img src={cardOnDesk.url} className="card-img-top img-rounded"/></div>
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
                {this.state.cardsOnHand.map(cardOnHand => (
                  <div key={cardOnHand._id} className="card col-xs-4 col-s-3" style={{backgroundImage: `url(${cardOnHand.url})`, backgroundSize: "cover"}}>
                    
                  </div>
                ))}
              </div>
            </div>
            <div className="col-2 ml-auto" id="scoreBoard">
              {this.state.players.map(player => (<div key={player._id} className="row">{player}:score</div>))}
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
      </div>  
    );
  }
}

MyGame.propTypes = {
  myGame: PropTypes.arrayOf(PropTypes.object).isRequired,
  usersGames: PropTypes.arrayOf(PropTypes.object).isRequired,
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const handle = Meteor.subscribe("myGame");
  const handle2 = Meteor.subscribe("usersGames");
  const handle3 = Meteor.subscribe("cards");
  return {
    user: Meteor.user(),
    ready : handle.ready() && handle2.ready() && handle3.ready(),
    myGame: Games.find({}).fetch(),
    usersGames: UsersGames.find({}).fetch(),
    cards: Cards.find({}).fetch(),
  };
})(MyGame);
