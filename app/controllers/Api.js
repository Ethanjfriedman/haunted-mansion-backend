var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/User');
var config = require('../../config');

// TODO: route to authenticate a User
router.post('/authenticate', function(req, res) {
  User.findOne({name: req.body.name}, function(err, user) {
    if (err) {
      console.error.bind(console, "error looking up user " + req.body.name + " in db");
    } else if (!user) {
      res.json({success: false, message: "Authentication failed. User not found."});
    } else if (user) {
      if (user.password != req.body.password) {
        res.json({success: false, message: "Authentication failed. Wrong password."})
      } else {
        var token  = jwt.sign(user, config.secret, { expiresIn: "120m"});

        res.json({
          success: true,
          message: "Here's your authentication token!",
          token: token
        });
      }
    }
  });
});

// TODO: route middleware to verify a token (except on '/authenticate' above)
router.use('/', function(req, res, next) {
  //look for token in body, query, or headers
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        res.json({success: false, message: "Failed to authenticate token"});
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    //if no token return an error
    return res.status(403).send({success: false, message: 'No token provided.'});
  }
});

// route to show a general message
router.get('/', function(req, res) {
  res.json({
    routes: {
      authenticate: "TK",
      verify_token: "TK",
      this_message: "/api",
      view_all_users: "/api/users"
    }
  });
});

//route to return all users
router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      console.error.bind(console, "error finding users in db");;
    } else {
      res.json(users);
    }
  });
});

module.exports = router;
