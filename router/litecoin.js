const LitecoinController = require("../controller/litecoin");

module.exports = (router) => {
  router.get("/litecoin", LitecoinController.get);
  router.get("/litecoin/getRate", LitecoinController.getRate);
  router.post("/litecoin/confirm", LitecoinController.confirm);
};
