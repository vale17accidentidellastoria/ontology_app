const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const recastai = require('recastai').default;

const port = 3030 | process.env.PORT;

var app = express();

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/', (req,res) => {
    res.send("OK");
})