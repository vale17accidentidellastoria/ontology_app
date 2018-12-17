# Ontology App

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
$ git clone https://github.com/vale17accidentidellastoria/ontology_app.git
$ cd ontology_app
$ npm install
$ npm start
```

Your app should now be running on [localhost:3030](http://localhost:3030/).

## Running on Recast.ai

Make sure you have [Ngrok](https://ngrok.com) installed. While it is running it locally, do the following:

```sh
$ ngrok http 3030
````

Then copy the url to "Bot Builder" section in Recast.ai settings.
