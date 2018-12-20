const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const recastai = require('recastai').default;

const PORT = process.env.PORT || 3030;

var app = express();

app.listen(PORT, () => {
    console.log(`Listening on port ${ PORT }`);
});

app.get('/', (req,res) => {
    res.send("OK");
})