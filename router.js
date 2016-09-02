var express = require('express');

var Controller = require('./controllers/controller');

var router = express.Router();

router.route('/')
.get(Controller.default);

router.route('/usuario')
.get(Controller.usuario);

router.route('/usuario/:CodUsuario')
.get(Controller.usuario_id);

router.route('/usuario')
.delete(Controller.usuario_del);

router.route('/checkin')
.post(Controller.checkin);

router.route('/update')
.put(Controller.update);

router.route('/login')
.post(Controller.login);

router.route('/register')
.put(Controller.register);

router.route('/pesquisa')
.post(Controller.pesquisa);

router.route('/regproduto')
.post(Controller.regproduto);

router.route('/pesproduto')
.post(Controller.pesproduto);

module.exports = router; 