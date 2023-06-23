var currencyCloud = require('currency-cloud');
const uuid4 = require('uuid/v4');

currencyCloud.authentication.login({
  environment: 'demo', 
  loginId: process.env.CURRCLOUT_ID,
  apiKey:  process.env.CURRCLOUT_KEY
})

const createBeneficiency = async (req, res) => {
  const {bankAccountHolderName, bankCountry, currency, name, bicSwift, iban} = req.body;
  let beneficiary = await currencyCloud.beneficiaries.create({
    bankAccountHolderName: bankAccountHolderName,
    bankCountry: bankCountry,
    currency: currency,
    name: name,
    bicSwift: bicSwift,
    iban: iban
  })

  return res.send({status: true, data:beneficiary});
}

const createPayment = async (req, res) => {
  const {currency, amount, reason, reference, paymentType, benficiaryId} = req.body;
  const uniqueRequestId = uuid4();

  let payment = await currencyCloud.payments.create({
    currency: currency,
    amount: amount,
    reason: reason,
    reference: reference,
    paymentType: paymentType,
    uniqueRequestId: uniqueRequestId,
    benficiaryId: benficiaryId
  })

  return res.send({status: true, data:payment});
}

const getBalance = async (req, res) => {
  const {currency} = req.params;
  let balance = await currencyCloud.balances.get({currency: currency});
  return res.send({status: false, data: balance});
}


module.exports = {
  createBeneficiency,
  createPayment,
  getBalance
}