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
    var speechOutput = "Welcome the Ramsay Kitchen Assistant";
    var repromptText = "You can ask for recipes";
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
        recipeIntentHelper(intent, session, response);
    },
    "IngredientIntent": function (intent, session, response) {
        listIngredients(intent, session, response);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("I know alot about food", "Just ask, what's in cookies");
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
        // Request the recipe using the API
    }

    getRecipeIngredientsWithKeyword(foodName, function (recipeIngredients) {
        if(recipeIngredients == undefined){
            response.tell("I'm sorry, I couldn't find what you are looking for");
        }
        var s = "You need ";
        for(var i = 0; i < recipeIngredients.length; i++){
          if(i == 0){
            s = s + recipeIngredients[i].name;
          }else if(i == recipeIngredients.length - 1){
            s = s + ", and " + recipeIngredients[i].name;
          }else{
            s = s + ", " + recipeIngredients[i].name;
          }
        }
        //respondWithRecipeCard(156992,s);
        response.tell(s);
    });
}

function recipeIntentHelper(intent, session, response) {
  // Get the food
  var foodSlot = intent.slots.Food,
  foodName;
  if (foodSlot && foodSlot.value){
      foodName = foodSlot.value.toLowerCase();
  }
  //Get the intolerance
  var intoleranceSlot = intent.slots.Intolerance,
  intolerance;
  if (intolerance && intoleranceSlot.value){
      intolerance = intoleranceSlot.value.toLowerCase();
  }

    getRecipes(foodName, intolerance, function (recipes) {
        if(recipes == undefined){
            response.tell("I'm sorry, I couldn't find what you are looking for");
        }
        // Pick a randome element of the recipes that are returned.
        var randomRecipe = recipes[Math.floor(Math.random()*recipes.length)];
        response.tell("I found " + randomRecipe.title);
    });
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
    getRecipes(keyword, undefined, function(results){
      callback(results)
    });
}

function getRecipes(keyword, intolerance, callback){
    var src = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?query="
    if (intolerance != undefined){
      src  = src + "intolerance=" + intolerance + "&"
    }
    src = src + keyword
    unirest.get(src)
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



function getRecipeImageWithID(id, callback) {
    getRecipeInformation(id, function (information) {
        var recipeInformation = information;
        var recipeImage = recipeInformation.image;
        callback(recipeImage);
    });
}

function getRecipeTitleWithID(id, callback) {
    getRecipeInformation(id, function (information) {
        var recipeInformation = information;
        var recipeImage = recipeInformation.title;
        callback(recipeTitle);
    });
}

function respondWithRecipeCard(id,response){
    var title;
    var image;
    getRecipeTitleWithID(id, function (recipeTitle) {
        title = recipeTitle;
    });
    getRecipeImageWithID(id, function (recipeImage) {
        image = recipeImage;
    });
    tellWithCard(response, recipeTitle, recipeImage);
}
