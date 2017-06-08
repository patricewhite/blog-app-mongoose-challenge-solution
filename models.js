'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


mongoose.Promise = global.Promise;
const blogPostSchema = mongoose.Schema({
  author: {
    firstName: String,
    lastName: String
  },
  title: {type: String, required: true},
  content: {type: String},
  created: {type: Date, default: Date.now}
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type:String,
    required: true
  },
  lastName: {
    type:String,
    required: true
  }
});

UserSchema.methods.apiRepr = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

UserSchema.methods.validatePassword = function(password, callback){
  bcrypt.compare(password, this.password, function(err, isValid){
    if(err) {
      callback(err);
      return;
    }
    callback(null, isValid);
  });
};

UserSchema.static.hashPassword = function(password){
  return bcrypt.hash(password, 10);
};

blogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    created: this.created
  };
};

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
const User = mongoose.model('User', UserSchema);

module.exports = {BlogPost, User};
