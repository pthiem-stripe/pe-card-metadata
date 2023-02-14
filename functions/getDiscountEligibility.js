const stripe = require("stripe")(process.env.STRIPE_SK);

exports.handler = async function (event, context) {
  console.log("/getDiscountEligibility", event.body);
  let reqBody = JSON.parse(event.body);

  const paymentMethod = await stripe.paymentMethods.retrieve(
    reqBody.pm
  )


  console.log("paymentMethod", paymentMethod);

  let isDiscountEligible = false;
  if (
    paymentMethod.card.iin.startsWith("555555") ||
    paymentMethod.card.iin.startsWith("223300") ||
    paymentMethod.card.iin.startsWith("520082")
  ) {
    isDiscountEligible = true;
  }

  console.log("isDiscountEligible", isDiscountEligible)
  return {
    statusCode: 200,
    body: JSON.stringify({ isDiscountEligible: isDiscountEligible }),
  };
};