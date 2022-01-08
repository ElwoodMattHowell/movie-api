const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Create schema for movies
let movieSchema = mongoose.Schema( {
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    Name: String,
    Bio: String
  },
  Director: {
    Name: String,
    Bio: String,
    Birthday: Date,
    Death: Date
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
} );

//create schema for users
let userSchema = mongoose.Schema( {
  username: {type: String, required: true},
  password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  Favorite_Movies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

//Hash submitted passwords
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync( password, this.password );
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
