import React from "react";
import { Col } from "react-bootstrap";
class LeftInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Col className="p-3 m-0">
        <h1 className="m-2">Future Food Sufficiency</h1>
        <h4 className="m-2">
          Producing sufficient food to meet rising demand is a precondition to food
          security. We show the future caloric sufficiency considering population growth,
          diets, and production driven by climate, agricultural management, and cropland
          expansion under five combined climate change and socio-economic scenarios.
          <br />
          <br />
          <br />
          The graph shows that global caloric sufficiency is likely to decrease, despite
          increased food production, because those gains are outweighed by population
          growth and higher animal products consumption. At a national scale, caloric
          sufficiency decreases consistently for most countries, the majority of the
          countries facing hunger today remain vulnerable, and around 25 countries, mostly
          in Africa, become more vulnerable.
        </h4>
      </Col>
    );
  }
}

export default LeftInfo;
