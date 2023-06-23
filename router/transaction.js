const TransactionController = require("../controller/transaction");
const authMiddleware = require("../middleware/auth");

module.exports = (router) => {
  router.get("/transaction/:id", TransactionController.getTransactionByID);

  router.get("/transaction/withdraw", TransactionController.getWithdrawTransaction);

  router.get("/transaction/deposit", TransactionController.getDepositTransaction);

  router.post("/transaction/", authMiddleware.auth, TransactionController.makeTransaction);
}

