import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const UsersGames = new Mongo.Collection("usersGames");

if (Meteor.isServer) {
  Meteor.publish("usersGames", function gamesPublication() {
    return UsersGames.find({
    },{
      limit: 50,
      sort: {
        createdAt: -1
      }
    });
  });

  Meteor.publish("myData", function f() {
    if (!Meteor.userId()) {
      return this.ready();
    }
    return UsersGames.find({_id: Meteor.userId()});
  });

  Meteor.publish("gameData", function f(){
    if (!Meteor.userId()) {
      return this.ready();
    }
    let res = UsersGames.find({_id: Meteor.userId()}).fetch();
    return UsersGames.find({gameName: res[0].gameName});
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
          $set:{
            ingame: true,
            gameName: name
          }
        });
      }
    } else {
      let username = "";
      if (!Meteor.user().username) {
        username = Meteor.user().services.twitter.screenName;
      } else {
        username = Meteor.user().username;
      }

      UsersGames.insert({
        _id: this.userId,
        username: username,
        ingame: true,
        gameName: name,
        totalPoints: 0,
        totalRounds: 0,
        twitterId:""
      });
    }
  },
  
  "usersGames.updateScore"(points) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    UsersGames.update ({
      _id: Meteor.userId()
    }, {
      $inc: {
        totalPoints: points,
      }
    }); 
  },

  "usersGames.getPoints" (player){
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    let data = UsersGames.findOne({username: player});
    return data.totalPoints;
  },



  "usersGames.exit"() {//upate points, round++, exit game
    console.log(this.userId);
    console.log(Meteor.userId());
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    UsersGames.update ({
      _id: this.userId,
    }, { 
      $set:{
        ingame: false,
        gameName: "",
      },
      $inc: {
        totalRounds: 1
      }
    }); 
  }
});



