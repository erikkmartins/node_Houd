var express = require('express');

var Controller = require('./controllers/controller');

var router = express.Router();

router.route('/')
.get(Controller.default);


//ok
router.route('/checkin')
.post(Controller.checkin);


//ok
router.route('/login')
.post(Controller.login);

//ok
router.route('/register')
.put(Controller.register);

//ok
router.route('/pesquisa')
.post(Controller.pesquisa);

//ok
router.route('/regproduto')
.post(Controller.regproduto);

//ok
router.route('/pesproduto')
.post(Controller.pesproduto);

//ok
router.route('/pesprod2')
.post(Controller.pesprod2);

//ok
router.route('/pesEspecialista')
.post(Controller.pesEspecialista);

module.exports = router; 