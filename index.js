const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://127.0.0.1:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true} );

const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require('morgan');
// const uuid = require( 'uuid' );

const app = express();

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded( {extended: true }));
//
app.use( morgan( 'common' ) );
app.use( express.static( 'public' ) );

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// GET requests
app.get('/', ( req, res ) => {
  res.status( 200 ).send( 'Welcome to myFlix!' );
} );

app.get( '/documentation', ( req, res ) => {
  res.sendFile( 'public/documentation.html', { root: __dirname } );
} );

app.get('/movies', (req, res) => {
  Movies.find().then((movies) => {
    res.status(201).json(movies);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get( '/movies/:Title', (req, res) => {
  Movies.findOne( { Title: req.params.Title } ).then((movie) => {
    res.json(movie);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
  }
);

app.get( '/genres/:Genre', (req, res) => {
  Movies.findOne( { "Genre.Name" : req.params.Genre} ).then((movies) => {
    res.json(movies.Genre);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
  }
);

app.get( '/directors/:Director', (req, res) => {
  Movies.findOne( { "Director.Name" : req.params.Director} ).then((director) => {
    res.json(director.Director);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
  }
);

app.post( '/users', ( req, res ) => {
  Users.findOne( { username: req.body.username } ).then((user) => {
    if (user) {
      return res.status(400).send(req.body.username + ' already exists');
    } else {
      Users.create ( {
        username: req.body.username,
        password: req.body.password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }).then ((user) => {
        res.status(201).json(user)
      } ).catch ((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  } ).catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

app.get('/users', (req, res) => {
  Users.find().then((users) => {
    res.status(201).json(users);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get( '/users/:username', (req, res) => {
  Users.findOne( { username: req.params.username } ).then((user) => {
    res.json(user);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
  }
);

app.put('/users/:username', (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username}, {
    $set: {
      username: req.body.username,
      password: req.body.password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  {new: true},
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.post('/users/:username/movies/:MovieId', (req, res) => {
  Users.findOneAndUpdate( {
    username: req.params.username
  },
  {
    $push: {Favorite_Movies: req.params.MovieId }

  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
  } else {
    res.json(updatedUser);
  }
});
});

app.delete('/users/:username/movies/:MovieId', (req, res) => {
  Users.findOneAndUpdate( {
    username: req.params.username
  },
    {
      $pull: {Favorite_Movies: req.params.MovieId}
    },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
  } else {
    res.json(updatedUser);
  }
});
});

app.delete('/users/:username', (req, res) => {
  Users.findOneAndRemove ( {
    username: req.params.username
  } ).then ((user) => {
    if(!user) {
      res.status(400).send(req.params.username + ' was not found.');
    } else {
      res.status(200).send(req.params.username + ' was deleted.');
    }
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.listen( 8080, () => {
  console.log( 'Your app is listening on port 8080' )
} );

app.use( ( err, req, res, next ) => {
  console.error( err.stack );
  res.status( 500 ).send( 'Something Broke!' )
} );
