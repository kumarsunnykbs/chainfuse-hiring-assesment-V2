const StripeController = require("../controller/stripe");

module.exports = (router) => {
  router.post("/fiat/charge", StripeController.getLink);
  router.get("/fiat/getSecret", StripeController.getSecret);
};
