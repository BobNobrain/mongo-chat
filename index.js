let express = require('express');
let path = require('path');
let app = express();

// middleware
let logger = require('morgan');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let serveStatic = require('serve-static');

let routes = require('./routes/routes');
let makeApi = require('./lib/api');
let api = require('./api/index');

// app.use(express.favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
// app.use(app.router);
app.use(serveStatic(path.join(__dirname, 'static'), {'index': ['index.html', 'index.htm']}));

makeApi(app, api);

// error handling
app.use(function(req, res, next){
    res.status(404);
    console.error('Not found URL: %s', req.url);
    res.send({ error: 'Not found' });
});
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    console.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
});

// Starting server
app.listen(1337, function(){
    console.log('Express server listening on port 1337');
});
