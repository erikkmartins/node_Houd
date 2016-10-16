exports.default = function(req, res, next) {
	res.json({server: "Server online!"});

}

//pesquisa de produtos
exports.pesproduto = function(req, res, next) {
    var pesqProd = req.body.PesquisaProduto;


    req.getConnection(function(err, conn) {

        if (err) return next("Impossível conectar");

        var query = conn.query("SELECT * FROM Produto u WHERE upper(u.NomeProduto) like ? or upper(u.FabricanteProduto) like ? ORDER BY u.NomeProduto",[pesqProd, pesqProd] , function(err, rows) {

            if (err) {
                console.log(err);
                return next("Erro na query");
            }
            return res.json(rows);
            res.sendStatus(200);
        });

    });
}

//SELECT ALL
exports.pesprod2 = function(req, res, next) {
    var NomeProduto = req.body.NomeProduto;
    var FabricanteProduto = req.body.FabricanteProduto;
    var CodIntProduto = req.body.CodIntProduto;


    req.getConnection(function(err, conn) {

        if (err) return next("Impossível conectar");

        var query = conn.query("call pr_BuscaProduto(?,?,?);"
, [NomeProduto, FabricanteProduto, CodIntProduto], function(err, rows) {

            if (err) {
                console.log(err);
                return next("Erro na query");
            }
            return res.json(rows);
            res.sendStatus(200);
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

         var query = conn.query('SELECT * FROM Usuario u WHERE  u.EmailUsuario = ?' , [email] , function(err, rows) {

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
            res.status(200)

            return res.json([{CodUsuario: usu.insertId}]);
            
        });           
}

            if (rows.length >= 1) {
                console.log("Usuário encontrado!");
                  res.status(409);

                return res.json([{CodUsuario: rows[0].CodUsuario}]);
              
            } 
        });
    });

}


//INSERT to DB
    exports.checkin = function(req, res, next) {
    var async = require('async');

    //validação simples
    var CodUsuario = req.body.CodUsuario;
    var NomeRestaurante = req.body.NomeRestaurante;
    var CodRestaurante  = 0;
    var intolerancia = req.body.intolerancia;
    var CodEndereco  = 0;
    var CodIntoleranciaAlimentar = 0

    var LogadouroEndereco = req.body.LogadouroEndereco;
    var numero = req.body.numero;
    var complemento = req.body.complemento;
    var cep = req.body.cep;
    var bairro = req.body.bairro;
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    var pais = req.body.pais;



    //cria um objeto
    var endereco = {
        LogadouroEndereco: LogadouroEndereco,
        CEPEndereco: cep,
        NumeroEndereco: numero,
        ComplementoEndereco: complemento,
        BairroEndereco: bairro,
        CidadeEndereco: cidade,
        EstadoEndereco: estado,
        PaisEndereco: pais,
    };





async.series([
        //Load user to get `userId` first
        function(callback) {
req.getConnection(function(err, conn) {
  
      if (err) return next("Cannot Connect");

  var query = conn.query('SELECT CodEndereco FROM Endereco WHERE LogadouroEndereco = ? '
                                                    + 'AND CEPEndereco = ? '
                                                    + 'AND NumeroEndereco = ? ' 
                                                    + 'AND ComplementoEndereco = ? ' 
                                                    + 'AND BairroEndereco = ? '
                                                    + 'AND CidadeEndereco = ? '
                                                    + 'AND EstadoEndereco = ? '
                                                    + 'AND PaisEndereco = ? '
                 , [LogadouroEndereco, cep, numero, complemento, bairro, cidade, estado, pais] , function(err, CodEnd) {

            if (err) {
                console.log(err);
                return next("Erro na query");
            }

                      if (CodEnd.length >= 1) {
                 console.log("Endereco encontrado!");
                var cod = CodEnd[0].CodEndereco;  
                 CodEndereco = cod;
                console.log ("O codigo localizado foi %d", CodEndereco);
            } 
            callback();      
    });
})
 },
function(callback) {
req.getConnection(function(err, conn) {
     if (CodEndereco == 0) {
                  console.log("Endereco não encontrado!");

        var query = conn.query("INSERT INTO Endereco set ? ", [endereco], function(err, end) {
                
                if (err) {
                    console.log(err);
                    res.status(400);
                    return next("Erro na query do insert");
                } 
                    var cod = end.insertId;
                    CodEndereco = cod;  
                   console.log ("O codigo inserido foi %d", CodEndereco);
                   callback()
                });
            } else (callback());
})
},
function(callback) {
req.getConnection(function(err, conn) {
          var query = conn.query('SELECT * FROM Restaurante r WHERE r.NomeRestaurante = ? and r.CodEndereco = ?' , [NomeRestaurante, CodEndereco] , function(err, rows) {

            if (err) {
                console.log(err);
                res.status(400);
                return next("Erro na query do select restaurante");
            }


            if (rows.length >= 1) {
                console.log("Restaurante encontrado!");
                 var cod = rows[0].CodRestaurante;  
                 CodRestaurante = cod;
            } 
    
                callback();
        });
})
},

function(callback) {
req.getConnection(function(err, conn) {

            var restaurante = {
                NomeRestaurante: NomeRestaurante,
                CodUsuario: CodUsuario,
                CodEndereco: CodEndereco
            }

            console.log(restaurante)

             if (CodRestaurante == 0) {
                console.log("Rest não encontrado!");
            var query = conn.query("INSERT INTO Restaurante set ? ", [restaurante], function(err, rest) {
                
                if (err) {
                    console.log(err);
                    res.status(400);
                    return next("Erro na query do insert restaurante");
                }
                var cod = rest.insertId;
                 CodRestaurante = cod;   
                 callback();
                });
                        } else (callback());
            
})
},
function(callback) {
req.getConnection(function(err, conn) {
             var query = conn.query("SELECT CodIntoleranciaAlimentar from IntoleranciaAlimentar WHERE  NomeIntolerancia like ?", [intolerancia], function(err, CodInt) {
            
                if (err) {
                    console.log(err);
                    res.status(400);
                    return next("Erro na query select IntoleranciaAlimentar");
                }
 
                var cod = CodInt[0].CodIntoleranciaAlimentar;
                CodIntoleranciaAlimentar = cod;
                callback();
            });
})
}  ,   

function(callback) {
req.getConnection(function(err, conn) {
                var Intolerancia_Restaurante = {
                    CodIntoleranciaAlimentar: CodIntoleranciaAlimentar,
                    CodRestaurante: CodRestaurante
                }
                console.log(Intolerancia_Restaurante);

                 var query = conn.query("INSERT INTO Intolerancia_Restaurante set ? ", Intolerancia_Restaurante, function(err, rest) {

                    if (err) {
                        console.log(err);
                        res.status(400);
                        return next("Erro na query do Insert Intolerancia_Restaurante");
                    }

                    res.status(200);
                });
                 callback();
 })           

}    
         
    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
        if (err) return next(err);
        //Here locals will be populated with `user` and `posts`
        //Just like in the previous example
        res.json(true);
    });


};




