const knex = require("../db/connection");

function list() {
  return knex("movies").select("*");
}
//called if is_showing is queried in route
function listAllShowing() {
  return knex("movies")
    .join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
    .where({ "movies_theaters.is_showing": true })
    .distinct("movies.movie_id");
}

function read(movieId) {
  return knex("movies")
    .select("*")
    .where({ "movies.movie_id": movieId })
    .first();
}

function readReviews(movieId) {
  return knex("movies")
    .select("reviews.*", "critics.*")
    .join("reviews", "movies.movie_id", "reviews.movie_id")
    .join("critics", "reviews.critic_id", "critics.critic_id")
    .where({ "movies.movie_id": movieId });
}

function readTheaters(movieId) {
  return knex("movies")
    .join("movies_theaters", "movies_theaters.movie_id", "movies.movie_id")
    .join("theaters", "movies_theaters.theater_id", "theaters.theater_id")
    .select("theaters.*")
    .where({ "movies.movie_id": movieId });
}

module.exports = {
  list,
  listAllShowing,
  read,
  readReviews,
  readTheaters,
};
