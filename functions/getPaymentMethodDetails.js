const stripe = require("stripe")(process.env.STRIPE_SK);

exports.handler = async function (event, context) {
  console.log("/getPaymentMethodDetails", event.body);
  let reqBody = JSON.parse(event.body);

  const paymentMethod = await stripe.paymentMethods.retrieve(
    reqBody.pm
  )

  console.log("paymentMethod", paymentMethod);
  return {
    statusCode: 200,
    body: JSON.stringify({ paymentMethod: paymentMethod }),
  };
};