//SELECT ALL
exports.pesquisa = function(req, res, next) {
    var CodIntoleranciaAlimentar = req.body.CodIntoleranciaAlimentar;
    var Restaurante = req.body.Restaurante;
    var Logradouro = req.body.Logradouro;
    var Cidade = req.body.Cidade;
    var Estado = req.body.Estado;

    req.getConnection(function(err, conn) {

        if (err) return next("Impossível conectar");

        var query = conn.query("call pr_BuscaRestaurante(?, ?, ?, ?, ?);"
, [CodIntoleranciaAlimentar, Restaurante, Logradouro, Cidade, Estado], function(err, rows) {

            if (err) {
                console.log(err);
                return next("Erro na query");
            }
            return res.json(rows);
            res.sendStatus(200);
        });

    });
}


//SELECT ALL
exports.pesEspecialista = function(req, res, next) {
    var NomeEspecialista = req.body.NomeEspecialista;
    var Logradouro = req.body.Logradouro;
    var Cidade = req.body.Cidade;
    var Estado = req.body.Estado;


    req.getConnection(function(err, conn) {

        if (err) return next("Impossível conectar");

       var query = conn.query("call pr_BuscaEspecialista(?, ?, ?, ?);"
, [ NomeEspecialista, Logradouro, Cidade, Estado], function(err, rows) {

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
    var async = require('async');

    var nomeProd = req.body.NomeProduto;
    var fabriProd   = req.body.FabricanteProduto;
    var CodBarraProd = req.body.CodigoDeBarrasProduto;
    var StatusProd = "1";
    var intolerancia = req.body.intolerancia;

    var CodProduto = 0;
    var CodIntoleranciaAlimentar = 0;

   var produto = {
        NomeProduto: nomeProd,
        FabricanteProduto: fabriProd,
        CodigoDeBarrasProduto: CodBarraProd,
        StatusProduto: StatusProd
        
    };


req.getConnection(function(err, conn) {
async.series([
        //Load user to get `userId` first
        function(callback) {
  
      if (err) return next("Cannot Connect");

         var query = conn.query('SELECT * FROM Produto u WHERE  u.CodigoDeBarrasProduto = ? and u.StatusProduto <> 0 ' , [CodBarraProd , StatusProd] , function(err, rows) {

            if (err) {
                console.log(err);
                return next("Erro na query");
            }

             if (rows.length >= 1) {
                console.log("Produto já cadastrado sob codigo %d!", rows[0].CodProduto);
                var cod = rows[0].CodProduto;
                CodProduto = cod;
            }

            callback();
    });
        
        },
function(callback) {
            if (CodProduto == 0) {
                console.log("Produto não cadastrado!");
            
        var query = conn.query("INSERT INTO Produto set ? ", produto, function(err, prod) {

            if (err) {
                console.log(err);
                return next("Erro na query");
            }
            console.log("Produto cadastrado sob o número %d!",prod.insertId);
            var cod = prod.insertId;
            CodProduto = cod;        
            });
    }
    callback();
},
function(callback) {
    
            var query = conn.query("SELECT CodIntoleranciaAlimentar from IntoleranciaAlimentar WHERE  NomeIntolerancia like ?", [intolerancia], function(err, CodInt) {
                if (err) {
                    console.log(err);
                    return next("Erro na query select IntoleranciaAlimentar");
                }

                var cod = CodInt[0].CodIntoleranciaAlimentar;
                CodIntoleranciaAlimentar = cod;
                callback();
        });

},
function(callback) {
            var Intolerancia_Produto = {
                CodIntoleranciaAlimentar: CodIntoleranciaAlimentar,
                CodProduto: CodProduto
            }

             var query = conn.query("INSERT INTO Intolerancia_Produto set ? ", Intolerancia_Produto, function(err, prod) {

            if (err) {
                console.log(err);
                return next("Erro na query de registro de de intooerancia produto");
            }
            callback();
        });    
}         
         
    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
        if (err) return next(err);
        //Here locals will be populated with `user` and `posts`
        //Just like in the previous example
        res.json(true);
    });
});  
}


