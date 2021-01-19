var express = require('express') //llamamos a Express
var app = express()       
var cors=require('cors');
var bodyParser = require('body-parser')        
var mysql=require('../db/mysql');
var jwt=require('jsonwebtoken');
var config=require('./configs/config');
app.set('llave',config.llave);
 
 
var port = process.env.PORT || 8080 // establecemos nuestro puerto
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())            
 
// nuestra ruta irá en http://localhost:8080/api
// es bueno que haya un prefijo, sobre todo por el tema de versiones de la API
var rutaValidacion=require('express').Router();
var router = require('./routes')
 
 
app.post('/autenticar', (req, res) => {
      if(req.body.usuario === "asfo" && req.body.contrasena === "holamundo") {
    const payload = {
     check:  true
    };
    const token = jwt.sign(payload, app.get('llave'), {
     expiresIn: 1440
    });
    res.json({
     mensaje: 'Autenticación correcta',
     token: token
    });
      } else {
          res.json({ mensaje: "Usuario o contraseña incorrectos"})
      }
  })
 
  const rutasProtegidas = express.Router(); 
rutasProtegidas.use((req, res, next) => {
    const token = req.headers['access-token'];
	
    if (token) {
      jwt.verify(token, app.get('llave'), (err, decoded) => {      
        if (err) {
          return res.json({ mensaje: 'Token inválida' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          mensaje: 'Token no proveída.' 
      });
    }

app.use('/api', router)
//arrancamos el servidor
app.listen(port)
console.log('API escuchando en el puerto ' + port)
