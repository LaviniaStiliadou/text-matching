var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var textmatcher = require("./textmatcher.js");

var app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


app.route('/api/hello').get((req, res) => {
	console.log('got request!');
    res.send("Hello World");
});

//expects object {input: string, algodata: algorithmdata}
app.route('/api/matcher').post((req, res) => {
	console.log('got post matching request!');
	var result = textmatcher(req.body, false, false);
	res.status(201).send(result);
});

app.route('/api/matcher/rake').post((req, res) => {
	console.log('got post matching request!');
	var result = textmatcher(req.body, true, false);
	res.status(201).send(result);
});

app.route('/api/matcher/openai').post((req, res) => {
	console.log('got post matching request!');
	textmatcher(req.body, false, true).then(result => {
		res.status(201).send(result);
	});
});

app.route('/api/matcher/rake/openai').post((req, res) => {
	console.log('got post matching request!');
	textmatcher(req.body, true, true).then(result => {
		res.status(201).send(result);
	});
});

app.listen(1985, () => {
  console.log('Server started!');
});
