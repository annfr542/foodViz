import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Footer() {
  return (
    <footer>
      <Container fluid={true} className={"fixed-top position-absolute"}>
        <Row
          className="p-0 bg-nav"
          style={{ height: "3vh", paddingRight: " 0.5vh 1rem" }}>
          <Col className="d-flex justify-content-end">
            <p className="font-italic p-0 m-0 text-white" style={{ fontSize: "0.8rem" }}>
              Created by: Anna Häägg
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
