//  OpenShift sample Node application
var express = require('express'), 
    bodyParser = require('body-parser'),
    app = express(),
    router = require('./router'),
    http = require('http');
    

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


/*Conexão MySQL*/

var connection = require('express-myconnection'),
    mysql = require('mysql');

app.use(

    connection(mysql, {
        host: '10.1.39.13',
        user: 'userKIW',
        password: 'dGBvVUKdQyNf7k7S',
        port: '3306',
        database: 'houd'
    }, 'request')

);


app.use('/', router);


// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
