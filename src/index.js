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

// Allow use of node unirest API
var unirest = require('unirest');

// Global value for the unirest key
var unirestKey = "xLF0Y8EFkbmshJOu8uSJTegllCeDp1B0p7FjsnlEG5itY0wijC";


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
    "RecipeIntent": function (intent, session, response) {
        recipeHandler(intent, session, response);
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





function recipeHandler(intent, session, response){
  var speechOutput = "";
  var request = getRecipeRequest(intent, session, response);
  if (session.attributes.stage) {
    response.ask("Error in Recipe Handler");
  }else{
    var speechOutput = "";
    
    getRecipes(request, function(recipes) {
      for(var x = 0; x < 3; x++){
        speechOutput += (toString(x) + recipe[x].title.value + " ");
        //response.ask(toString(x) + recipe[x].title.value);
      }
    })
  speechOutput += "More?";
  response.ask(speechOutput);
  session.attributes.stage = 1;
  }
}

function recipeSelector(intent, session, response){
  if (session.attributes.stage){
    if (session.attributes.stage == 1){
      response.ask("Successfully reached stage 2");
      //if (response = 
    }
  }
}




function getRecipeRequest(intent, session, response){
    var foodSlot = intent.slots.Food,
        foodName;
    if (foodSlot && foodSlot.value){
        foodName = foodSlot.value.toLowerCase();
    }
    return(foodName)
}

// API functions

// Example of how to obtain a recipe given a keyword
/*
getRecipes(keyword, function(recipes) {
    var closestRecipe = recipes[0];
    console.log(closestRecipe);
})
*/


function getRecipes(keyword, callback){
    unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?query="+keyword)
    .header("X-Mashape-Key", unirestKey)
    .end(function (result) {
        callback(result.body.results);
    });
}

// Example of how to obtain the recipe information
/*
getRecipeInformation(156992, function (information) {
    var x = information;
    console.log(x);
});
*/

function getRecipeInformation(id, callback) {
    unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/"+id+"/information")
    .header("X-Mashape-Key", unirestKey)
    .end(function (result) {
      callback(result.body);
    });
}

// Example
/*
getRecipeIngredientsWithKeyword(keyword, function (recipeIngredients) {
    console.log(recipeIngredients);
});
*/

function getRecipeIngredientsWithKeyword(keyword, callback) {
    getRecipes(keyword, function(recipes) {
        var firstRecipeId = recipes[0].id;
        getRecipeInformation(firstRecipeId, function (information) {
            var recipeInformation = information;
            var recipeIngredients = recipeInformation.extendedIngredients;
            callback(recipeIngredients);
        });
    });
}

// Example
/*
getRecipeIngredientsWithId(156992, function (recipeIngredients) {
    console.log(recipeIngredients);
});
*/

function getRecipeIngredientsWithId(id, callback) {
    getRecipeInformation(id, function (information) {
        var recipeInformation = information;
        var recipeIngredients = recipeInformation.extendedIngredients;
        callback(recipeIngredients);
    });
}
