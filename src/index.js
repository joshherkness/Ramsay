/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
        http://aws.amazon.com/apache2.0/
    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Greeter to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * Import the Unirest module
 */
var unirest = require('unirest');

/**
  * Instance Variables
 */

 var current_recipe = null;

 /**
 * Ramsay is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 */
var Ramsay = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Ramsay.prototype = Object.create(AlexaSkill.prototype);
Ramsay.prototype.constructor = Ramsay;

Ramsay.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HelloWorld onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Ramsay.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("HelloWorld onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Alexa Skills Kit, you can say hello";
    var repromptText = "You can say hello";
    response.ask(speechOutput, repromptText);
};

Ramsay.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("HelloWorld onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Ramsay.prototype.intentHandlers = {
    // register custom intent handlers
    "RamsayIntent": function (intent, session, response) {
        listIngredients(intent, session, response);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say hello to me!", "You can say hello to me!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Ramsay skill.
    var ramsay = new Ramsay();
    ramsay.execute(event, context);
};

function listIngredients(intent, session, response){

  // Get the food
  var foodSlot = intent.slots.Food,
      foodName;
  if (foodSlot && foodSlot.value){
      foodName = foodSlot.value.toLowerCase();
      response.tell("you said " + foodName);

      // Request the recipe using the API
      
  }

function whatCanIMake(intent, session, response){

  // Get the food
  var foodSlot = intent.slots.Food,
      foodName;
  if (foodSlot && foodSlot.value){
      foodName = foodSlot.value.toLowerCase();
      response.tell("you said " + foodName);

      // Request recipies using the API
      
  }
};
