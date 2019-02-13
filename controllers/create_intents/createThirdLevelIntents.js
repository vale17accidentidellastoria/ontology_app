const request = require('superagent');

const DEVELOPER_TOKEN = '64fbecbbb579e6db484aba871a439338';
const USER_SLUG = 'vale17accidentidellastoria';
const BOT_SLUG = 'ontology-app-bot';

function createThirdLevelIntent(intent_values) {
    console.log("Create Third Level Intent");
    request
    .post(`https://api.recast.ai/train/v2/users/${USER_SLUG}/bots/${BOT_SLUG}/versions/v1/dataset/intents`)
    .send({
        name: "third_level_namedinds",
        description: "",
        expressions: intent_values
    })
    .set('Authorization', `Token ${DEVELOPER_TOKEN}`)
    .end((err, res) => console.log(res.text));
}

module.exports = createThirdLevelIntent;