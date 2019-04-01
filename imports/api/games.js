import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Games = new Mongo.Collection("games");

if (Meteor.isServer) {
  Meteor.publish("games", function gamesPublication() {
    return Games.find({}, {
      limit: 50,
      sort: {
        createdAt: -1
      }
    });
  });
}

Meteor.methods({
  "games.insert"(info) {
    check(info.name, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    let res = Games.findOne({
      name: info.name
    });
    if (res!= null) {
      throw new Meteor.Error("nameTaken");
    }
    Games.insert({
      name: info.name,
      numberOfPlayers: info.number,
      stage: 0,
      players:[],
      createdAt: Date.now(),
      owner: Meteor.user().username
    });
  },

  "games.addPlayer"(name) {
    check(name, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    let res = Games.findOne({
      name:name
    });
    if (res.players.includes(Meteor.user().username)){
      return;
    }
    Games.update(
      {name: name}, 
      {$push:{players: Meteor.user().username}}
    );
  },

  "game.removePlayer"(gameName) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Games.update(
      {name: gameName}, 
      {$pull:{players: Meteor.user().username}}
    );
  }
});



