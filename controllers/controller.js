exports.default = function(req, res, next) {
	res.json({server: "Server online!"});

}


//INSERT to DB login
exports.login = function(req, res, next) {

    //validação simples
  
    var email = validator.trim(validator.escape(req.params.email));
    var senha = validator.trim(validator.escape(req.params.senha));
     
    //cria um objeto
    var usuario = {
        EmailUsuario: req.body.email,
        SenhaUsuario: req.body.senha
    };

    req.getConnection(function(err, conn) {

    if (err) return next("Cannot Connect");

         var query = conn.query('SELECT * FROM Usuario u WHERE  u.EmailUsuario = ? and u.SenhaUsuario = ?' , [email , senha] , function(err, rows) {

            if (err) {
                console.log(err);
               
                return next("Erro na query");
            }

            if (rows.length < 1) {
                console.log("Usuário não encontrado!");
                
            return res.json(false);
            res.sendStatus(409);
            }

            if (rows.length >= 1) {
                console.log("Usuário encontrado!");
                return res.json(true);
                res.sendStatus(200);
            } 
        });
    });
}

//SELECT ALL
exports.usuario = function(req, res, next) {
	
    req.getConnection(function(err, conn) {

        if (err) return next("Impossível conectar");

        var query = conn.query('SELECT * FROM Usuario u '
            + 'INNER JOIN Restaurante r on u.CodUsuario = r.CodUsuario ' 
            + 'INNER JOIN IntoleranciaAlimentar i on u.CodUsuario = i.CodUsuario '
            + 'INNER JOIN Endereco e on e.CodUsuario = u.CodUsuario', function(err, rows) {

            if (err) {
                console.log(err);
                return next("Erro na query");
            }
            res.json(rows);

        });

    });
}


//SELECT BY ID
exports.usuario_id = function(req, res, next) {
     var CodUsuario = req.params.CodUsuario;

    req.getConnection(function(err, conn) {

        if (err) return next("Impossível conectar");

        var query = conn.query('SELECT * FROM Usuario u '
            + 'INNER JOIN Restaurante r on u.CodUsuario = r.CodUsuario ' 
            + 'INNER JOIN IntoleranciaAlimentar i on u.CodUsuario = i.CodUsuario '
            + 'INNER JOIN Endereco e on e.CodUsuario = u.CodUsuario WHERE u.CodUsuario = ?' , [CodUsuario], function(err, rows) {

            if (err) {
                console.log(err);
                return next("Erro na query");
            }

            if (rows.length < 1)
                return res.send("Usuário não encontrado");

            res.json(rows);
        });

    });
}


//DELETE by ID 
exports.usuario_del = function(req, res, next) {

    var usuario = req.params.usuario;

    req.getConnection(function(err, conn) {

        if (err) return next("Impossível conectar");

        var query = conn.query("DELETE FROM USUARIO  WHERE CodUsuario = ? ", [usuario], function(err, rows) {

            if (err) {
                console.log(err);
                return next("Erro na query");
            }

            res.sendStatus(200);

        });

    });

}



//INSERT to DB
    exports.checkin = function(req, res, next) {

    //validação simples
    var nome = validator.trim(validator.escape(req.params.nome));
    var intolerancia = validator.trim(validator.escape(req.params.intolerancia));
    var restaurante = validator.trim(validator.escape(req.params.restaurante));
    var endereco = validator.trim(validator.escape(req.params.endereco));
    var cep = validator.trim(validator.escape(req.params.cep));
    var cidade = validator.trim(validator.escape(req.params.cidade));
    var estado = validator.trim(validator.escape(req.params.estado));
    var pais = validator.trim(validator.escape(req.params.pais));



    //cria um objeto
    var usuario = {
        NomeUsuario: req.body.nome
    };



    req.getConnection(function(err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO Usuario set ? ", usuario, function(err, usu) {

            if (err) {
                console.log(err);
                return next("Erro na query");
            }


            var intolerancia = {
                NomeIntolerancia: req.body.intolerancia,
                CodUsuario: usu.insertId
            }



            var query = conn.query("INSERT INTO IntoleranciaAlimentar set ? ", intolerancia, function(err, int) {

                if (err) {
                    console.log(err);
                    return next("Erro na query");
                }


                var restaurante = {
                    NomeRestaurante: req.body.restaurante,
                    CodUsuario: usu.insertId

                }
                var query = conn.query("INSERT INTO Restaurante set ? ", restaurante, function(err, rest) {

                    if (err) {
                        console.log(err);
                        return next("Erro na query");
                    }

                    var endereco = {
                        CodUsuario: usu.insertId,
                        CodRestaurante: rest.insertId,
                        LogadouroEndereco: req.body.endereco,
                        CEPEndereco: req.body.cep,
                        CidadeEndereco: req.body.cidade,
                        EstadoEndereco: req.body.estado,
                        PaisEndereco: req.body.pais
                    }




                    var query = conn.query("INSERT INTO Endereco set ? ", endereco, function(err, rows) {

                        if (err) {
                            console.log(err);
                            return next("Erro na query");
                        }


                        res.sendStatus(200);

                    });
                });

            });
        });

    });

}



//UPDATE 
exports.update = function(req, res, next) {

    var user_id = (req.params.id);
    var name = validator.trim(validator.escape(req.params.name));



    req.getConnection(function(err,conn){

        if (err) return next("Impossível conectar");

        var query = conn.query("SELECT * FROM Usuario WHERE CodUsuario = ? ",[user_id],function(err,rows){

            if(err){
                console.log(err);
                return next("Erro na query select");
            }

            //if user not found
            if(rows.length < 1)
                return res.send("Usuário não encontrado");

            
        });

    });


 var data = {
        NomeUsuario:req.body.name

     };
     console.log(data)

      //UPDATE usuário
    req.getConnection(function (err, conn){

        if (err) return next("Impossível conectar");

        var query = conn.query("UPDATE Usuario set ? WHERE CodUsuario = ? ",[data,user_id], function(err, rows){

           if(err){
                console.log(err);
                return next("Erro na query update");
           }

          res.sendStatus(200);

        });

  });
}
