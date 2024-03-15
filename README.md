# Compatibility Predictor

## Overview
Finding the right candidate that matches the team is a difficult task the Compatibility Predictor intends to solve. The Compatibility Predictor is an application that predicts the compatibility of applicants with an existing team by calculating a compatibility score for each applicant. 

## Features
* Users can upload a JSON file that takes an input array of applicants and team members
* The application calculates the average for each attribute of the team, compares it to the attribute value of each applicant, and calculates the final compatibility score
* The output is a JSON file, which is both displayed and downloadable via a generated link

## How It Works
* A JSON file containing an array of applicants and an array of team members is uploaded to the application
* The file is parsed and converted to an object, which is inserted to an array so that the program can execute functions
* The program contains 3 functions: calculateAverageAttributes, calculateScore, and calculateCompatibility
  * calculateAverageAttributes: Takes the team object and create an empty object that stores the team average value of each attribute. It iterates over the team members to sum each attribute value. Then it iterates over each summed attribute to calculate the average by dividing by the number of team members.
  * calculateScore: Takes the average team attributes and applicant attributes object to calculate the compatibility score of each applicant. It iterates over each attribute of the applicant to calculate the compatibility. The formula is: ```1-(abs(teamAverage - applicantAttribute) / 10)```. It takes the absolute value of the difference between the team average and the applicant's value. The absolute value ensures the value to be non-negative, and it is divided by 10 to make sure the score falls in a range from [0,1]. This is subtracted from 1 so that the smaller the difference, the higher the score, and vice versa. 
  * calculateCompatibility: Calculates the compatibility score for all applicants. It takes in the uploaded file, separates the team and applicants, and uses the two function above to calculate and store the compatibility score of each applicant in the desired JSON format.
* The result is displayed if the user clicks the button `Calculate Compatibility`. Also, a download link is generated so the user can download the JSON file that contains the results. This is done by using a React hook that handles the change in state when the button is clicked. 
* If the uploaded JSON file does not have "team" and "applicants" keys, there is no way the program can calculate the compatibility, and nothing is displayed when the button is clicked. 

## User Guide
1. Make sure to have Node >= 14.0 and npm >= 5.6 installed
2. Download a copy of [Compatibility Predictor](https://github.com/miki-x2/compatibility-predictor)
3. After downloading, cd into the my-app directory and run the system

   ``
   $ cd compatibility-predictor
   ``

   ``
   $ cd my-app
   ``

   ``
   $ npm start
   ``
4. If all goes well, the application will appear at http://localhost:3000