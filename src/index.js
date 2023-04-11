const express = require("express");
const cors = require("cors");
/* 1. Instalamos -> npm i mysql2 
   2. Importamos mySql2 + abajo realizamos la conexión (3)
*/
const mysql = require("mysql2/promise");

// create and config server
const server = express();
server.use(cors());
server.use(express.json({ limit: "25mb" }));

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// Import dbConnect from mongoDB
const dbConnect = require("../config/connection");
dbConnect();

// Import model Actor, Movie and User
const Actor = require("../models/actors");
const Movie = require("../models/movies");
const User = require("../models/users");
const Favorite = require("../models/favorites");

// const de la ruta del servidor estátic
const path = require("path");

// 3. Conexión:
let connection; // Aquí almacenaremos la conexión a la base de datos

mysql
  .createConnection({
    host: "127.0.0.1", // = Netflix = nuestra BD
    database: "Netflix",
    user: "root",
    password: "",
  })
  .then((conn) => {
    connection = conn;
    connection
      .connect()
      .then(() => {
        console.log(
          `Conexión establecida con la base de datos (identificador=${connection.threadId})`
        );
      })
      .catch((err) => {
        console.error("Error de conexión: " + err.stack);
      });
  })
  .catch((err) => {
    console.error("Error de configuración: " + err.stack);
  });

// 4. Crea un endpoint para escuchar las peticiones que acabas de programar en el front (mysql)
// server.get("/movies", (req, res) => {
//   const genreFilterParam = req.query.genre ? req.query.genre : "%";
//   const sortFilterParam = req.query.sort ? req.query.sort : "asc";

//   connection
//     .query(
//       `SELECT * FROM movies WHERE gender LIKE ? ORDER BY title ${sortFilterParam}`,
//       [genreFilterParam]
//     )
//     .then(([results, fields]) => {
//       //Con la query, nos ha guardado la tabla de los resultados (el listado) en results
//       console.log("Información recuperada:");
//       results.forEach((result) => {
//         console.log(result);
//       });
//       res.json({
//         success: true,
//         movies: results,
//       });
//     })
//     .catch((err) => {
//       throw err;
//     });
// });

server.post("/login", (req, res) => {
  const emailLogin = req.body.email;
  let passwordLogin = req.body.password;
  console.log([emailLogin, passwordLogin]);
  connection
    .query(
      // Usamos el idUser (col) = id usuaria que tiene ese mail and password. Es la respuesta para el Fetch.
      `SELECT idUser FROM users WHERE email = ? AND password = ?`,
      [emailLogin, passwordLogin]
    )
    .then(([results]) => {
      console.log(results);
      if (results.length === 1) {
        res.json({
          success: true,
          userId: results[0].idUser,
        });
      } else {
        res.json({
          success: false,
          errorMessage: "Usuaria/o no encontrada/o",
        });
      }
    })
    .catch((err) => {
      throw err;
    });
});

// Configurar motor de plantillas (primero instalamos npm i ejs), después lo siguiente:
server.set("view engine", "ejs");

// En ejs siempre usamos RENDER:
server.get("/movie/:movieId", (req, res) => {
  console.log(req.params);
  const idUrl = req.params.movieId;
  connection
    .query("SELECT idMovie, title, gender FROM movies WHERE idMovie = ? ", [
      idUrl,
    ])
    .then(([results]) => {
      const foundMovies = results[0];
      res.render("movie", foundMovies);
    });
});

// Endpoint to render allMovies from MongoDB
// then because -> Model.find() no longer accepts a callback (old version)
// +1 ascending and -1 descending
server.get("/movies_all_mongo", (req, res) => {
  const genreFilterParam = req.query.genre;
  const sortFilterParam = req.query.sort;
  let numberSort;

  if (sortFilterParam === "asc") {
    numberSort = 1;
  } else {
    numberSort = -1;
  }

    if (genreFilterParam !== "") {
    const query = Movie.find({ genre: { $eq: genreFilterParam } })
    .sort({ title: numberSort})
    .then(
      (docs) => {
        res.json({
          success: true,
          movies: docs,
        });
      }
    );
    } else {
     const query = Movie.find({})
     .sort({ title: numberSort})
     .then((docs) => {
      res.json({
        success: true,
        movies: docs,
      });
      });
  }
});

// Endpoint to insert favorite movies to MongoDB
server.post('/favorites-add', (req, res) => {
  const query = Movie.find({ _id: "642d36b21ec0a077732ae1f2" })
  .then((err, docs) => {
    if (err) {
      console.log(err);
    } else {
      console.log(docs);
    }
  });

let idMovie = ObjectId("642d36b21ec0a077732ae1f2")
let idUser = ObjectId("642d3d411ec0a077732ae1f6")
const favorite = new Favorite(
   {
   idUser: idMovie,
   idMovie: idUser,
   score: req.body.score
   }
);
  favorite.create(function (err, doc) {
    res.json(doc);
  });
});


// Configurate express static:
const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

const staticServerPathImage = "./src/public-movies-images";
server.use(express.static(staticServerPathImage));

server.use(express.static("./public"));
