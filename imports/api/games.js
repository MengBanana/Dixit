import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Games = new Mongo.Collection("games");

if (Meteor.isServer) {
  Meteor.publish("games", function gamesPublication() {
    return Games.find({});
  });
  Meteor.publish("myGame", function f() {
    if (!Meteor.userId()) {
      return this.ready();
    }
    return Games.find({}, {
      players:[this.userId]
    });
  });
}

Meteor.methods({
  "games.start"(randomCards) {
    check(randomCards.name, Array);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Games.insert({
      randomCards : randomCards
    });
  },

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
      okToJoin: true,
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
    if (res.players.length === res.numberOfPlayers) {
      console.log("full?");
      Games.update(
        {name: name}, 
        {okToJoin: false}
      );
    }
  },

  "games.removePlayer"(name) {
    check(name, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    let res = Games.findOne({
      name:name
    });
    if (!res.players.includes(this.username)){
      return;
    }
    Games.update(
      {name: name}, 
      {$pull: {players: Meteor.user().username}}
    );
  },

  // "games.removePlayer"(gameName) {
  //   if (!this.userId) {
  //     throw new Meteor.Error("not-authorized");
  //   }
  //   Games.update(
  //     {name: gameName}, 
  //     {$pull: {players: Meteor.user().username}}
  //   );
  // },
  //   "games.getGame"(gameName) {
  //   check(gameName, String);
  //   if (!this.userId) {
  //     throw new Meteor.Error("not-authorized");
  //   }
  //   Games.findOne({
  //     gameName: gameName
  // });
});



