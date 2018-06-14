var express = require('express')
    , http = require('http')
    , path = require('path');

var bodyParser = require('body-parser')
    , static = require('serve-static')
    , cookieParser = require('cookie-parser')
    , expressSession = require('express-session')
    , expressErrorHandler = require('express-error-handler');

var user = require('./routes/user');
var config = require('./config');
var databaseLoader = require('./database/database_loader');
var route_loader = require('./routes/route_loader');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port', config.server_port || 3000);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

route_loader.init(app, express.Router());

var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('starting server. port : ' + app.get('port'));
    databaseLoader.init(app, config);
});


