exports.default = function(req, res, next) {
	res.json({server: "Server online!"});

}

//pesquisa de produtos
exports.pesproduto = function(req, res, next) {

    req.getConnection(function(err, conn) {

        if (err) return next("Impossível conectar");

        var query = conn.query("SELECT * FROM Produto u ", function(err, rows) {

            if (err) {
                console.log(err);
                return next("Erro na query");
            }
            return res.json(rows);
            res.sendStatus(200);
        });

    });
}

//registro de produtos
exports.regproduto = function(req, res, next) {
    var nomeProd = req.body.NomeProduto;
    var fabriProd   = req.body.FabricanteProduto;
    var CodBarraProd = req.body.CodigoDeBarrasProduto;
    var StatusProd = "1";

   var produto = {
        NomeProduto: nomeProd,
        FabricanteProduto: fabriProd,
        CodigoDeBarrasProduto: CodBarraProd,
        StatusProduto: StatusProd
        
    };



req.getConnection(function(err, conn) {

    if (err) return next("Cannot Connect");

         var query = conn.query('SELECT * FROM Produto u WHERE  u.CodigoDeBarrasProduto = ? and u.StatusProduto <> 0 ' , [CodBarraProd , StatusProd] , function(err, rows) {

            if (err) {
                console.log(err);
                return next("Erro na query");
            }

            if (rows.length < 1) {
                console.log("Produto não encontrado!");

        var query = conn.query("INSERT INTO Produto set ? ", produto, function(err, usu) {

            if (err) {
                console.log(err);
                return next("Erro na query");
            }
            return res.json(true);
            res.sendStatus(200)
        });           
}

            if (rows.length >= 1) {
                console.log("Produto já cadastrado!");
                return res.json(false);
                res.sendStatus(409);
            } 
        });
    });


}

//INSERT to DB login
exports.login = function(req, res, next) {

    //validação simples
  
    var email = req.body.email;
    var senha = req.body.senha;
     
   // console.log(email, senha);


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
                return res.json(rows);
                res.sendStatus(200);
            } 
        });
    });
}


//Register to DB
    exports.register = function(req, res, next) {

    //validação simples
    var nome = req.body.nome;
    var email = req.body.email;
    var senha = req.body.senha;
    var sexo = req.body.sexo;
    var datanascimento = req.body.datanascimento;
    var idade = req.body.idade;



    //cria um objeto
    var usuario = {
        NomeUsuario: nome,
        EmailUsuario: email,
        IdadeUsuario: idade,
        SexoUsuario: sexo,
        DatadeNascimentoUsuario: datanascimento,
        SenhaUsuario: senha
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

        var query = conn.query("INSERT INTO Usuario set ? ", usuario, function(err, usu) {

            if (err) {
                console.log(err);
                return next("Erro na query");
            }
            return res.json(true);
            res.sendStatus(200)
        });           
}

            if (rows.length >= 1) {
                console.log("Usuário encontrado!");
                return res.json(false);
                res.sendStatus(409);
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
    var nome = req.params.nome;
    var intolerancia = req.params.intolerancia;
    var restaurante = req.params.restaurante;
    var endereco = req.params.endereco;
    var cep = req.params.cep;
    var cidade = req.params.cidade;
    var estado = req.params.estado;
    var pais = req.params.pais;



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

    var user_id = req.params.id;
    var name = req.params.name;



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

//SELECT ALL
exports.pesquisa = function(req, res, next) {
    var Restaurante = req.body.Restaurante;
    var Logradouro = req.body.Logradouro;
    var Cidade = req.body.Cidade;
    var Estado = req.body.Estado;
    var TipoRestricao = req.body.TipoRestricao;

    console.log(Restaurante, Logradouro, Cidade, Estado, TipoRestricao);

    req.getConnection(function(err, conn) {

        if (err) return next("Impossível conectar");

        var query = conn.query("CALL `BuscaRestaurante`(?, ?, ?, ?, ?);", [Restaurante, Logradouro, Cidade, Estado, TipoRestricao], function(err, rows) {

            if (err) {
                console.log(err);
                return next("Erro na query");
            }
            return res.json(rows);
            res.sendStatus(200);
        });

    });
}
