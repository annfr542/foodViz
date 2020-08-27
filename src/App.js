import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Container } from "react-bootstrap";

import SuperChart from "./components/SuperChart";
import Footer from "./components/Footer";
import LeftInfo from "./components/LeftInfo";
import SspButton from "./components/SspButton";
import InfoText from "./components/InfoText";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        { name: 0, active: true, fullname: "Current" },
        { name: 1, active: true, fullname: "Sustainability" },
        { name: 2, active: false, fullname: "Middle Of The Road" },
        { name: 3, active: false, fullname: "Regional Rivalry" },
        { name: 4, active: false, fullname: "Inequality" },
        { name: 5, active: false, fullname: "Fossil-Fueled Development" },
      ],
      infoText: [
        {
          title: "Most vulnerable",
          text:
            "Low yields and increasing population: food demand consistently outweighs food supply.",
        },
        { title: "hej", text: "test" },
        { title: "hej", text: "test" },
        { title: "hej", text: "test" },
        { title: "hej", text: "test" },
      ],
      categorySelected: 0,
    };
  }

  updateButtons = (buttonName) => {
    let buttons = [...this.state.buttons];
    buttons[buttonName].active = !buttons[buttonName].active;
    this.setState({ buttons });
  };

  updateSelectCategory = (id) => {
    this.setState({ categorySelected: id });
  };

  render() {
    return (
      <Container className="p-0 h-100" fluid={true}>
        <Row className="p-0 m-0">
          <Col md={3}>
            <LeftInfo />
          </Col>
          <Col md={9} className="p-0 m-0">
            <Row className="p-2 m-0">
              <Col md={8} className="p-0 m-0" style={{ textAlign: "center" }}>
                <SuperChart
                  buttons={this.state.buttons}
                  updateState={this.updateSelectCategory}
                />
                <Row className="m-0 p-1 d-flex justify-content-center">
                  <h4>Future scenarios</h4>
                </Row>
                <Row className="m-0 p-1 d-flex justify-content-center">
                  {this.makeButtons()}
                </Row>
              </Col>
              <Col md={4} className="m-0 p-0 d-flex align-items-center">
                <InfoText item={this.state.infoText[this.state.categorySelected]} />
              </Col>
            </Row>
          </Col>
        </Row>

        <Footer></Footer>
      </Container>
    );
  }
  makeButtons = () => {
    return this.state.buttons.map((item) => {
      return (
        <SspButton
          updateButton={this.updateButtons}
          name={item.name}
          key={item.name}
          fullname={item.fullname}
          active={item.active}
        />
      );
    });
  };
}

export default App;
