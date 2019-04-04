import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Cards } from "../api/cards.js";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";


export class AddCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUrl: "",
      cards:[]
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.cards != prevProps.cards) {
      this.setState({
        cards:this.props.cards
      });
    }
  }

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


  render() {
    console.log(this.state.cards);
    return (
      <div className="container">
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
        <div className="row" id="addcard">
                    {this.state.cards.map(card => (
                      <div
                        key={card._id}
                        className="card col-xs-4 col-s-3"
                        style={{
                          backgroundImage: `url(${card.url})`,
                          backgroundSize: "cover"
                        }}
                      />
                    ))}
                  </div>
      </div>
    );
  }
}

AddCard.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const handle1 = Meteor.subscribe("cards");
  
  return {
    cards: Cards.find({}).fetch(),
    user: Meteor.user(),
    ready : handle1.ready(),
  };
})(AddCard);

