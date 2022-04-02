const express = require("express");
const app = express();
const fs = require("fs");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const routerProducto = express.Router();
const routerCarrito = express.Router();

const sudo = false;

const port = process.env.PORT || 8080;

// let id = (id) => document.getElementById(id);
// let nombre = id("nombre"),
//   descripcion = id("desc"),
//   codigo = id("cod"),
//   foto = id("foto"),
//   precio = id("precio"),
//   stock = id("stock");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/productos", routerProducto);
app.use("/api/carrito", routerCarrito);

let objetoProducto = [
  {
    id: uuidv4(),
    timestamp: Date.now(),
    nombre: "cosa 1",
    descripcion: "esto es una cosa",
    codigo: "kajsd76tgs",
    foto: "ruta/hacia/foto",
    precio: Math.floor(Math.random() * (10000 - 1000 + 1) + 1000),
  },
  {
    id: uuidv4(),
    timestamp: Date.now(),
    nombre: "cosa 2",
    descripcion: "esto es una cosa 2",
    codigo: "fttsd7s3tgs",
    foto: "ruta/hacia/foto",
    precio: Math.floor(Math.random() * (10000 - 1000 + 1) + 1000),
  },
];

let carritoCollecion = [];

class ObjetoCarrito {
  constructor(id, timestamp, producto) {
    this.id = uuidv4();
    this.timestamp = timestamp;
    this.producto = producto;
  }
}
//ejem
// carritoCollecion.push(new ObjetoCarrito(id, timestamp, objetoProducto[0]));

/* ----------------------------- routerProducto ----------------------------- */

// Me permite listar todos los productos disponibles ó un producto por su id
// (disponible para usuarios y administradores)
routerProducto.get("/:id?", (req, res) => {
  const { id } = req.params;
  if (id == undefined) {
    const contenido = fs.readFileSync("./productos.json");
    productos = JSON.parse(contenido);
    res.status(200).send(productos);
  } else {
    const parsearArchivoLeido = JSON.parse(archivoLeido);
    const productoEncontrado = parsearArchivoLeido.find(
      (item) => item.id == id
    );
    res.status(200).send(productoEncontrado);
  }
});

// Para incorporar productos al listado (disponible para administradores)
routerProducto.post("/", (req, res) => {
  if (sudo) {
    objetoProducto.push({
      id: uuidv4(),
      timestamp: Date.now(),
      nombre: "cosa 1",
      descripcion: "esto es una cosa",
      codigo: "kajsd76tgs",
      foto: "ruta/hacia/foto",
      precio: Math.floor(Math.random() * (10000 - 1000 + 1) + 1000),
    });

    fs.writeFileSync("./productos.json", JSON.stringify(objetoProducto));

    const parsearArchivoLeido = JSON.parse(archivoLeido);
    res.status(200).send(parsearArchivoLeido);
  } else {
    res
      .status(403)
      .json({ error: "access to the requested resource is forbidden" });
  }
});

// Actualiza un producto por su id (disponible para administradores)
routerProducto.put("/:id", (req, res) => {
  if (sudo) {
    const { id } = req.params;
    const archivoLeido = fs.readFileSync("./productos.json");
    const parsearArchivoLeido = JSON.parse(archivoLeido);
    let removeIndex = parsearArchivoLeido
      .map((item) => {
        return item.id;
      })
      .indexOf(id);

    parsearArchivoLeido.splice(removeIndex, 1);

    objetoProducto.push({
      id: uuidv4(),
      timestamp: Date.now(),
      nombre: "cosa 1",
      descripcion: "esto es una cosa",
      codigo: "kajsd76tgs",
      foto: "ruta/hacia/foto",
      precio: Math.floor(Math.random() * (10000 - 1000 + 1) + 1000),
    });
    fs.writeFileSync("./productos.json", JSON.stringify(objetoProducto));

    const contenido = fs.readFileSync("./productos.json");
    productos = JSON.parse(contenido);
    res.status(200).send(productos);
  } else {
    res
      .status(403)
      .json({ error: "access to the requested resource is forbidden" });
  }
});

