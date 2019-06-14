// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.static('public/js/common.js'));


// http://expressjs.com/en/starter/basic-routing.html
app.get('/*+[^.][^c][^s][^s]', function(request, response) {
  response.sendFile(__dirname + '/view' + request['url']);
});
app.get('/*css', function(request, response) {
  response.sendFile(__dirname + '/public/css' + request['url']);
});

// listen for requests :)
var listener = app.listen(54110, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});



var WebHelper = new function() {

  this.basepath = '';

  this.init = function init(basepath) {
    this.basepath = basepath;
  };

  /**
   *
   * @param {string} path
   * @returns {undefined}
   */
  this.getUrl = function getUrl(path) {
    if (path.charAt(0) === '/') {
      return this.basepath + path;
    } else {
      return document.URL + '/' + path;
    }
  };
};


