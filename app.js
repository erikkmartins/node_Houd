var express  = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    validator = require('validator');


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());



/*Conexão MySQL*/
var connection  = require('express-myconnection'),
    mysql = require('mysql');

app.use(

    connection(mysql,{
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        port     : '8889',
        database : 'test'
    },'request')

);



//SELECT ALL
app.get('/user', function(req,res,next){


    req.getConnection(function(err,conn){

        if (err) return next("Impossível conectar");

        var query = conn.query('SELECT * FROM t_user',function(err,rows){

            if(err){
                console.log(err);
                return next("Erro na query");
            }
            res.json(rows);

         });

    });

});


//SELECT by ID
app.get('/user/:user_id', function(req,res,next){

    var user_id = req.params.user_id;

    req.getConnection(function(err,conn){

        if (err) return next("Impossível conectar");

        var query = conn.query("SELECT * FROM t_user WHERE user_id = ? ",[user_id],function(err,rows){

            if(err){
                console.log(err);
                return next("Erro na query");
            }

            if(rows.length < 1)
                return res.send("Usuário não encontrado");

            res.json(rows);
        });

    });

});


//DELETE by ID
app.delete('/user', function(req,res,next){

    var user_id = (req.param('user_id'));

     req.getConnection(function (err, conn) {

        if (err) return next("Impossível conectar");

        var query = conn.query("DELETE FROM t_user  WHERE user_id = ? ",[user_id], function(err, rows){

             if(err){
                console.log(err);
                return next("Erro na query");
             }

             res.sendStatus(200);

        });

     });
});


//INSERT to DB
app.post('/user', function(req,res,next){

    //validação simples
	var name = validator.trim(validator.escape(req.param('name')));
	var email = validator.trim(validator.escape(req.param('email')));
	var password = validator.trim(validator.escape(req.param('password')));


    //cria um objeto
    var data = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
     };

    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO t_user set ? ",data, function(err, rows){

           if(err){
                console.log(err);
                return next("Erro na query");
           }

          res.sendStatus(200);

        });

     });

});


//UPDATE 
app.put('/user', function(req,res,next){

	var user_id = (req.param('id'));
	var name = validator.trim(validator.escape(req.param('name')));
	var email = validator.trim(validator.escape(req.param('email')));
	var password = validator.trim(validator.escape(req.param('password')));

    req.getConnection(function(err,conn){

        if (err) return next("Impossível conectar");

        var query = conn.query("SELECT * FROM t_user WHERE user_id = ? ",[user_id],function(err,rows){

            if(err){
                console.log(err);
                return next("Erro na query");
            }

            //if user not found
            if(rows.length < 1)
                return res.send("Usuário não encontrado");

            
        });

    });


 var data = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
     };

      //UPDATE usuário
    req.getConnection(function (err, conn){

        if (err) return next("Impossível conectar");

        var query = conn.query("UPDATE t_user set ? WHERE user_id = ? ",[data,id], function(err, rows){

           if(err){
                console.log(err);
                return next("Erro na query");
           }

          res.sendStatus(200);

        });

     });
});


//start Server
var server = app.listen(7171,function(){

   console.log("Ouvindo na porta %s",server.address().port);

});