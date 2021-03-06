import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Cards = new Mongo.Collection("cards");

if (Meteor.isServer) {
  Meteor.publish("cards", function cardsPublication() {
    return Cards.find({});
  });
}


Meteor.methods({
  "cards.getOne"(cardId) {
    check(cardId, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Cards.findOne({
      _id: cardId
    });
  },

  "cards.insert"(url) {
    check(url, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Cards.insert({
      url: url,
    });
  },
});

