// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express

var port = process.env.PORT || 3300;        // set our port
//This is a dummy data should be normal db, right now just in memory
var     data = [
    {
        "id" : "0",
        "task": "Make America great again",
        "time": "Two weeks00"
    },
    {
        "id"  : "1",
        "task":"Save the world",
        "time":"Three weeks"
    },
    {
        "id" : "2",
        "task":"Foo bar",
        "time":"Three weeks"
    }
]

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
router.get('/tasklist', function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  //  res.send("Hell World");
    res.json(data);
});

router.get('/tasks/:taskId', function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    //search in DB by ID
    console.log("GOT REQUEST");
    res.send(data[req.params['taskId']]);
})

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
