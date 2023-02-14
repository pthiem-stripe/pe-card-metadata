import React, { useState } from "react";

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

const CheckoutForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();

  
  const [errorMessage, setErrorMessage] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [elementReady, setElementReady] = useState(false);
  const [showDiscoutPopup, setShowDiscountPopup] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    let price = 5000;

    setPageLoading(true);
    setErrorMessage(null);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      elements,
    });

    if (error) {
      setErrorMessage(error);
      return;
    }

    const isDiscountEligible = await fetchDiscountEligibility(paymentMethod.id);

    if (isDiscountEligible) {
      price = 4500;
    }

    const clientSecret = await fetchClientSecret(
      price,
      paymentMethod.id
    );

    const responseConfirm = await stripe.confirmPayment({
      clientSecret,
      confirmParams: {
        return_url: process.env.NEXT_PUBLIC_SUCCESS_URL + "?isDiscountEligible=" + isDiscountEligible,
      },
    });

    if (responseConfirm.error) setErrorMessage(responseConfirm.error.message);

    setShowDiscountPopup(true);
  };

  const fetchDiscountEligibility = async (payemtMethodId) => {
    const discountEligibilitResult = await fetch(
      "/.netlify/functions/getDiscountEligibility",
      {
        method: "POST",
        body: JSON.stringify({
          pm: payemtMethodId,
        }),
      }
    );

    const isDiscountEligible = (await discountEligibilitResult.json())
      .isDiscountEligible;
    return isDiscountEligible;
  };

  const fetchClientSecret = async (price, pm) => {
    const createPaymentIntentResult = await fetch(
      "/.netlify/functions/createPaymentIntent",
      {
        method: "POST",
        body: JSON.stringify({
          amount: price,
          pm: pm,
          currency: "SGD",
        }),
      }
    );

    const paymentIntenClientSecret = (await createPaymentIntentResult.json())
      .clientSecret;
    return paymentIntenClientSecret;
  };

  return (
    <>
      <form onSubmit={submitForm} className="mb-12">
        <div className="w-full">
          <PaymentElement
            disabled={pageLoading}
            className="mb-3"
            onReady={() => {
              setElementReady(true);
              props.elementReady(true);
            }}
          />
        </div>
        {elementReady ? (
          <>
            <div className={pageLoading ? "visible" : "hidden"}>
              <div className="h-8 w-8 mx-auto mt-8">
                <img src="loading.gif" />
              </div>
            </div>
            <div className={pageLoading ? "invisible" : "visible"}>
              <button disabled={!stripe} className="buttonPrimary w-full mt-8">
                Submit
              </button>
            </div>
          </>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 text-red text-base text-center text-red-600">
            {errorMessage}
          </div>
        ) : null}
      </form>
    </>
  );
};

export default CheckoutForm;
