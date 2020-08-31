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
        { title: "All Countries", text: "Select a category for more information" },
        { title: "Greatest concern", text: "Select a category for more information" },
        {
          title: "Most vulnerable",
          text:
            "Low yields and increasing population: food demand consistently outweighs food supply.",
        },
        {
          title: "Newly vulnerable",
          text:
            "Large population growth or an initial low sufficiency, combined with a decline in sufficiency leads these countries to become more vulnerable.",
        },
        {
          title: "Currently trade driven",
          text: "Select a category for more information",
        },
        {
          title: "Exporters",
          text:
            "World food exporters’ caloric sufficiencies are declining while more countries are depending on them.",
        },
        {
          title: "Importers",
          text:
            "These countries depend on exporters. Importers’ sufficiencies are low to begin with and decrease or remain low.",
        },
        { title: "Mild concern", text: "Select a category for more information" },
        {
          title: "Vulnerable but improving",
          text:
            "Few countries with low sufficiency are improving, thanks to cropland and/or productivity increase while population stagnates",
        },
        {
          title: "Decreasing but not as vulnerable",
          text:
            "Many (mostly European) countries with higher income and food security see their caloric sufficiency decrease. More concerning, a few countries in Africa and SE Asia have declining sufficiencies, though it is variable across scenarios.",
        },
        {
          title: "Highly variable",
          text:
            "High variability across scenarios suggest sensitivity to their differences (but finer modeling would be required to draw policy-relevant insights).",
        },
        { title: "Improving", text: "Select a category for more information" },
        {
          title: "Increasing sufficiency",
          text:
            "Cropland projected to increase, leading to caloric sufficiency increase. However, scenarios’ cropland expansion assumptions may be debatable and these results do not account for water scarcity.",
        },
      ],
      categorySelected: 0,
    };
  }

  updateButtons = (buttonName) => {
    let buttons = [...this.state.buttons];
    buttons[buttonName].active = !buttons[buttonName].active;
    this.setState({ buttons });
  };

  updateSelectCategory = (name) => {
    switch (name) {
      case "Greatest concern":
        this.setState({ categorySelected: 1 });
        break;
      case "Most vulnerable":
        this.setState({ categorySelected: 2 });
        break;
      case "Newly vulnerable":
        this.setState({ categorySelected: 3 });
        break;
      case "Currently trade driven":
        this.setState({ categorySelected: 4 });
        break;
      case "Exporters":
        this.setState({ categorySelected: 5 });
        break;
      case "Importers":
        this.setState({ categorySelected: 6 });
        break;
      case "Mild concern":
        this.setState({ categorySelected: 7 });
        break;
      case "Vulnerable but improving":
        this.setState({ categorySelected: 8 });
        break;
      case "Decreasing but not as vulnerable":
        this.setState({ categorySelected: 9 });
        break;
      case "Highly variable":
        this.setState({ categorySelected: 10 });
        break;
      case "Improving":
        this.setState({ categorySelected: 11 });
        break;
      case "Increasing sufficiency":
        this.setState({ categorySelected: 12 });
        break;
      default:
        this.setState({ categorySelected: 0 });
    }
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
