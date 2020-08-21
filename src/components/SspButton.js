import React from "react";
import { Col } from "react-bootstrap";
class SspButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Col
        md={2}
        className={
          this.props.active ? "p-1 m-2 sspButton sspActive" : "p-1 m-2 sspButton"
        }
        id={"sspButton_" + this.props.name}>
        <h4 style={{ margin: "auto" }}>{this.props.fullname}</h4>
      </Col>
    );
  }
}

export default SspButton;
