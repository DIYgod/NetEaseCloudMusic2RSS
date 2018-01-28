var express = require('express');
var logger = require('./tools/logger');

logger.info(`🍻 NetEaseCloudMusic2RSS start! Cheers!`);

var app = express();
app.all('*', require('./routes/all'));
app.get('/playlist/:id', require('./routes/playlist'));
app.listen(1202);