const express = require("express");
const cors = require("cors");
/* 1. Install mysql2 -> npm i mysql2 
   2. Import mySql2 + connection (3)
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

// 14. Import dbConnect from mongoDB
const dbConnect = require("../config/connection");
dbConnect();

// Import model Actor, Movie and User
const Actor = require("../models/actors");
const Movie = require("../models/movies");
const User = require("../models/users");
const Favorite = require("../models/favorites");

// const de la ruta del servidor estátic
const path = require("path");

// 3. Connection:
let connection; // Store the connection to database

mysql
  .createConnection({
    host: "127.0.0.1", // = Netflix = our database
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

// 4. Create an endpoint to get the request received from the Front (mysql)
server.get("/movies", (req, res) => {
  const genreFilterParam = req.query.genre ? req.query.genre : "%";
  const sortFilterParam = req.query.sort ? req.query.sort : "asc";

  connection
    .query(
      `SELECT * FROM movies WHERE gender LIKE ? ORDER BY title ${sortFilterParam}`,
      [genreFilterParam]
    )
    .then(([results, fields]) => {
      // results is the result of the query's list
      console.log("Información recuperada:");
      results.forEach((result) => {
        console.log(result);
      });
      res.json({
        success: true,
        movies: results,
      });
    })
    .catch((err) => {
      throw err;
    });
});

// 6. Add login endpoint
server.post("/login", (req, res) => {
  const emailLogin = req.body.email;
  let passwordLogin = req.body.password;
  console.log([emailLogin, passwordLogin]);
  connection
    .query(
      // We use the column idUser which is the user id which contains email and password. It's the response for the fetch.
      "SELECT idUser FROM users WHERE email = ? AND password = ?",
      [emailLogin, passwordLogin]
    )
    .then(([results]) => {
      console.log(results);
      if (results.length === 1) {
        // results is an array of objects
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

// 8. Configure template engines (first npm i ejs), and then:
server.set("view engine", "ejs");

// 9. Set dynamic endpoint movieId to render movie
server.get("/movie/:movieId", (req, res) => {
  console.log(req.params);
  const idUrl = req.params.movieId;
  connection
    .query(
      "SELECT idMovie, title, gender, image FROM movies WHERE idMovie = ? ",
      [idUrl]
    )
    .then(([results]) => {
      // results is an array of objects
      const foundMovies = results[0];
      // "movie" = movie.ejs
      res.render("movie", foundMovies);
    });
});

// 17. Endpoint to render allMovies from MongoDB
// then because -> Model.find() no longer accepts a callback (old version)
// 1 ascending and -1 descending
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
      .sort({ title: numberSort })
      .then((docs) => {
        res.json({
          success: true,
          movies: docs,
        });
      });
  } else {
    const query = Movie.find({})
      .sort({ title: numberSort })
      .then((docs) => {
        res.json({
          success: true,
          movies: docs,
        });
      });
  }
});

// 18. Endpoint to insert favorite movies to MongoDB
server.post("/favorites-add", (req, res) => {
  const query = Movie.find({ _id: "642d36b21ec0a077732ae1f2" }).then(
    (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        console.log(docs);
      }
    }
  );

  // 19. Endpoint to add/create/save favorite movies from MongoDB
  let idMovie = "642d36b21ec0a077732ae1f2";
  let idUser = "642d3d411ec0a077732ae1f6";
  const favorite = new Favorite({
    movies: idMovie,
    users: idUser,
    score: req.body.score,
  });
  favorite.save().then((err, doc) => {
    res.json(doc);
  });
});

// 20. Endpoint to obtain favorite movies from MongoDB
server.get("/favorites-list/:idUser", (req, res) => {
  const idUser = req.params.idUser;
  Favorite.find({ users: idUser })
    .populate({ path: "users movies", select: "name title" })
    .then((response) => res.json(response))
    .catch((error) => {
      console.log(error);
    });
});

// 23. Register new users back. Remove not null except in email and password.
server.post("/signup", (req, res) => {
  const newEmail = req.body.email;
  const newPassword = req.body.password;

  connection
    .query("INSERT INTO Users (email, password) VALUES (?, ?)", [
      newEmail,
      newPassword,
    ])
    .then(([results]) => {
      console.log(results);
      res.json({
        success: true,
        newUserId: "Welcome!",
      });
    })
    .catch((err) => {
      throw err;
    });
});

// 7. Configure express static:
const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

const staticServerPathImage = "./src/public-movies-images";
server.use(express.static(staticServerPathImage));

// 11. Static server for style for dynamic movie.ejs
server.use(express.static("./src/public-movie-style"));
