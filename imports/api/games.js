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
    return Games.find({players: Meteor.user().username});
  });
}

Meteor.methods({
  "games.insert"(info) {
    check(info.name, String);
    check(info.cards, Array);
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
      stage:0,
      count:[],
      targetCard: null,
      description:"",
      hostIdx:0,
      winners:[],
      players:[],
      createdAt: Date.now(),
      owner: Meteor.user().username,
      cards:info.cards[0],//arr of arr
      cardsOnDesk:[],
      cardsOnHand:info.cards[1],
      isOver: false
    });
  },

  "games.addPlayer"(name) {
    check(name, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    let res = Games.find({name:name}).fetch();
    let array = res[0].players;
    if (array.includes(Meteor.user().username)){
      return;
    }
    Games.update(
      {name: name}, 
      {$push:{players: Meteor.user().username}}
    );
    res = Games.find({name:name}).fetch();
    array = res[0].players;
    if (array.length === res[0].numberOfPlayers) {
      Games.update(
        {name: name}, 
        {$set :{okToJoin: false}}
      );
    }
  },

  "games.getPlayerIndex"(name) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    let res = Games.find({name:name}).fetch(); 
    let array = res["0"].players;//current Game players
    // console.log(res);
    // console.log("HELLO",array.indexOf(Meteor.user().username));
    return array.indexOf(Meteor.user().username);
  },

  "games.removePlayer"(name) {
    check(name, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    let res = Games.find({name:name}).fetch();
    let array = res[0].players;
    if (!array.includes(Meteor.user().username)){ //works!
      return;
    }
    Games.update(
      {name: name}, 
      {$pull: {players: Meteor.user().username}}
    );
    res = Games.find({name:name}).fetch();
    array = res[0].players;
    if (array.length === 0) {
      Games.remove({
        name: name
      });
    } else if (array.length < res[0].numberOfPlayers) {
      Games.update(
        {name: name}, 
        {$set :{okToJoin: true
        }}
      );
    }
    
  },

  "games.updateReady"(name) { //STAGE 0 -> 1 && STAGE 4 -> 1 (continue button)
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    let res = Games.find({name:name}).fetch();
    let array = res[0].count;
    if (array.includes(Meteor.user().username)){ //works!
      return;
    }
    Games.update ({
      name: name
    }, {
      $push:{count: Meteor.user().username}
    }); 
    //console.log(Games.find({name:name}).fetch());
    res = Games.find({name:name}).fetch();
    array = res[0].count;
    if (array.length >= res[0].numberOfPlayers){
      Games.update({
        name:name
      }, {
        $set:{
          stage: 1,
          count:[]
        }
      });
    }
  },

  "games.nextHost"(name) { //get called when STAGE 4 -> 1
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Games.update ({
      name: name
    }, {
      $push:{count: Meteor.user().username}
    });
    let res = Games.find({name:name}).fetch();
    let array = res[0].count;
    if (array.length >= res[0].numberOfPlayers){
      Games.update ({
        name: name
      }, {
        $inc:{
          hostIdx: 1
        },
        $set: {
          stage: 1,
          count:[]
        }
      }); 
    }
  },

  "games.updateAnswer"(info){ //STAGE 1 -> 2 
    check(info.game, String);
    check(info.card._id, String);//cardID
    check(info.card.url, String);
    check(info.description, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Games.update ({
      name: info.game
    }, {
      $set: {
        targetCard: info.card,
        description : info.description,
        stage:2
      }
    });
  },

  "games.addCardToDesk"(info) { // STAGE 2 -> 3
    check(info.game, String);
    check(info.card._id, String);//cardID
    check(info.card.url, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    let game = Games.find({name:info.game}).fetch();

    let index = info.playerIdx;
    let newCards = game[0].cards;
    let newPile = newCards[index];
    let newCard = newPile[0];
    Games.update ({
      name: info.game
    }, {
      $pull:{
        ["cardsOnHand."+index]: {_id:info.card._id},
        ["cards."+index]:{_id:newCard._id}
      }
    });
    Games.update ({
      name: info.game
    }, {
      $push:{
        cardsOnDesk: info.card,
        count: Meteor.user().username,
        ["cardsOnHand."+index]:newCard
      },
    });

    let res = Games.find({name:info.game}).fetch();
    let array = res[0].count;
    if (array.length >= res[0].numberOfPlayers){
      Games.update({
        name:info.game
      }, {
        $set:{
          stage: 3,
          count:[]
        }
      });
    }

    // let res = Games.find({name:name}).fetch();
    // let cards = res["0"].cardsOnDesk;

    // if (cards.length >= res["0"].numberOfPlayers){
    //   Games.update ({
    //     name: info.game
    //   }, {
    //     $set:{stage: 3}
    //   });
    // }
  },

  "games.updateWinners"(info) { // STAGE 3 -> 4
    check(info.game, String);
    check(info.card._id, String);//cardID
    check(info.card.url, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    let res = Games.find({name:info.game}).fetch();
    if (info.card._id === res[0].targetCard._id){
      Games.update ({  //TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CHECK DUPLICATE line 91-92
        name: info.game
      }, {
        $push:{winners: Meteor.user().username}
      });
    }
    Games.update ({
      name: info.game
    }, {
      $push:{count: Meteor.user().username}
    });
    res = Games.find({name:info.game}).fetch();
    let array = res[0].count;
    if (array.length >= res[0].numberOfPlayers - 1){
      if (res[0].hostIdx === res[0].numberOfPlayers - 1) {
        Games.update({
          name:info.game
        }, {
          $set:{
            isOver:true,
            stage:4,
            count:[],
            cardsOnDesk:[],
          }
        });
      } else {
        Games.update({
          name:info.game
        }, {
          $set:{
            stage: 4,
            count:[],
            cardsOnDesk:[],
          }
        });
      }
    }
  },
  // "games.over"(name){ //after final round 
  //   check(name, String);
  //   if (!this.userId) {
  //     throw new Meteor.Error("not-authorized");
  //   }
  //   Games.update ({
  //     name: name
  //   }, {
  //     $set: {
  //       isOver:true
  //     }
  //   });
  // },
});
