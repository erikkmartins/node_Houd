//Modulos requeridos para funcionamento

var express = require('express'), 
    bodyParser = require('body-parser'),
    app = express(),
    router = require('./router'),
    http = require('http');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());



/*Conexão MySQL*/

var connection = require('express-myconnection'),
    mysql = require('mysql');

app.use(

    connection(mysql, {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: '8889',
        database: 'houd'
    }, 'request')

);

app.use('/', router);

//start Server
var server = app.listen(8080, function() {

    console.log("Ouvindo na porta %s", server.address().port);

});