// Borra un producto por su id (disponible para administradores)
routerProducto.delete("/:id", (req, res) => {
  if (sudo) {
    const { id } = req.params;
    const archivoLeido = fs.readFileSync("./productos.json");
    const parsearArchivoLeido = JSON.parse(archivoLeido);
    let removeIndex = parsearArchivoLeido
      .map((item) => {
        return item.id;
      })
      .indexOf(id);

    parsearArchivoLeido.splice(removeIndex, 1);
    fs.writeFileSync("./productos.json", JSON.stringify(parsearArchivoLeido));

    const contenido = fs.readFileSync("./productos.json");
    productos = JSON.parse(contenido);
    res.status(200).send(productos);
  } else {
    res
      .status(403)
      .json({ error: "access to the requested resource is forbidden" });
  }
});

/* ------------------------------ routerCarrito ----------------------------- */
// Crea un carrito y devuelve su id.
routerCarrito.post("/", (req, res) => {
  const contenido = fs.readFileSync("./productos.json");
  const id = uuidv4();
  const timestamp = Date.now();

  carritoCollecion.push(new ObjetoCarrito({ id, timestamp, objetoProducto }));
  fs.writeFileSync("./productos.json", JSON.stringify(contenido));

  res.status(200).send(id);
});

// Vacía un carrito y lo elimina.
routerCarrito.delete("/:id", (req, res) => {
  const { id } = req.params;
  const archivoLeido = fs.readFileSync("./productos.json");
  const parsearArchivoLeido = JSON.parse(archivoLeido);
  let removeIndex = parsearArchivoLeido
    .map((item) => {
      return item.id;
    })
    .indexOf(id);

  parsearArchivoLeido.splice(removeIndex, 1);
  fs.writeFileSync("./productos.json", JSON.stringify(parsearArchivoLeido));

  const contenido = fs.readFileSync("./productos.json");
  productos = JSON.parse(contenido);
  res.status(200).send(productos);
});

// Me permite listar todos los productos guardados en el carrito
routerCarrito.get("/:id/productos", (req, res) => {
  const { id } = req.params;
  if (id == undefined) {
    const contenido = fs.readFileSync("./productos.json");
    productos = JSON.parse(contenido);
    res.status(200).send(productos);
  } else {
    const parsearArchivoLeido = JSON.parse(archivoLeido);
    const productoEncontrado = parsearArchivoLeido.find(
      (item) => item.id == id
    );
    res.status(200).send(productoEncontrado);
  }
});

// Para incorporar productos al carrito por su id de producto
routerCarrito.post("/:id/productos", (req, res) => {
  objetoProducto.push({
    id: uuidv4(),
    timestamp: Date.now(),
    nombre: "cosa 1",
    descripcion: "esto es una cosa",
    codigo: "kajsd76tgs",
    foto: "ruta/hacia/foto",
    precio: Math.floor(Math.random() * (10000 - 1000 + 1) + 1000),
  });

  fs.writeFileSync("./productos.json", JSON.stringify(objetoProducto));

  const parsearArchivoLeido = JSON.parse(archivoLeido);
  res.status(200).send(parsearArchivoLeido);
});

// Eliminar un producto del carrito por su id de carrito y de producto
routerCarrito.delete("/:id/productos/:id_prod", (req, res) => {
  const { id } = req.params;
  const archivoLeido = fs.readFileSync("./productos.json");
  const parsearArchivoLeido = JSON.parse(archivoLeido);
  let removeIndex = parsearArchivoLeido
    .map((item) => {
      return item.id;
    })
    .indexOf(id);

  parsearArchivoLeido.splice(removeIndex, 1);
  fs.writeFileSync("./productos.json", JSON.stringify(parsearArchivoLeido));

  const contenido = fs.readFileSync("./productos.json");
  productos = JSON.parse(contenido);
  res.status(200).send(productos);
});

const server = app.listen(port, () => {
  console.log(`server ON http://localhost:${port}`);
});
server.on("error", (err) => console.log(err));
