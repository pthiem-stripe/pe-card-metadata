const stripe = require("stripe")(process.env.STRIPE_SK);

exports.handler = async function (event, context) {
  console.log("/createPaymentIntent", event.body);
  let reqBody = JSON.parse(event.body);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: reqBody.amount,
    currency: reqBody.currency,
    payment_method: reqBody.pm
  });

  console.log("paymentIntent", paymentIntent);
  return {
    statusCode: 200,
    body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
  };
};