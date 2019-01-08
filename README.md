# Ontology App

This Node JS application takes in input an RDF Ontology about food and creates all the elements that will be put into a chatbot created using Recast.ai.

The Recast.ai chatbot is avaliable at this [link](https://recast.ai/vale17accidentidellastoria/ontology-app-bot/)

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
$ git clone https://github.com/vale17accidentidellastoria/ontology_app.git
$ cd ontology_app
$ npm install
$ node server.js
```

Your app should now be running on [localhost:3030](http://localhost:3030/).

## Running on Recast.ai using Ngrok

Make sure you have [Ngrok](https://ngrok.com) installed. While it is running it locally, do the following:

```sh
$ ngrok http 3030
````

Then copy the url to "Bot Builder" section in Recast.ai settings.

## Running on Recast.ai using Heroku

Now the Ontology App is avaliable on [Heroku](https://ontobot-server.herokuapp.com).

The url should be copied into "Bot Builder" section in Recast.ai settings.

## Telegram Connection

The Ontology Chatbot is now working also on [Telegram](http://t.me/ontobot_app_bot)
