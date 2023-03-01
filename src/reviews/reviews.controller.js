const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_PROPERTIES = ["content", "score"];

async function reviewExists(req, res, next) {
  const review = await service.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: "Review cannot be found."});
}

function hasValidProperties(req, res, next) {
  //console.log("valid properties function reached")
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter((field) => !VALID_PROPERTIES.includes(field))

  if(invalidFields.length){
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(",")}`
    })
  }
  next()
}

async function update(req, res, next) {
  const updatedReview = {
    content: req.body.data.content,
    score: req.body.data.score,
    review_id: res.locals.review.review_id,
  };
  await service.update(updatedReview);
  let data = await service.readReviewsAndCritics(res.locals.review.review_id)
  res.json({ data });
}

async function destroy(req, res, next) {
  const { review } = res.locals;
  await service.delete(review.review_id);
  res.sendStatus(204);
}

module.exports = {
  update: [asyncErrorBoundary(reviewExists), hasValidProperties, update],
  delete: [asyncErrorBoundary(reviewExists), destroy],
};
