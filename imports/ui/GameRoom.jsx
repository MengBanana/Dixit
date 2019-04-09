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
      twitterLinked: false,
      friends:[],//screenNames
      accessCode: ""
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
    if (e.target.id === "createRoom"){
      this.setState({
        privateRoom: !this.state.privateRoom
      });
    }
    Meteor.call("games.checkTwitterConnection", (err, res) => {
      if (err) {
        alert("There was error updating check the console");
        console.log(err);
        return;
      } else {
        this.setState({
          twitterLinked: res
        });
      }
    });

    if (e.target.id === "inviteTwitterFriends") {

      this.setState ({
        accessCode: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
      });

      let data = {
        friends: this.state.friends,
        accessCode: this.state.accessCode
      };
     

      Meteor.call("tweeter.invite", data, (err, res) => {
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
      cards: random(this.props.cards, this.state.numberOfPlayers)
    };
    this.setState({
      newGameName: "",
      numberOfPlayers: 0,
      search: ""
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
    const {
      currentPage,
      pageSize,
      search
    } = this.state;
    let filteredGames = this.props.games;
    if (search !== "") {
      filteredGames = this.props.games.filter( game => {
        return (
          game.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1
        );
      });
    }

    const paginatedGames = paginate(filteredGames, currentPage, pageSize);
    const inviteTwitterFriends = (
      <div>
        {this.state.twitterLinked ? 
          (<div>
            <div className="input-group flex-nowrap">
              <label>Invite My Twitter Friends:</label>
              <div className="input-group-prepend">
                <span className="input-group-text" id="addon-wrapping">@</span>
              </div>
              <input type="text" className="form-control" placeholder="Usernames separate by ',', eg: aaa,bbb,ccc,ddd" aria-label="friends" id="friends" aria-describedby="addon-wrapping" onChange = {this.onChange.bind(this)}/>
              <button type="button" className= "btn btn-danger my-2 my-sm-0 " id="inviteTwitterFriends">Invite!</button>
            </div>
          </div>)
          :
          null
        }
      </div>
    );
    //console.log(this.state.privateRoom);
    return (

      <div className = "container gameroom">
        <div className="row part">
          <h4>
            <span id="badge" className="badge badge-pill badge-warning">
             Please join an existing game or add a new game room
            </span>
          </h4>
        </div> 
        <div className="row part ">
          <h1>GameRoom</h1>
          <form className="form-inline col-4">
            <input className="form-control mr-sm-2" type="search" placeholder="🔍 Search..." aria-label="Search" value={this.state.search}
              onChange={this.updateSearch}></input>
          </form>
          <button type="button" className= "btn btn-danger my-2 my-sm-0 " data-toggle="modal" data-target="#myModal" id="createRoom" onClick={this.onClick.bind(this)}>Add Game</button>
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
                      <input type="checkbox" className="form-check-input"/>
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
                  {this.state.privateRoom === false || this.state.twitterLinked ? <button className="btn btn-danger" data-dismiss="modal" id="newGame" onClick={this.onSubmit}>Start</button>:<button className="btn btn-danger" data-dismiss="modal" id="newGame" onClick={this.onSubmit} dis>Start</button>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {paginatedGames.map(game => (
            <div key={game._id} className="card col-xs-6 col-s-3" id="room">
              <div className = "container">
                <div className="card-body">
                  <h4 className = "card-text text-center">{game.name}</h4>
                  <p className = "card-text text-center">Status: {game.players.length}/{game.numberOfPlayers}</p>
                  <div className = "card-text text-center">
                    <p>
                  Players:
                      {game.players.map(player => (<span className="player" key ={player}>    {player}</span>))}
                    </p>
                  </div>
                  {game.okToJoin === true ? <button type="button" className="btn btn-outline-dark center-block" id="joinGame" name={game.name} onClick = {this.onSubmit.bind(this)}>JoinUs</button>
                    : <button type="button" className="btn btn-outline-dark" disabled>InGame</button>}
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
  ready: PropTypes.bool.isRequired
};

export default withTracker(() => {
  const handle = Meteor.subscribe("games");
  const handle2 = Meteor.subscribe("cards");
  
  return {
    games: Games.find({}).fetch(), 
    user: Meteor.user(),
    cards: Cards.find({}).fetch(),
    ready : handle.ready() && handle2.ready()
  };
})(GameRoom);
