// ¿cual es la diferencia entre res.write y res.send?
// El leer no funciona con fs.promises
// Como verificar que existe el archivo antes de ejecutar el Rename.

const express = require('express');
const { get } = require('express/lib/response');
const fsp = require('fs').promises;
const fs = require('fs');
const app = express();
app.use(express.static('static'));

//funciones de ayuda
async function checkFielExists(archivo) {
  const archivos = await fs.readdirSync('archivos');
  return archivos.includes(archivo);
}

function getFullDate() {
  const date = new Date().toLocaleDateString();
  const formatDate = date
    .split('/')
    .map((str) => {
      return str.length === 1 ? '0' + str : str;
    })
    .join('/');
  return formatDate;
}

//Requirimiento 2
app.get('/crear', async (req, res) => {
  console.log(req.query);
  const contenido = getFullDate() + '<br>' + req.query.contenido;
  await fsp.writeFile(`archivos/${req.query.archivo}`, contenido, 'utf-8');
  //requerimiento 6
  res.send(`Archivo creado exitosamente con nombre: ${req.query.archivo}`);
  res.end();
});

//Requerimiento 3
app.get('/leer', async (req, res) => {
  console.log(req.query);
  const fielExists = await checkFielExists(req.query.archivo);
  if (!fielExists) return res.send(`Archivo "${req.query.archivo}" no existe`);

  const data = await fsp.readFile(`archivos/${req.query.archivo}`, 'utf-8');
  //requerimiento 6
  res.send(
    `Archivo con el nombre: ${req.query.archivo} ha sido leído exitosamente <br>
    Contenido del archivo:<br>
    ${data}
    `
  );
  res.end();
});

//Requerimiento 4
app.get('/renombrar', async (req, res) => {
  console.log(req.query);

  const fielExists = await checkFielExists(req.query.nombre);
  if (!fielExists) return res.send(`Archivo "${req.query.nombre}" no existe`);

  await fsp.rename(
    `archivos/${req.query.nombre}`,
    `archivos/${req.query.nuevoNombre}`
  );
  //requerimiento 6
  res.send(
    `Archivo "${req.query.nombre}" renombrado exitosamente como: "${req.query.nuevoNombre}"`
  );
  res.end();
});

//Requerimiento 5
app.get('/eliminar', async (req, res) => {
  console.log(req.query);
  const fielExists = await checkFielExists(req.query.archivo);
  if (!fielExists) return res.send(`Archivo "${req.query.archivo}" no existe`);

  await fsp.unlink(`archivos/${req.query.archivo}`);

  res.send(`
  <p id="aviso">Tu solicitud para eliminar el archivo ${req.query.archivo} se está
  procesando</p>
  <script>
    setTimeout(()=>{document.querySelector('#aviso').innerHTML='Tu archivo fué eliminado'}, 3000);
  </script>
  `);
});

app.get('/eliminado', (req, res) => {
  setTimeout(() => {
    res.send(`Archivo "${req.query.archivo}" eliminado exitosamente`);
  }, 3000);
});

app.listen(3000, function () {
  console.log('Servidor andando en el puerto 3000');
});
