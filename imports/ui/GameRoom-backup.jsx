import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Games } from "../api/games.js";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import Pagination from "./Pagination";
import { paginate } from "../utils/paginate";

class GameRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newGameName: "",
      pageSize: 12,
      currentPage: 1,
      search: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);     
    this.updateSearch = this.updateSearch.bind(this);
  }

  handlePageChange(page) {
    this.setState({ currentPage: page });
  }

  onChange(e){
    this.setState(
      {
        [e.target.id]: e.target.value
      }
    );
  }

  onSubmit() {
    Meteor.call("games.insert",this.state.newGameName, (err, res) => {
      if (err) {
        alert("There was error updating check the console");
        console.log(err);
      }
      console.log("succeed",res);
    });
    this.setState({
      newGameName: "",
      search: ""
    });
  }

  // onClick(evt) {
  //   let info = {
  //     id:evt.target.name,
  //     amt: evt.target.id === "addItem"? 1 : -1,
  //     userId: Meteor.userId(),
  //     userName: Meteor.user().username
  //   };

  //   Meteor.call("gifts.updateAmt", info,(err, res) => {
  //     if (err) {
  //       alert("There was error updating check the console");
  //       console.log(err);
  //     }
  //     console.log("succeed",res);
  //   });

  //   Meteor.call("wishes.update", info, (err, res) => {
  //     if (err) {
  //       alert("There was error updating check the console");
  //       console.log(err);
  //     }
  //     console.log("succeed",res);
  //   });
  // }

  // selected(giftId) {
  //   for (var i = 0; i < this.props.myWishes.length; i++) {
  //     if (this.props.myWishes[i].giftId == giftId) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  updateSearch(event) {
    this.setState({ search: event.target.value.substring(0, 20) });
    console.log(event.target.value);
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

    return (
      <div className = "container">
        <div className="row">
          <form className="form-inline col-4">
            <input className="form-control mr-sm-2" type="search" placeholder="🔍 Search..." aria-label="Search" value={this.state.search}
              onChange={this.updateSearch}></input>
          </form>
          <div id="myModal" className="modal fade" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Start a new game?</h4>
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                </div>
                <div className="modal-body">
                  <form id="newItemForm">
                    <div className = "form-group">
                      <label>GameRoom Name</label>
                      <input type="text" className="form-control" id="newGameName" onChange= {this.onChange.bind(this)}/>
                    </div>
                  </form>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  <button className="btn btn-danger" data-dismiss="modal" onClick={this.onSubmit}>Start!</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {paginatedGames.map(game => (
            <div key={game._id} className="card col-xs-6 col-s-3">
              <div className = "container">
                <div className="card-top text-right text-dark count"></div>
                <div className ="container img-box"><img className="card-img-top img-rounded" src="" alt=""/></div>
                <div className="card-body">
                  <h5 className = "card-text text-center">{game.name}</h5>
                  {this.active(game._id) ? <button type="button" className="btn btn-outline-dark" id="enterGame" name={game._id} onClick = {this.onClick.bind(this)}>Join</button>:
                    <button type="button" className="btn btn-outline-light" disabled>Now Playing</button>
                  }
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
  games: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withTracker(() => {
  const handle = Meteor.subscribe("games");
  
  return {
    games: Games.find({}).fetch(), 
    user: Meteor.user(),
    ready : handle.ready()
  };
})(GameRoom);
