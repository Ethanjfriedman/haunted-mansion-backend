var express     = require('express'),
    app         = express(),
    MongoUrl    = 'mongodb://localhost:27017/haunted-mansion-react',
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    morgan      = require('morgan'),
    jwt         = require('jsonwebtoken'),
    config      = require('./config'),
    PORT        = process.env.PORT || 3000,
    api         = require('./app/controllers/Api')
    User        = require('./app/models/User');

    /************************
    ***** CONFIGURATION *****
    ************************/
mongoose.connect(MongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error'));

app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

/************************
******** ROUTES *********
************************/
app.get('/start', function(req, res) {
  res.send('Hello! the API is at http://localhost:' + PORT + '/api');
});

app.get('/setup', function(req, res) {

  //create sample user
  var ethan = new User({
    name: 'Ethan',
    password: 'password',
    admin: true
  });

  ethan.save(function(e) {
    if (e) {
      console.error.bind(console, 'error saving ethan');
    } else {
      res.json({success: true});
    }
  });
});

app.use('/api', api);


/************************
******** SERVER *********
************************/
db.once('open', function() {
  app.listen(PORT, function(err) {
    if (err) {
      console.error.bind(console, 'error starting server');
    } else {
      console.log('server up and running on port', PORT);
    }
  });
});
