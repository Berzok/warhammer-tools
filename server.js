// server.js
// where your node app starts

// init project
var express = require('express');
const fs = require('fs');


var app = express();




function writeToJson(key, data){
    var fileName = 'public/res/events.json';
    fs.readFile(fileName, function(error, originalContent){
        var file = JSON.parse(originalContent);
        file[key] = data;
        fs.writeFile(fileName, JSON.stringify(file, null, 2), function(){});
    });
    return 200;
}

function writeToFile(filepath, data){
    console.dir(filepath);
    fs.writeFile(filepath, data, null, function(){});
    return 200;
}


// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.




// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.static('public/js'));
app.use(express.static('public/res'));


// http://expressjs.com/en/starter/basic-routing.html
app.get('', function (request, response) {
    response.sendFile(__dirname + '/view' + request['url']);
});
app.get('/writeToJSON', function(request, response){
    response.sendStatus(writeToJson(request.query.key, request.query.data));
});
app.get('/writeToFile', function(request, response){
    console.dir('aaa');
    response.sendStatus(writeToFile(request.query.filepath, request.query.data));
});
app.get('/*+[^write][^.css]', function (request, response) {
    response.sendFile(__dirname + '/view' + request['url']);
});
app.get('/*[css]', function (request, response) {
    response.sendFile(__dirname + '/public/css' + request['url']);
});
app.get('/*.js', function (request, response) {
    response.sendFile(__dirname + '/public/js' + request['url']);
});


// listen for requests :)
var listener = app.listen(3000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});



var WebHelper = new function () {
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

