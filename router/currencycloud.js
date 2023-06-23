const CurrencyCloudController = require("../controller/currencycloud");

module.exports = (router) => {

  router.get("/currencycloud/balance/:currency", CurrencyCloudController.getBalance);

  router.post("/currencycloud/beneficiency", CurrencyCloudController.createBeneficiency);

  router.post("/currencycloud/payment", CurrencyCloudController.createPayment);



}

