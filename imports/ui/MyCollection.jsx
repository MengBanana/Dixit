import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { UsersGames } from "../api/usersGames.js";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";

class MyCollection extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.myData[0]);
    return (
      <div className="container">
        <h2 className="row collection"> My Collection </h2>
        { this.props.myData.collection?
          <div className="row" id="addcard">
            {this.props.myData[0].collection.map(card => (
              <div
                key={card._id}
                className="card col-xs-4 col-s-3"
                style={{
                  backgroundImage: `url(${card.url})`,
                  backgroundSize: "cover"
                }}
              >
                
              </div>
            ))}
          </div> : null
        }
      </div>
    );
  }
}

MyCollection.propTypes = {
  myData: PropTypes.arrayOf(PropTypes.object).isRequired,
  ready: PropTypes.bool.isRequired
};

export default withTracker(() => {
  const handle = Meteor.subscribe("myData");
  return {
    user: Meteor.user(),
    myData: UsersGames.find({}).fetch(),
    ready: handle.ready(),
  };
})(MyCollection);
