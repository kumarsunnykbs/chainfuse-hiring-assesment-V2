const StripeController = require("../controller/stripe");

module.exports = (router) => {
  router.post("/stripe", StripeController.getLink);
}

