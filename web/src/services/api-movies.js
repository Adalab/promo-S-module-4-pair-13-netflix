// 1. Get all movies

// const getMoviesFromApi = (params) => {
//   console.log("Se están pidiendo las películas de la app");
//   // CAMBIA ESTE FETCH PARA QUE APUNTE A UN ENDPOINT DE TU SERVIDOR, PIENSA SI DEBE SER GET O POST, PIENSA QUÉ DATOS DEBES ENVIAR, ETC. ES MÉTODO GET POR DEFECTO.
//   return fetch(
//     `//localhost:4000/movies?genre=${params.genre}&sort=${params.sort}`
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       // CAMBIA EL CONTENIDO DE ESTE THEN PARA GESTIONAR LA RESPUESTA DEL SERVIDOR Y RETORNAR AL COMPONENTE APP LO QUE NECESITA
//       return data;
//     });
// };


// 16. Get all movies from mongoDB (we comment the other Fetch -> above)
const getMoviesFromApi = (params) => {
  console.log("Se están pidiendo las películas de la app desde mongo");
  return fetch(`//localhost:4000/movies_all_mongo?genre=${params.genre}&sort=${params.sort}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

const getGambitImageFromApi = () => {
  console.log("Se están pidiendo las imágenes de la app");
  return fetch("//localhost:4000/gambita-de-dama.jpg")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

const getFriendsImageFromApi = () => {
  console.log("Se están pidiendo las imágenes de la app");
  return fetch("//localhost:4000/friends.jpg")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

const objToExport = {
  getMoviesFromApi: getMoviesFromApi,
  getGambitImageFromApi: getGambitImageFromApi,
  getFriendsImageFromApi: getFriendsImageFromApi,
};

export default objToExport;
