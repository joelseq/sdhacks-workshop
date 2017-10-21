# SD Hacks WebDev Workshop Starter Code

## Code Snippets

### Get all posts

```js
// Find all the documents
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
``` 

### Create a new post

```js
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
```


### Get a single post
 
```js
db.get(req.params.id, function(error, found) {
    if(error) {
      console.log(error);
      res.redirect('/');
    } else {
      res.render('show-post', { post: found });
    }
  });
```

### Edit a post

```js
db.get(req.params.id, function(error, found) {
  if(error) {
    console.log(error);
    res.redirect('/');
  } else {
    res.render('edit-post', { post: found });
  }
});
```

### Update a post

```js
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
```

### Delete a post

```js
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
```
