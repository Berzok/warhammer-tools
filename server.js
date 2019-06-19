// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.


const fs = require('fs');

export function read(){
    fs.readFile(filename, (err, data) => {
        if(err){
            throw err;
        }
        console.log(data.toString());
    })
}

export function function1() {
    console.log('f1')
}

export function function2() {
    console.log('f2')
}

export default read;




// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.static('public/js'));


// http://expressjs.com/en/starter/basic-routing.html
app.get('', function (request, response) {
    response.sendFile(__dirname + '/view' + request['url']);
});

app.get('/*+[^.][^c][^s][^s]', function (request, response) {
    response.sendFile(__dirname + '/view' + request['url']);
});
app.get('/*css', function (request, response) {
    response.sendFile(__dirname + '/public/css' + request['url']);
});
app.get('/*js', function (request, response) {
    response.sendFile(__dirname + 'public/js' + request['url']);
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


