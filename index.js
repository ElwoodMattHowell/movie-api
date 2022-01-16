const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

// mongoose connection for local testing
// mongoose.connect('mongodb://127.0.0.1:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true} );

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('common'));
app.use(express.static('public'));

const cors = require('cors');
app.use(cors());

// let allowedOrigins = ['hhtp://127.0.0.1:8080', '*'];
//
// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){
//       let message = 'The CORS policy for this applicaiton doesn\'t allow access from origin' + origin;
//       return callback( new Error( message ), false);
//     }
//     return callback(null, true);
//   }
// }));

const { check, validationResult } = require('express-validator');

auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport.js');

// GET request.  Path is '/' response is Welcome message
app.get('/', (req, res) => {
  res.status(200).send('Welcome to myFlix!');
});

// GET request.  Path is '/documentation'.  Response is documentation.html page
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

// Get request.  Path is '/movies'.  Response is a list of all movies
app.get('/movies',
  // passport.authenticate('jwt', {
  //   session: false
  // }), 
  function (req, res) => {
  Movies.find().then((movies) => {
    res.status(201).json(movies);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
//GET request.  Path is '/movies/'movie title'.  Response is an array of all movie info in json format.
app.get('/movies/:Title', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.findOne({ Title: req.params.Title }).then((movie) => {
    res.json(movie);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
}
);

//GET request.  Path is '/genres/'name of genre'.  Response is json containing genre name and description.
app.get('/genres/:Genre', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.Genre }).then((movies) => {
    res.json(movies.Genre);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
}
);

//GET request.  Path is /directors/'director name'.  Response is json containing director name, bio and birth year
app.get('/directors/:Director', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.findOne({ "Director.Name": req.params.Director }).then((director) => {
    res.json(director.Director);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
}
);

//POST request.  Path is /users.  Response is json of user info and a bearer token.  Uses express-validator
//to verify username is non-empty and alphanumeric, password is non-empty and email is in email format
app.post('/users', [
  check('username', 'Username is required.').not().isEmpty(),
  check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('password', 'Password is required.').not().isEmpty(),
  check('Email', 'Email does not appear to be valid.').isEmail()

], (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  //hashes password
  let hashedPassword = Users.hashPassword(req.body.password);
  Users.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      return res.status(400).send(req.body.username + ' already exists');
    } else {
      Users.create({
        username: req.body.username,
        password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }).then((user) => {
        res.status(201).json(user)
      }).catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//GET request.  Path /users.  Returns array of jsons of user info.
app.get('/users', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.find().then((users) => {
    res.status(201).json(users);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//GET request.  Path /users/username.  Returns json of specific user info.
app.get('/users/:username', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOne({ username: req.params.username }).then((user) => {
    res.json(user);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
}
);

//PUT request.  Path /users.username.  Allows users to update user information.  Returns
//json of updasted user info.
app.put('/users/:username', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username }, {
    $set: {
      username: req.body.username,
      password: req.body.password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
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

//Post request.  Path /users/'username'/movies/'MovieID'.  Allows users to add a movie to their list of
//favorites.  Returns a json of user info.
app.post('/users/:username/movies/:MovieId', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndUpdate({
    username: req.params.username
  },
    {
      $push: { Favorite_Movies: req.params.MovieId }

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

//DELETE request.  Path /users/'username'/movies/'MovieID'.  Allows users to delete a movie to their list of
//favorites.  Returns a json of user info.
app.delete('/users/:username/movies/:MovieId', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndUpdate({
    username: req.params.username
  },
    {
      $pull: { Favorite_Movies: req.params.MovieId }
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

//DELETE request.  Path /users/'username'.  Allows user to delete themselves from database.
app.delete('/users/:username', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndRemove({
    username: req.params.username
  }).then((user) => {
    if (!user) {
      res.status(400).send(req.params.username + ' was not found.');
    } else {
      res.status(200).send(req.params.username + ' was deleted.');
    }
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});

//Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something Broke!')
});
