// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var PouchDB = require('pouchdb');
var port = process.env.PORT || 3300;        // set our port
//This is a dummy data should be normal db, right now just in memory
var db = new PouchDB('http://localhost:5984/tasklist');

var     data = [
    {
        "id" : "0",
        "task": "Make America great again",
        "expectedTime": "Two weeks00",
        "started": "2016-03-12",
        "expectedEnd": "2016-08-12"
    },
    {
        "id"  : "1",
        "task":"Save the world",
        "expectedTime":"Three weeks",
        "started": "2016-03-05",
        "expectedEnd": "2016-08-12"
    },
    {
        "id" : "2",
        "task":"Foo bar",
        "expectedTime":"Three weeks",
        "started": "2016-03-05",
        "expectedEnd": "2016-08-12"
    }
]



// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
router.get('/tasklist', function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    db.allDocs({include_docs: true, descending: true}, function(err, doc) {
        console.log(doc.rows);
        res.json(doc.rows);
    });
});

router.get('/tasks/:taskId', function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    //search in DB by ID
    console.log("GOT REQUEST");
    var id =req.params['taskId'];
    db.get(id).then(function(result) {
        res.send(result);
    }).catch (function(err){
        console.log(err);
    });

})
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
router.post('/tasks/add', function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    //search in DB by ID
    var task=req.body;
    db.post(task).then(function (doc) {
    }).catch(function (err) {
        console.log(err);
    });
    res.end();
})


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);


