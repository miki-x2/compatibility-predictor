import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { Button, Container, Col, Row } from 'react-bootstrap';
import _ from 'underscore';

// Main component of the application
// Includes the logic and React component for the UI
const Body = () => {
  // React hook to add a state variable to the upload component
  // Initial state is an empty array
  const [file, setFile] = useState([]);

  // Function to handle the file upload and extract the JSON data
  // FileReader allows web applications to read contents of files
  const handleUpload = (data) => {
    const fileRead = new FileReader();
    fileRead.readAsText(data.target.files[0], "UTF-8");

    // When the file is loaded, the JSON file is parsed
    // JSON.parse converts JSON string to an object
    // Then, the object is appended to the empty array
    fileRead.onload = (fileEvent) => {
      const jsonData = JSON.parse(fileEvent.target.result);
      setFile([...file, jsonData]);
    };
  };

  // Function that calculates the average attributes of a team
  // Returns an object of the average for each attributes of a team
  function calculateAverageAttributes(team) {
    const numTeam = team.length;
    const averageAttributes = {};

    // Iterate over each member of the team
    // to sum the value of each attribute of the team
    team.forEach(teamMember => {
      const attributes = teamMember.attributes;

      // Iterate over each attribute
      //
      // For each attribute, add the corresponding value to the
      // `averageAttribute` object
      //
      // If the attribute doesn't exist in the object yet,
      // initialize it to 0
      // Otherwise, retrieve current value and add the value
      // for the current team member
      Object.keys(attributes).forEach(attribute => {
        averageAttributes[attribute] = (averageAttributes[attribute] || 0) + attributes[attribute];
      });
    });

    // Iterate over each attribute of the team
    // Divide the sum by the team number
    // to get an average for each attribute
    Object.keys(averageAttributes).forEach(attribute => {
      averageAttributes[attribute] /= numTeam;
    });

    return averageAttributes;
  }

  // Function that calculates the compatibility between the team and each applicant
  // Returns the compatibility score for each applicant
  function calculateScore(teamAverageAttributes, applicantAttributes) {
    const numAttributes = Object.keys(applicantAttributes).length;
    let total = 0;

    // Iterate over each attribute of the applicant
    //
    // Retrieves the team average for each attribute
    // and calculates the compatibility score for each attribute
    //
    // The closer the applicant's attribute value to the team average,
    // the higher the compatibility score
    Object.keys(applicantAttributes).forEach(attribute => {
      const teamAverage = teamAverageAttributes[attribute];
      const applicantAttribute = applicantAttributes[attribute];
      const score = 1 - Math.abs((teamAverage - applicantAttribute) / 10 );
      total += score;
    });

    // Calculates average score
    return total / numAttributes;
  }

  // Function that calculates the compatibility score for all applicants
  // Formats the result to `name': (name), `score`: (score)
  function calculateCompatibility(file) {
    const team = file[0].team;
    const applicants = file[0].applicants;

    const averageTeamAttributes = calculateAverageAttributes(team);

    // Initialize result array
    const result = [];

    // Iterate over each applicant to calculate their compatibility score
    // Create an object containing their name and score
    // and push it to the `result` array
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

  // React hook to add a state variable to the button and link component
  const [showResult, setShowResult] = useState(false);
  const [link, setLink] = useState('');

  // Function that handles the button click to calculate the compatibility
  // If the uploaded JSON file is invalid, there is no output
  // The file must contain "team" and "applicant" keys
  const handleButtonClick = () => {
    if (file.length && file[0].team && file[0].applicants) {
      // Convert the results into a JSON file
      // Generate a download link
      const jsonString = JSON.stringify(calculateCompatibility(file));
      const blob = new Blob([jsonString], { type: 'application/json'});
      const setURl = URL.createObjectURL(blob);
      setLink(setURl);
      // Display the JSON on the screen
      setShowResult(!showResult);
    } else {
      // Nothing appears on the screen
      console.log("nothing");
    }
  }

  // UI components
  return(
    <Container className="text-center mt-2">
      <h1>
        Compatibility Predictor
      </h1>
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
          <>Results: {JSON.stringify(calculateCompatibility(file), null, 2)}</>}
      </Row>
      <Row>
        {showResult &&
        <a href={link} download="results.json">Download JSON File</a>}
      </Row>
    </Container>
  );
};

// Wrapper component
const CompatibilityPredictor = () => (
  <>
    <Body />
  </>
);

// Render main component to the root element
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CompatibilityPredictor />);