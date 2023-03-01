const knex = require("../db/connection");

function list() {
  return knex("theaters")
    .join("movies_theaters", "movies_theaters.theater_id","theaters.theater_id")
    .join("movies", "movies.movie_id", "movies_theaters.movie_id")
    .select("theaters.*", "movies.*");
}

module.exports = {
  list,
};
