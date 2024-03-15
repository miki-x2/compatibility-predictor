import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { Button, Container, Col, Row } from 'react-bootstrap';
import _ from 'underscore';

const TopMenu = () => (
  <Container>
    <h1 className="text-center">
      Compatibility Predictor
    </h1>
  </Container>
);

const Body = () => {
  const [file, setFile] = useState([]);
  const handleUpload = (data) => {
    const fileRead = new FileReader();
    fileRead.readAsText(data.target.files[0], "UTF-8");
    fileRead.onload = (fileEvent) => {
      const jsonData = JSON.parse(fileEvent.target.result);
      setFile([...file, jsonData]);
    };
  };

  function calculateAverageAttributes(team) {
    const numTeam = team.length;
    const averageAttributes = {};

    team.forEach(teamMember => {
      const attributes = teamMember.attributes;

      Object.keys(attributes).forEach(attribute => {
        averageAttributes[attribute] = (averageAttributes[attribute] || 0) + attributes[attribute];
      });
    });

    Object.keys(averageAttributes).forEach(attribute => {
      averageAttributes[attribute] /= numTeam;
    });

    return averageAttributes;
  }

  function calculateScore(teamAverageAttributes, applicantAttributes) {
    const numAttributes = Object.keys(applicantAttributes).length;
    let total = 0;

    Object.keys(applicantAttributes).forEach(attribute => {
      const teamAverage = teamAverageAttributes[attribute];
      const applicantAttribute = applicantAttributes[attribute];
      const score = 1 - Math.abs((teamAverage - applicantAttribute) / 10 );
      total += score;
    });

    return total / numAttributes;
  }
  function calculateCompatability(file) {
    const team = file[0].team;
    const applicants = file[0].applicants;
    const teamNum = team.length;

    const averageTeamAttributes = calculateAverageAttributes(team);

    const result = [];

    _.each(applicants, applicant => {
      const applicantAttributes = applicant.attributes;
      const score = calculateScore(averageTeamAttributes, applicantAttributes);

      result.push({
        name: applicant.name,
        score: score
      });
    });
    return result;
  }

  // sanity check
  if (file.length && file[0].team && file[0].applicants) {
    console.log(calculateCompatability(file));
  } else {
    console.log("nothing");
  }


  const [showResult, setShowResult] = useState(false);
  const [link, setLink] = useState('');
  const handleButtonClick = () => {
    if (file.length && file[0].team && file[0].applicants) {
      const jsonString = JSON.stringify(calculateCompatability(file));
      const blob = new Blob([jsonString], { type: 'application/json'});
      const setURl = URL.createObjectURL(blob);
      setLink(setURl);
      setShowResult(!showResult);
    } else {
      console.log("nothing");
    }
  }





  return(
    <Container className="text-center mt-2">
      <h4 className="mb-3">
        Upload JSON file:
      </h4>
      <Row className="justify-content-center mb-3">
        <Col xs="auto">
          <input type="file" className="form-control-file" onChange={handleUpload} />
        </Col>
        <Col xs="auto">
          <Button onClick={handleButtonClick}>Calculate Compatibility</Button>
        </Col>
      </Row>
      <Row>
        {showResult &&
          <>Results: {JSON.stringify(calculateCompatability(file), null, 2)}</>}
      </Row>
      <Row>
        {showResult &&
        <a href={link} download="results.json">Download JSON File</a>}
      </Row>
    </Container>
  );
};

const CompatabilityPredictor = () => (
  <>
    <TopMenu />
    <Body />
  </>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CompatabilityPredictor />);