import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Container } from "react-bootstrap";

import SuperChart from "./components/SuperChart";
import Footer from "./components/Footer";
import LeftInfo from "./components/LeftInfo";
import SspButton from "./components/SspButton";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        { name: "1", active: true, fullname: "Sustainability" },
        { name: "2", active: false, fullname: "Middle Of The Road" },
        { name: "3", active: false, fullname: "Regional Rivalry" },
        { name: "4", active: false, fullname: "Inequality" },
        { name: "5", active: false, fullname: "Fossil-Fueled Development" },
      ],
    };
  }
  render() {
    return (
      <Container className="p-0 h-100" fluid={true}>
        <Row className="p-0 m-0">
          <Col md={4}>
            <LeftInfo />
          </Col>
          <Col md={8} className="p-0 m-0">
            <Row className="m-0 p-3 d-flex justify-content-center">
              {this.makeButtons()}
            </Row>
            <Row className="m-0 p-3">
              <Col md={8} style={{ textAlign: "center" }}>
                <SuperChart />
              </Col>
              <Col md={4}>Infotext</Col>
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
