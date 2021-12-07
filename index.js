const express = require( 'express' ),
      morgan = require( 'morgan' ),
      app = express();

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
  },
];

app.use( morgan( 'common' ) );
app.use( express.static( 'public' ) );

//GET requests
app.get('/', ( req, res ) => {
  res.send( 'My all Time Top Ten List!' );
} );

app.get( '/documentation', ( req, res ) => {
  res.sendFile( 'public/documentation.html', { root: __dirname } );
} );

app.get( '/movies', ( req, res ) => {
  res.json( topTen );
} );

app.listen( 8080, () => {
  console.log( 'Your app is listening on port 8080' )
} );

app.use( ( err, req, res, next ) => {
  console.error( err.stack );
  res.status( 500 ).send( 'Something Broke!' )
} );
