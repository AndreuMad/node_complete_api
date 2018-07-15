const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const mongoDatabaseService = require('./db/mongoose');
const { databases } = require('./constants');

const app = express();

mongoDatabaseService.initialize(databases.nodeCompleteApiMongoDatabase);

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/', require('./features/router'));

module.exports = app;
