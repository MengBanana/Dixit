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
        tempPoints: 0, //score in one game
        totalPoints: 0,
        totalRounds: 0,
        twitterId:"",
        temp:[],//cards winned in one game
        collection:[]
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
        tempPoints: points,
      }
    }); 
  },

  "usersGames.getPoints" (player){
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    let data = UsersGames.findOne({username: player});
    return data.tempPoints;
  },



  "usersGames.exit"() {//upate points, round++, exit game
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    let data = UsersGames.findOne({_id: Meteor.userId()});
    let tempPoints = data.tempPoints;
    let temp = data.temp; //cards earned
    let collection = data.collection;
    for (var i = 0; i < temp.length; i++) {
      if (collection.some(card => card["_id"] == temp[i]._id)) {
        continue;
      } else {
        let newCard = ({
          _id: temp[i]._id,
          url: temp[i].url,
          gameName: data.gameName, //first collected at game
          createdAt: Date.now()// first collected at date
        });
        collection.push(newCard);
      }
    }

    UsersGames.update ({
      _id: this.userId,
    }, { 
      $set:{
        ingame: false,
        gameName: "",
        tempPoints:0,
        temp:[],
        collection:collection
      },
      $inc: {
        totalRounds: 1,
        totalPoints:tempPoints
      }
    }); 
  }
});



