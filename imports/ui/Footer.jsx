import React, { Component } from "react";

let style = {
  borderTop: "1px solid #E7E7E7",
  marginTop: "50px",
  textAlign: "right",
  padding: "20px",
  width: "auto",
  left: "0",
  bottom: "0",
  height: "60px",
  fontFamily:"Gloria Hallelujah"
};

export default class Footer extends Component {
  render() {
    return <footer style={style}> <i className="far fa-heart"/> by MengBanana & YHuangxu <i className="far fa-heart"/></footer>;
  }
}
