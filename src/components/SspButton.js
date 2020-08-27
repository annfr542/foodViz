import React from "react";
import { Col, Row } from "react-bootstrap";
class SspButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Col>
        <Row className="d-flex justify-content-center">
          <Col
            md={2}
            onClick={() => this.props.updateButton(this.props.name)}
            className={this.props.active ? "p-1  sspButton sspActive" : "p-1  sspButton"}
            id={"sspButton_" + this.props.name}></Col>
          <Col className="m-0 p-0">
            <h5>{this.props.fullname}</h5>
          </Col>
        </Row>
      </Col>
    );
  }
}

export default SspButton;
