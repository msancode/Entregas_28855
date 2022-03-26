const express = require("express");
const app = express();
const PORT = 8080;

//SOCKET
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const messages = [
  {
    author: "Martin",
    text: "Hola",
  },
];

const productos = [
  {
    title: "remera",
    price: 1234,
    image: "/ruta/imagen/ficticia",
  },
];

//cargo modulo handlebars
const { engine } = require("express-handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//usando archivos hbs por ubicacion
app.set("views", "./src/views");
//motor de plantilla
app.set("view engine", "hbs");

//config de hadlebars
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layout",
    partialsDir: __dirname + "/views/partials",
  })
);

app.get("/", (req, res) => {
  res.render("main", { toForm: true, toChat: false });
});

app.get("/productos", (req, res) => {
  const existeItem = productos.length > 0;
  res.render("main", {
    productos,
    toChat: true,
    formulario: false,
    existeItem: existeItem,
  });
});

app.post("/productos", (req, res) => {
  productos.push(req.body);

  res.redirect("/");
});

//socket.io
io.on("connection", (socket) => {
  // Mensaje de bienvenida cuando se conecta un cliente nuevo
  console.log("Nuevo usuario conectado!");

  //Enviamos todos los mensajes al nuevo cliente cuando se conecta
  io.sockets.emit("messageBack", messages);
  io.sockets.emit("messageBack2", productos);
  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
  socket.on("mensajeRespuesta", (data) => {
    console.log(data);
  });

  //Recibimos los mensajes desde el frontend chat
  socket.on("messageFront", (data) => {
    messages.push(data);
    // io.sockets.emit("message", data);
    io.sockets.emit("messageBack", messages);
  });

  //Recibimos los mensajes desde el agregar productos
  socket.on("messageFrontProd", (data) => {
    productos.push(data);
    // io.sockets.emit("message", data);
    io.sockets.emit("messageBack2", productos);
  });
});

server.listen(PORT, () => {
  console.log(`server ON http://localhost:${PORT}`);
});
server.on("error", (err) => console.log(err));
