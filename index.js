var port = process.env.PORT || 3000;
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser());

app.listen(port);
console.log('server listening on', port);
