const express = require("express");
const cors = require("cors");
/* 1. Instalamos -> npm i mysql2 
   2. Importamos mySql2 + abajo realizamos la conexión (3)
*/
const mysql = require("mysql2/promise");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

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

// 4. Crea un endpoint para escuchar las peticiones que acabas de programar en el front
server.get("/movies", (req, res) => {
  const genreFilterParam = req.query.genre ? req.query.genre : "%";
  const sortFilterParam = req.query.sort ? req.query.sort : "asc";

  connection
    .query(`SELECT * FROM movies WHERE gender LIKE ? ORDER BY title ${sortFilterParam}`, [genreFilterParam])
    .then(([results, fields]) => {
      //Con la query, nos ha guardado la tabla de los resultados (el listado) en results
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


server.post("/login", (req, res) => {

  const emailLogin = req.body.email;
  let passwordLogin = req.body.password;
  let textPasswordLogin = passwordLogin.toString();
  const emailDataBase = 'SELECT email FROM users';
  const passwordDataBase = 'SELECT password FROM users';

  if(emailLogin.includes(emailDataBase) || textPasswordLogin.includes(passwordDataBase)) {
    connection
      .query(`SELECT * FROM users WHERE email= ? AND password= ?`, [emailLogin, passwordLogin])
      res.json({
        success: true,
        userId: "id_de_la_usuaria_encontrada"
      });
  } else {
    res.json({
      success: false,
      errorMessage: "Usuaria/o no encontrada/o"
    });

  }
  connection.catch((err) => {
    throw err;
  });
      
});
