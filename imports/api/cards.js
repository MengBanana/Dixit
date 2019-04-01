import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Cards = new Mongo.Collection("cards");

if (Meteor.isServer) {
  Meteor.publish("cards", function cardsPublication() {
    return Cards.find({});
  });
}


Meteor.Methods({
	"cards.getOne"(cardId) {
    check(cardId, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Cards.findOne({
      _id: cardId
  });
}});

