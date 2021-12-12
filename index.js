
const express = require( 'express' );
  // bodyParser = require( 'body-parser' ),
  // uuid = require( 'uuid' );

const app = express();

let topTen = [
    {
      title: 'Raiders of the Lost Ark',
      year: '1981',
      director: 'Steven Spielberg'
    },
    {
      title: 'Goonies',
      year: '1985',
      director: 'Richard Donner'
    },
    {
      title: 'This is Spinal Tap',
      year: '1984',
      director: 'Rob Reiner'
    },
    {
      title: 'The Big Lebowski',
      year: '1998',
      director: 'Joel and Ethan Cohen'
    },
    {
      title: 'Delicatessen',
      year: '1991',
      director: 'Jean-Pierre Jeunet and Marc Caro'
    },
    {
      title: 'Pan\'s Labrynth',
      year: '2006',
      director: 'Guillermo del Toro'
    },
    {
      title: 'Back to the Future',
      year: '1985',
      director: 'Robert Zemeckis'
    },
    {
      title: 'The Empire Strikes Back',
      year: '1980',
      director: 'George Lucas'
    },
    {
      title: 'The Court Jester',
      year: '1955',
      director: 'Melvin Frank and Norman Panama'
    },
    {
      title: 'The Dark Knight',
      year: '2008',
      director: 'Christopher Nolan'
    }
];

// app.use( bodyParser.json );
// app.use( morgan( 'common' ) );
// app.use( express.static( 'public' ) );

//GET requests
app.get('/', ( req, res ) => {
  res.status( 200 ).send( 'Welcome to myFlix!' );
} );

app.get( '/documentation', ( req, res ) => {
  res.sendFile( 'public/documentation.html', { root: __dirname } );
} );

app.get( '/movies', ( req, res ) => {
  res.json( topTen );
} );

app.get( '/movies/:title', ( req, res ) => {
  res.send( 'Information about specific movie' );
} );

app.get( '/genres/:genre_type', ( req, res ) => {
  res.send( 'Json of movies in genre' );
} );

app.get( '/directors', ( req, res ) => {
  res.send( 'Json of directors on list' );
} );

app.get( '/directors/:director_name', ( req, res ) => {
  res.send( 'Json of biography of specific director on list' );
} );

app.post( '/users', ( req, res ) => {
  res.send( 'Json of new user info with a unique ID number' );
} );

app.put( '/users/:username', ( req, res ) => {
  res.send( 'Json of updated user info' );
} );

app.get( '/users/:username/favorites', ( req, res ) => {
  res.send( 'Json of users list of favorite movies' );
} );

app.post( '/users/:username/favorites', ( req, res ) => {
  res.send( 'Movie succesfully added' );
} );

app.delete( '/users/:username/favorites', ( req, res ) => {
  res.send( 'Movie succesfully deleted' );
} );

app.delete( '/users/:username', ( req, res ) => {
  res.send( 'User succesfully deleted' );
} );

app.listen( 8080, () => {
  console.log( 'Your app is listening on port 8080' )
} );

app.use( ( err, req, res, next ) => {
  console.error( err.stack );
  res.status( 500 ).send( 'Something Broke!' )
} );
