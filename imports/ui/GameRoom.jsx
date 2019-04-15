import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Games } from "../api/games.js";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import Pagination from "./Pagination";
import { Cards } from "../api/cards.js";
import { paginate } from "../utils/paginate";
import { random } from "../utils/random";


class GameRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newGameName: "",
      numberOfPlayers:0,
      pageSize: 12,
      currentPage: 1,
      search: "",
      privateRoom: false,
      twitterLinked: 0,
      friends:[],//screenNames
      accessCode:"",

    };
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.updateSearch = this.updateSearch.bind(this);  
  }

  handlePageChange(page) {
    this.setState({ currentPage: page });
  }

  updateSearch(event) {
    this.setState({ search: event.target.value.substring(0, 20) });
    console.log(event.target.value);
  }

  onChange(e){
    this.setState(
      {
        [e.target.id]: e.target.value
      }
    );
  }

  onClick(e) {
    e.preventDefault();
    if (e.target.id === "private"){
      this.setState({
        privateRoom: !this.state.privateRoom
      });
    }

    if (e.target.id === "createRoom"){
      Meteor.call("games.checkTwitterConnection", (err, res) => {
        if (err) {
          console.log(err);
          return;
        } else {
          this.setState({
            twitterLinked: res
          });
        }
      });
    }

    if (e.target.id === "inviteTwitterFriends") {
      let code = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
      this.setState({
        accessCode: code
      });
      let data = {
        friends: this.state.friends,
        accessCode: code
      };
     

      Meteor.call("twitter.invite", data, (err, res) => {
        if (err) {
          alert("There was error updating check the console");
          console.log(err);
          return;
        } else {
          console.log("succeed",res);
        }
      });
    }
  }

  onSubmit(e) {
    let method = e.target.id;
    let info = {
      name: e.target.id === "joinGame" ? e.target.name : this.state.newGameName,
      number: this.state.numberOfPlayers,
      privateRoom: this.state.privateRoom,
      accessCode: this.state.accessCode,
      cards: random(this.props.cards, this.state.numberOfPlayers)
    };
    this.setState({
      newGameName: "",
      numberOfPlayers: 0,
      search: "",
      privateRoom: ""
    });

    if (method === "newGame") {
      if (info.number < 3 || info.number > 6) {
        return alert("Please enter a number between 3 and 6");
      }
    }
    Meteor.call("usersGames.join",info.name,(err, res) => {
      if (err) {
        alert("There was error updating check the console");
        console.log(err);
        return;
      } else {
        if (method === "newGame") {
          Meteor.call("games.insert",info, (err, res) => {
            if (err) {
              alert("Name already taken!");
              console.log(err);
            }
            console.log("succeed",res);
          });
        } 
        Meteor.call("games.addPlayer",info.name,(err, res) => {
          if (err) {
            alert("There was error updating check the console");
            console.log(err);
          }
          console.log("succeed",res);
        });
      }
    });
  }

  render() {
    console.log(this.state.accessCode);
    const {
      currentPage,
      pageSize,
      search
    } = this.state;
    let filteredGames = this.props.games;
    if (search !== "") {
      filteredGames = this.props.games.filter( game => {
        return (
          game.accessCode===this.state.search
        );
      });
    } else {
      filteredGames = this.props.games.filter( game => {
        return (
          game.privateRoom != true && game.isOver != true
        );
      });
    }

    const paginatedGames = paginate(filteredGames, currentPage, pageSize);
    const inviteTwitterFriends = (
      <div>
        {this.state.twitterLinked? 
          (<div>
            <div className="input-group flex-nowrap">
              <label>Invite Twitter Friends:</label>
              <div className="input-group-prepend">
                <span className="input-group-text" id="addon-wrapping">@</span>
              </div>
              <input type="text" className="form-control" placeholder="eg:name1,name2,……" aria-label="friends" id="friends" aria-describedby="addon-wrapping" onChange = {this.onChange.bind(this)}/>
              <button type="button" className= "btn btn-warning my-2 my-sm-0 " id="inviteTwitterFriends" onClick={this.onClick.bind(this)}>Invite</button>
            </div>
          </div>)
          :
          null
        }
      </div>
    );

    return (

      <div className = "container gameroom">
        <div className="row part rooms">
          <div className = "col-4">
            <h1>GameRoom</h1>
          </div>
          <div className = "col-5">
            
          </div>
          <div className = "col-3 addNewBtn">
            <button type="button" className= "btn inline-btn btn-danger my-2 my-sm-0 " data-toggle="modal" data-target="#myModal" id="createRoom" onClick={this.onClick.bind(this)}>Add Game</button>
          </div>
          <div className = "col-12">
            <h6 className="form-inline" id="accessCodeLabel"><input className="form-control form-inline mr-xs-2" type="search" placeholder="5 digit accessCode" aria-label="Search" id="search" value={this.state.search} onChange={this.updateSearch}></input>* If you have one</h6>
          </div>
        </div>

        <div className ="row part">
          <div id="myModal" className="modal fade" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Start a new Game?</h4>
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                </div>
                <div className="modal-body">
                  <form id="newItemForm">
                    <div className = "form-group">
                      <label>Game Name</label>
                      <input type="text" className="form-control" id="newGameName" onChange= {this.onChange.bind(this)}/>
                    </div>
                    <div className = "form-group">
                      <label>Number Of Players (3~6)</label>
                      <input type="text" className="form-control" id="numberOfPlayers" onChange= {this.onChange.bind(this)}/>
                    </div>
                    {this.state.twitterLinked ? <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="private" onClick={this.onClick.bind(this)}/>
                      <label className="form-check-label">private room?</label>
                    </div> :
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" disabled/>
                        <label className="form-check-label">private room?</label>
                        <p> Please sign in with Twitter to get this advanced feature </p>
                      </div>}
                    <div> 
                      {this.state.privateRoom ? inviteTwitterFriends :null}
                    </div>
                  </form>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  {this.state.privateRoom == false || this.state.twitterLinked ? <button className="btn btn-danger" data-dismiss="modal" id="newGame" onClick={this.onSubmit}>Start</button>:<button className="btn btn-danger" data-dismiss="modal" id="newGame" onClick={this.onSubmit} disabled>Start</button>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row part rooms">
          {paginatedGames.map(game => (
            <div key={game._id}  id="room" className = "card">
              <div >
                <div className="card-body">
                  <h5 className = "card-text text-center cardGameName">{game.name}</h5>
                  <p className = "card-text text-center">Status: {game.players.length}/{game.numberOfPlayers}</p>
                  <span className = "card-text text-center">
                    <p>
                  Players:<br/>
                      {game.players.map(player => (<span className="player" key ={player}> {player}    </span>))}
                    </p>
                  </span>
                  {game.okToJoin === true ? <div className="gameRoomBtn"><button type="button" className="btn btn-outline-dark" id="joinGame" name={game.name} onClick = {this.onSubmit.bind(this)}>JoinUs</button></div>
                    : <div> {game.isOver === true ?  <div className="gameRoomBtn"><button type="button" className="btn btn-outline-secondary" disabled>GameOver</button></div> :
                      <div className="gameRoomBtn"><button type="button" className="btn btn-outline-secondary" disabled>InGame</button></div>}</div>}
                </div>
              </div> 
            </div>
          ))}
        </div>
        <Pagination
          itemsCount={filteredGames.length}
          pageSize={this.state.pageSize}
          onPageChange={this.handlePageChange}
          currentPage={this.state.currentPage}
        />
      </div>
    );
  }
}

GameRoom.propTypes = {
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  ready: PropTypes.bool.isRequired
};

export default withTracker(() => {
  const handle = Meteor.subscribe("games");
  const handle2 = Meteor.subscribe("cards");
  
  return {
    games: Games.find({},{
    }).fetch(), 
    user: Meteor.user(),
    cards: Cards.find({}).fetch(),
    ready : handle.ready() && handle2.ready()
  };
})(GameRoom);