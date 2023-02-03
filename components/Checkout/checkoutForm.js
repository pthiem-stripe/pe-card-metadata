import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

const CheckoutForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState(null);
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

    const paymentMethodWithDetails = await fetchPaymentMethodDetails(
      paymentMethod.id
    );

    console.log(paymentMethodWithDetails);

    let isPromotion = false;
    if (
      paymentMethodWithDetails.card.iin.startsWith("555555") ||
      paymentMethodWithDetails.card.iin.startsWith("223300") ||
      paymentMethodWithDetails.card.iin.startsWith("520082")
    ) {
      price = 4500;
      isPromotion = true;
      setShowDiscountPopup(true);
    }

    const clientSecret = await fetchClientSecret(
      price,
      paymentMethodWithDetails.id
    );

    setClientSecret(clientSecret);
    if (!isPromotion) confirmPayment(clientSecret);
  };

  const confirmPayment = async (clientSecret) => {
    const responseConfirm = await stripe.confirmPayment({
      clientSecret,
      confirmParams: {
        return_url: process.env.NEXT_PUBLIC_SUCCESS_URL,
      },
    });

    if (responseConfirm.error) setErrorMessage(responseConfirm.error.message);
    setPageLoading(false);
  };

  const fetchPaymentMethodDetails = async (payemtMethodId) => {
    const paymentMethodDetailsResult = await fetch(
      "/.netlify/functions/getPaymentMethodDetails",
      {
        method: "POST",
        body: JSON.stringify({
          pm: payemtMethodId,
        }),
      }
    );

    const paymentMethod = (await paymentMethodDetailsResult.json())
      .paymentMethod;
    return paymentMethod;
  };

  const fetchClientSecret = async (price, pm) => {
    const createPaymentIntentResult = await fetch(
      "/.netlify/functions/createPaymentIntent",
      {
        method: "POST",
        body: JSON.stringify({
          amount: price,
          pm: pm,
          currency: "AUD",
        }),
      }
    );

    const paymentIntenClientSecret = (await createPaymentIntentResult.json())
      .clientSecret;
    return paymentIntenClientSecret;
  };

  return (
    <form onSubmit={submitForm} className="mb-12">
      {showDiscoutPopup ? (
        <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
          <div className="modal-overlay absolute w-full h-full bg-gray-500 opacity-80"></div>
          <div className="modal-container bg-white w-11/12 md:max-w-2xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="modal-content  py-4 text-left px-6">
              <div>
                <div className="flex flex-col mx-auto  mb-4  ">
                  {/* header */}
                  <div className="flex justify-between items-center pb-3 text-center">
                    <p className="text-2xl mx-auto font-bold">
                      Mastercard discount applied!
                    </p>
                  </div>

                  <div className="mx-auto">
                    <div className="border rounded shadow bg-white ">
                      <div className="flex flex-col h-full rounded">
                        <div className="columns-2 gap-0">
                          <img
                            src="prince-of-persia.jpeg"
                            className="rounded-t"
                            alt="prince of persia"
                          ></img>
                          <img
                            src="working-in-public.jpeg"
                            className="rounded-t"
                            alt="prince of persia"
                          ></img>
                        </div>
                        <div className="mx-5 mt-5 flex justify-between  text-lg ">
                          <div>Prince of Persia</div>
                          <div className="uppercase">SGD 23.00</div>
                        </div>
                        <div className="mt-1 mx-5 flex justify-between  text-lg border-b-2">
                          <div>Working in Public</div>
                          <div className="uppercase">SGD 27.00</div>
                        </div>

                        <div className="mt-1 mx-5 flex justify-between  text-lg font-bold">
                          <div>Mastercard promotion (10%) </div>
                          <div className="uppercase">SGD -5.00</div>
                        </div>

                        <div className="mt-1 mx-5 flex justify-between  text-lg font-bold">
                          <div>Total </div>
                          <div className="uppercase">SGD 45.00</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex  justify-center mx-auto">
                <button
                  className="buttonPrimary"
                  onClick={() => {
                    setShowDiscountPopup(!showDiscoutPopup);
                    confirmPayment(clientSecret);
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

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
  );
};

export default CheckoutForm;
