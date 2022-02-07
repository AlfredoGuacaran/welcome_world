// ¿cual es la diferencia entre res.write y res.send?
// El leer no funciona con fs.promises
// Como verificar que existe el archivo antes de ejecutar el Rename.

const express = require('express');
const fsp = require('fs').promises;
const fs = require('fs');

const app = express();
app.use(express.static('static'));

//2.
app.get('/crear', async (req, res) => {
  console.log(req.query);
  await fsp.writeFile(
    `archivos/${req.query.archivo}`,
    req.query.contenido,
    'utf-8'
  );
  res.send(`Archivo creado exitosamente con nombre: ${req.query.archivo}`);
  res.end();
});

//3.
app.get('/leer', (req, res) => {
  console.log(req.query);

  fs.readFile(`archivos/${req.query.archivo}`, 'utf-8', (error, data) => {
    res.write(
      `Archivo con el nombre: ${req.query.archivo} ha sido leído exitosamente <br>
      Contenido del archivo:<br>
      ${data}
      `
    );
  });
  res.end();
});

//4
app.get('/renombrar', async (req, res) => {
  console.log(req.query);
  await fsp.rename(
    `archivos/${req.query.nombre}`,
    `archivos/${req.query.nuevoNombre}`,
    (error, data) => {
      console.log(error, data);
    }
  );
  res.write(
    `Archivo "${req.query.nombre}" renombrado exitosamente como: "${req.query.nuevoNombre}"`
  );
  res.end();
});

//5
app.get('/eliminar', async (req, res) => {
  console.log(req.query);
  await fsp.unlink(`archivos/${req.query.archivo}`, (error, data) => {
    // res.write(`Archivo "${req.query.nombre}" eliminado exitosamente`);
  });
  res.write(`Archivo "${req.query.archivo}" eliminado exitosamente`);

  res.end();
});

app.listen(3000, function () {
  console.log('Servidor andando en el puerto 3000');
});
