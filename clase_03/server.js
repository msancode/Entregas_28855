const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 8080;

//inicio coleccion
let productos = [];

class Contenedor {
  constructor(file) {
    this.file = file;
  }

  // Recibe un objeto, lo guarda en el archivo, devuelve el id asignado
  async save(objeToproducto) {
    try {
      const contenido = await fs.promises.readFile(this.file, "utf-8");
      productos = JSON.parse(contenido);
    } catch (err) {
      console.log(
        `Error al leer archivo ya que aun no existe,este error ocurre solo la primera vez: ${this.file}`
      );
    }
    let id = (objeToproducto.id = Date.now());
    productos.push(objeToproducto);
    try {
      await fs.promises.writeFile(this.file, JSON.stringify(productos));
      console.log(
        `Exito Producto: ${JSON.stringify(objeToproducto)} Guardado!`
      );
    } catch (err) {
      console.log(`Error no se pudo almacenar en el archivo : ${err}`);
    }
    console.log(id);
    return id;
  }

  // Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
  async getById(num) {
    try {
      const coleccion = await this.getAll();
      if (coleccion != null) {
        const productoEncontrado = coleccion.find((item) => item.id == num);
        return productoEncontrado;
      }
    } catch (err) {
      console.log(`Error no se pudo hallar en el archivo el producto: ${err}`);
      return null;
    }
  }

  //Devuelve un objeto al azar.
  async getRandom() {
    try {
      const coleccion = await this.getAll();
      if (coleccion != null) {
        const random = Math.floor(Math.random() * coleccion.length);
        let elementoAlAzar = coleccion[random];
        return elementoAlAzar;
      }
    } catch (err) {
      console.log(`Error no se pudo hallar en el archivo el producto: ${err}`);
      return null;
    }
  }

  // Devuelve un array con los objetos presentes en el archivo.
  async getAll() {
    try {
      const leerArchivo = await fs.promises.readFile(this.file, "utf-8");
      const parsearArchivoLeido = JSON.parse(leerArchivo);
      return parsearArchivoLeido;
    } catch (err) {
      console.log(`Error no se encontraron datos : ${err}`);
    }
  }
}

const contenedor = new Contenedor("./productos.json");

//simulo envio y pedidos de productos
async function simularEnvioDeObjeto() {
  //mockup de un producto
  const objetoProducto = {
    title: "Remera",
    price: Math.floor(Math.random() * (10000 - 1000 + 1) + 1000),
    thumbnail: "./rura/hacia/imagen/ficticia",
  };

  //guardo productos
  await contenedor.save(objetoProducto);

  //muestro elemento al azar
  let producto = await contenedor.getRandom();
  console.log(`El producto al Azar es: ${JSON.stringify(producto)}`);
}

//inicia ejecucion
// simularEnvioDeObjeto();

//======================================   SERVER

app.get("/productos", (req, res) => {
  const contenido = fs.readFileSync("./productos.json");
  productos = JSON.parse(contenido);
  res.send(productos);
});

app.get("/productoRandom", (req, res) => {
  const leerArchivo = fs.readFileSync("./productos.json");
  const parsearArchivoLeido = JSON.parse(leerArchivo);
  const random = Math.floor(Math.random() * parsearArchivoLeido.length);
  let elementoAlAzar = parsearArchivoLeido[random];

  res.send(`El producto al Azar es: ${JSON.stringify(elementoAlAzar)}`);
});

const server = app.listen(PORT, () => {
  console.log(`🔥 Servidor escuchando en el puerto http://localhost:${PORT}`);
});

server.on("error", (error) => console.log(error));
