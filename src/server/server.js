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
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var router = express.Router();              // get an instance of the express Router
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// ROUTES FOR OUR API
// =============================================================================
// Get all tasks
router.get('/tasklist', function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    db.allDocs({include_docs: true, descending: true}, function(err, doc) {
        res.json(doc.rows);
    });
});
//Get task info
router.get('/tasks/:taskId', function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    //search in DB by ID
    var id =req.params['taskId'];
    db.get(id).then(function(result) {
        res.send(result);
    }).catch (function(err){
        console.log(err);
    });

})

//Add task
router.post('/tasks/add', function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    //search in DB by ID
    var task=req.body;
    var returnDoc=null;
    if(task._id==''){
        task._id=new Date().getTime() + ''+Math.floor(Math.random()*1000);
    }

    db.get(task._id)
    .then(function(doc) {
      //get all properties from task and put them to doc
      db.put({
          _id: doc._id,
          _rev: doc._rev,
          task: task.task,
          started: task.started,
          expectedEnd: task.expectedEnd,
          comment: task.comment
      }).then(function(response){
          res.send(response)
       }).catch(function (err){
          res.end();
        });
    }).catch(function (err) {
        if(err.status=='404') {
            db.put({
                    _id:task._id,
                    task: task.task,
                    started: task.started,
                    expectedEnd: task.expectedEnd,
                    comment: task.comment
            }
            ).then(function(response){
                res.send(response)
            }).catch(function(err){
                res.end;
            })
        }
    });
})

//delete task
router.post('/task/delete',function(req,res){
    console.log("DELETE");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    //search in DB by ID
    var task=req.body;
    db.get(task._id)
        .then(function (doc) {
            return db.remove(doc);
        });
    res.end();
})



console.log('Magic happens on port ' + port);
// START THE SERVER
// =============================================================================
app.listen(port);

