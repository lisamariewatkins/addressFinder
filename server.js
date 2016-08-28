// Include Server Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

//Require Click Schema
var Address = require('./models/address.js');

// Create Instance of Express
var app = express();
var PORT = process.env.PORT || 3000; // Sets an initial port. We'll use this later in our listener

// Run Morgan for Logging
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

app.use(express.static('./public'));

// -------------------------------------------------

// MongoDB Configuration configuration (Change this URL to your own DB)
var dbURI = 'mongodb://localhost/addressdb';

mongoose.connect(dbURI);
var db = mongoose.connection;

db.on('error', function (err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function () {
  console.log('Mongoose connection successful.');
});


// -------------------------------------------------

// Main Route. This route will redirect to our rendered React application
app.get('/', function(req, res){
  res.sendFile('./public/index.html');
})

// This is the route we will send GET requests to retrieve our most recent click data.
// We will call this route the moment our page gets rendered
app.get('/api/', function(req, res) {

  // This GET request will search for the latest clickCount
  Address.find({})
    .exec(function(err, doc){

      if(err){
        console.log(err);
      }
      else {
        res.send(doc);
      }
    })
});

app.post('/api/', function(req, res){
  var newAddress = new Address(req.body);
  console.log(req.body);

// DO WE NEED THIS ID?
  var search = req.body.search;
  var timestamp = parseInt(req.body.timestamp);

  // Note how this route utilizes the findOneAndUpdate function to update the clickCount.
  Address.findOneAndUpdate({"search": search}, {$set: {"search": search, "timestamp": timestamp}}, {upsert: true}).exec(function(err){

    if(err){
      console.log(err);
    }

    else{

      // change this to redirect to '/'
        res.send("Updated Address!");
    }
  });

});


// -------------------------------------------------

// Listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
