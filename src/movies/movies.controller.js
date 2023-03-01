const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { whereNotExists } = require("../db/connection");

async function list(req, res) {
  const isShowing = req.query.is_showing;
  //console.log(isShowing)tested and it works
  if (isShowing) {
    const data = await service.listAllShowing();
    res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data });
  }
}

//valid movieId route
async function validMovieId(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found." });
}

async function read(req, res) {
  res.json({ data: res.locals.movie });
}

async function readReviews(req, res, next) {
  let data = await service.readReviews(req.params.movieId);
  data = data.map((review) => {
    return {
      review_id: review.review_id,
      content: review.content,
      score: review.score,
      created_at: review.created_at,
      updated_at: review.updated_at,
      critic_id: review.critic_id,
      movie_id: review.movie_id,
      critic: {
        critic_id: review.critic_id,
        preferred_name: review.preferred_name,
        surname: review.surname,
        organization_name: review.organization_name,
        created_at: review.created_at,
        updated_at: review.updated_at,
      },
    };
  });
  res.json({ data });
}

async function readTheaters(req, res, next) {
  const data = await service.readTheaters(req.params.movieId);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(validMovieId), read],
  readReviews: [asyncErrorBoundary(validMovieId), readReviews],
  readTheaters: [asyncErrorBoundary(validMovieId), readTheaters],
};
