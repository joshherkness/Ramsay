/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var Unirest = require('unirest');
/**
 * Ramsay is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Ramsay = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Ramsay.prototype = Object.create(AlexaSkill.prototype);
Ramsay.prototype.constructor = Ramsay;

Ramsay.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Ramsay onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Ramsay.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Ramsay onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Alexa Skills Kit, you can say hello";
    var repromptText = "You can say hello";
    response.ask(speechOutput, repromptText);
};

Ramsay.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Ramsay onSessionEnded requestId: " + sessionEndedRequest.requestId
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

    var foodSlot = intent.slots.Food,
        foodName;
    if (foodSlot && foodSlot.value){
        foodName = foodSlot.value.toLowerCase();
    }

    // These code snippets use an open-source library. http://unirest.io/nodejs
    Unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?query=food")
    .header("X-Mashape-Key", "g3fzrsM903mshlzvwgOzJ6GP0eZWp1n3457jsnG9hMcKHyTZeW")
    .end(function (result) {
        var resultId = result.body.results[0].id.value;
        response.tell(resultId);
    });
};
