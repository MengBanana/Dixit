import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const UsersGames = new Mongo.Collection("usersGames");

if (Meteor.isServer) {
  Meteor.publish("usersGames", function gamesPublication() {
    return UsersGames.find({});
  });
  Meteor.publish("myGame", function gamePublication() {
    if (!this.userId) {
      return this.ready();
    }
    return UsersGames.find({}, {
      _id: Meteor.userId()
    });
  });
}

Meteor.methods({
  "usersGames.join"(name) {
    check(name, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    let res = UsersGames.findOne({
      _id: this.userId
    });
    if (res){
      if (res.ingame === true) {
        throw new Meteor.Error("Already in a game");
      } else {
        UsersGames.update({
          _id: this.userId
        }, {
          ingame: true,
          gameName: name
        });

      }
    } else {
      UsersGames.insert({
        _id: this.userId,
        ingame: true,
        gameName: name,
        totalPoints: 0,
        totalRounds: 0
      });
    }
  },


  "usersGames.exit"() { //upate points, round++, exit game
    
  }
});



