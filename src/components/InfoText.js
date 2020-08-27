import React from "react";
import { Col, Row } from "react-bootstrap";
class InfoText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div id="infotext" className="p-3">
        <h2>{this.props.item.title}</h2>
        <h4 style={{ width: "80%" }}>{this.props.item.text}</h4>
      </div>
    );
  }
}

export default InfoText;
