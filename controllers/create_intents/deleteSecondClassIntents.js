const request = require('superagent');

const createIntent = require("./createSecondClassIntents");

const DEVELOPER_TOKEN = '64fbecbbb579e6db484aba871a439338';
const USER_SLUG = 'vale17accidentidellastoria';
const BOT_SLUG = 'ontology-app-bot';

//var reg = /\-^\d+$/;
const intent_name = "second_classes_intent"

function deleteFirstClassIntent(intent_values) {
    console.log("Delete Second Class Intent");
    request
    .delete(`https://api.recast.ai/train/v2/users/${USER_SLUG}/bots/${BOT_SLUG}/versions/$VERSION_SLUG/dataset/intents/${intent_name}`)
    .send()
    .set('Authorization', `Token ${DEVELOPER_TOKEN}`)
    .end((err, res) => {
        //After deleting the First Class Intents if they existed, we create again the First Class Intents
        createIntent(intent_values);
    });
}

module.exports = deleteFirstClassIntent;