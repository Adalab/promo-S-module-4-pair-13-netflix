// 12. Create database on mongoDB
// 13. Create the folder "config" and the file connection.js to connect the server with the database

const mongoose = require("mongoose");

const dbConnect = () => {
  const user = "garciaenricahabito";
  const password = "cDGxujYj4hNvdkPh";
  const dbName = "Netflix";

  const URI = `mongodb+srv://garciaenricahabito:${password}@cluster0.bvgqmrc.mongodb.net/${dbName}?retryWrites=true&w=majority`;

  mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("conectado a mongodb"))
    .catch((e) => console.log("error de conexión", e));
};
module.exports = dbConnect;