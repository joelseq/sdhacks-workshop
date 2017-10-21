const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const PouchDB = require('pouchdb');
const methodOverride = require('method-override');

// Set the port to listen to requests on
const PORT = process.env.PORT || 8080;

// Create the app
const app = express();

// Create the database
const db = new PouchDB('blog');

// =========================
// App Configs
// =========================
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// =======================================================================
// RESTful Routes
// HTTP Verbs: GET, POST, PUT, DELETE
//
// Name     |   Path      |   HTTP Verb |   Purpose
// =======================================================================
// Index    |   /         |   GET       | List all the posts
// New      |   /new      |   GET       | Show a form to create new posts
// Create   |   /         |   POST      | Create a new post
// Show     |   /:id      |   GET       | Show a single post
// Edit     |   /:id/edit |   GET       | Show a form to edit a post
// Update   |   /:id      |   PUT       | Update a particular post
// Destroy  |   /:id      |   DELETE    | Delete a particular post
// =======================================================================
app.get('/', (req, res) => {
  db.allDocs({
    include_docs: true,
    attachments: true
  }, function(error, result) {
    if(error) {
      console.log(error);
    } else {
      res.render('posts', { posts: result.rows });
    }
  });
});

app.get('/new', (req, res) => {
  res.render('new-post');
});

app.post('/', (req, res) => {
  var toSave = {
    title: req.body.title,
    post: req.body.post
  };
  
  db.post(toSave, function(error, posted) {
    if(error) {
      console.log(error);
    } else {
      console.log(posted);
    }
    res.redirect('/');
  });
});

app.get('/:id', (req, res) => {
  db.get(req.params.id, function(error, found) {
    if(error) {
      console.log(error);
      res.redirect('/');
    } else {
      res.render('show-post', { post: found });
    }
  });
});

app.get('/:id/edit', (req, res) => {
  db.get(req.params.id, function(error, found) {
    if(error) {
      console.log(error);
      res.redirect('/');
    } else {
      res.render('edit-post', { post: found });
    }
  });
});

app.put('/:id', (req, res) => {
  var toSave = {
    title: req.body.title,
    post: req.body.post
  };
  
  db.get(req.params.id, function(error, found) {
    if(error) {
      console.log(error);
      res.redirect('/');
    } else {
      db.put({
        _id: found._id,
        _rev: found._rev,
        title: req.body.title,
        post: req.body.post
      }, function(error, saved) {
        if(error) {
          console.log(error);
        }
        res.redirect('/');
      });
    }
  });
});

app.delete('/:id', (req, res) => {
  db.get(req.params.id, function(err, found) {
    if(err) {
      console.log(err);
      res.redirect('/');
    } else {
      db.remove(found, function(err, removed) {
        if(err) {
          console.log(err);
          res.redirect('/');
        } else {
          res.redirect('/');
        }
      });
    }
  });
});

// Listen for requests
app.listen(PORT, () => {
  console.log('Server running on Port:', PORT);
});
