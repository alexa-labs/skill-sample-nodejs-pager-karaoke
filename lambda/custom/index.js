/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the Pager Karaoke Device skill! You can say, show me pager, show me karaoke, or show me device information!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Office Hours', speechText)
      .getResponse();
  },
};

const PagerIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PagerIntent';
  },
  handle(handlerInput) {
    const speechText = 'This is the pager template!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: 'pagerToken',
        version: '1.0',
        document: require('./pager.json'),
        datasources: {
            "pagerTemplateData": {
                "type": "object",
                "properties": {
                    "hintString" : "try the blue cheese!"
                },
                "transformers": [
                    {
                        "inputPath": "hintString",
                        "transformer": "textToHint"
                    }
                ]
            }
        }
      })
      .addDirective({
        type: 'Alexa.Presentation.APL.ExecuteCommands',
        token: 'pagerToken',
        commands: [
          {
            type: 'AutoPage',
            componentId: 'pagerComponentId',
            "duration": 5000
          }
        ]
      })
      .getResponse();
  },
};

const KaraokeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'KaraokeIntent';
  },
  handle(handlerInput) {
    const speechText = 'This is the karaoke template!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: 'karaokeToken',
        version: '1.0',
        document: require('./karaoke.json'),
        datasources: {
            "karaokeTemplateData": {
                "type": "object",
                "objectId": "karaokeSample",
                "properties": {
                    "karaokeSsml": "<speak>We’re excited to announce a new video training series from A Cloud Guru on Alexa skill development. The free training series called Alexa Devs walks new developers and non-developers through how to build Alexa skills from start to finish. You’ll also learn how to enhance your skill using persistence, Speechcons, and SSML to create more engaging voice experiences for customers. Check out the first episode on how to build your first Alexa skill here.</speak>",
                    "hintString" : "try the blue cheese!"
                },
                "transformers": [
                    {
                        "inputPath": "karaokeSsml",
                        "outputName": "karaokeSpeech",
                        "transformer": "ssmlToSpeech"
                    },
                    {
                        "inputPath": "karaokeSsml",
                        "outputName": "karaokeText",
                        "transformer": "ssmlToText"
                    },
                    {
                        "inputPath": "hintString",
                        "transformer": "textToHint"
                    }
                ]
            }
        } 
      })
      .addDirective({
        type: 'Alexa.Presentation.APL.ExecuteCommands',
        token: 'karaokeToken',
        commands: [
          {
            type: 'SpeakItem',
            componentId: 'karaokespeechtext',
            highlightMode: 'line'
          }
        ]
      })
      .getResponse();
  },
};

const DeviceIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'DeviceIntent';
  },
  handle(handlerInput) {
    const viewportProfile = Alexa.getViewportProfile(handlerInput.requestEnvelope);

    let speechText = "This device is a ";

    switch(viewportProfile) {
      case "HUB-LANDSCAPE-LARGE":
        speechText += "hub landscape large";
        break;
      case "HUB-LANDSCAPE-MEDIUM": 
        speechText += "hub landscape medium";
        break;
      case "HUB-ROUND-SMALL":
        speechText += "hub round small";
        break;
      case "TV-LANDSCAPE-XLARGE":
        speechText += "tv landscape extra large";
        break;
      case "MOBILE-LANDSCAPE-SMALL":
        speechText += "mobile landscape small";
        break;
      default:
        speechText += "echo device!";
        break;
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.0',
        document: require('./devices.json'),
        datasources: {
            "deviceTemplateData": {
                "type": "object",
                "objectId": "deviceSample",
                "properties": {
                    "deviceName": viewportProfile,
                    "hintString" : "try and buy more devices!"
                },
                "transformers": [
                    {
                        "inputPath": "hintString",
                        "transformer": "textToHint"
                    }
                ]
            }
        } 
      })
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    PagerIntentHandler,
    DeviceIntentHandler,
    KaraokeIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
