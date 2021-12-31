const mongoose = require('mongoose');
const bcrypt = rewuire('bcrypt');

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

let userSchema = mongoose.Schema( {
  username: {type: String, required: true},
  password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  Favorite_Movies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.valisatePassword = function(password) {
  return bcrypt.compareSync( password, this.Password );
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
