import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Games = new Mongo.Collection("games");

if (Meteor.isServer) {
  Meteor.publish("games", function giftsPublication() {
    return Games.find({}, {
      limit: 50,
      sort: {
        amount: -1
      }
    });
  });
}

Meteor.methods({
  "games.insert"(name) {
    check(name, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    let res = Games.findOne({
      name: name
    });
    if (res!= null) {
      throw new Meteor.Error("nameTaken");//TODO: duplicate names ??
    }
    Games.insert({
      name: name,
      createdAt: Date.now()
    });
  },

  "games.addPlayer"(name) {
    let res = Games.find({
      name:name,
      player: {$contains:this.userId}
    });
    if (res != null) {
      return;
    }
    Games.update(
      {name: name}, 
      {$push:{players: this.userId}}
    );
  }
});



