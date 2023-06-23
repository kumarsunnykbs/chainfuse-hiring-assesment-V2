const stripe = require("stripe")(
  "sk_test_51N369fLRiwc1SyEZK2DSDHlb3KPnAuouyhbTebBWYsrymXz658pwe4z6U2sRvKnA4zbPYU5zszCn1mOKAGfwtdzf00KU5FpYy3"
);

const getLink = async (req, res) => {
  try {
    const { token } = req.body;

    const charge = await stripe.charges.create({
      amount: 1000,
      currency: "usd",
      source: token, // Replace with your token
    });

    return res.json({ charge });
  } catch (error) {
    return res.json({ status: false, message: error });
  }
};

const getSecret = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, //
      currency: "usd",
    });
    console.log(paymentIntent);
    return res.json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    return res.send({ status: false, message: error });
  }
};
module.exports = {
  getLink,
  getSecret,
};
