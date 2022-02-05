const express = require('express');
const app = express();
app.use(express.static('static'));

app.get('/crear', (req, res) => {
  console.log(req.query);
  res.send('Archivo creado');
});

app.get('/leer', (req, res) => {
  console.log(req.query);
  res.send('Archivo leido');
});

app.get('/renombrar', (req, res) => {
  console.log(req.query);
  res.send('Archivo renombrado');
});

app.get('/eliminar', (req, res) => {
  console.log(req.query);
  res.send('Archivo eliminado');
});

app.listen(3000, function () {
  console.log('Servidor andando en el puerto 3000');
});
