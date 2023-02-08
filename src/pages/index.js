import Head from "next/head";

import { useEffect } from "react";
import { useState } from "react";

import { Inter } from "@next/font/google";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const inter = Inter({ subsets: ["latin"] });

import CheckoutForm from "components/Checkout/checkoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK, {
  betas: ["elements_enable_deferred_intent_beta_1"],
});

const options = {
  mode: "payment",
  amount: 1099,
  currency: "sgd",
  appearance: {
    theme: "stripe",
    variables: {
      fontSizeBase: "0.875rem",
      fontFamily:
        'font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      colorText: "#374151",
    },
  },
};


export default function Home() {

  const [elementReady, setElementReady] = useState(false);
  const [showLoadingSpinnger, setShowLoadingSpinner] = useState(false);

  useEffect(() => {
    if (elementReady) setShowLoadingSpinner(false);
    else setShowLoadingSpinner(true);
  }, [elementReady]);

  const updateElementReadyState = (isReady) => {
    setElementReady(isReady);
  };

  return (
    <>
      <Head>
        <title>Stripe Press</title>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="my-6  max-w-7xl mx-auto text-gray-700 text-sm">
        <main className="flex flex-col items-center justify-center ">
          <div className="w-full items-center flex flex-col mb-20  ">
          
            <div className={showLoadingSpinnger ? "visible" : "hidden"}>
              <div className="h-8 w-8 mx-auto">
                <img src="loading.gif" />
              </div>
              <div className="mt-4">Getting things ready...</div>
            </div>
            <div className={showLoadingSpinnger ? "invisible" : "visible"}>
              <div className="grid grid-cols-2 gap-x-8 max-w-6xl m-6 w-full ">
                <div className="w-full flex flex-col">
                  <div className="font-bold text-lg">Payment Details</div>
                  <div className="mt-8">
                    <div className="border-2 rounded bg-gray-200 border-gray-200 mb-6 w-full text-center font-bold">
                 Use any Mastercard and get a 10% discount on your order.
                 <div>5555555555554444</div>
                    </div>
                    <Elements stripe={stripePromise} options={options}>
                      <CheckoutForm
                        update
                        elementReady={(isReady) =>
                          updateElementReadyState(isReady)
                        }
                      />
                    </Elements>
                  </div>
                </div>
                <div className="w-full flex flex-col">
                  <div className="font-bold text-lg">Your Order</div>
                  <div className="border rounded shadow bg-white mt-8">
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
                        <div>Total </div>
                        <div className="uppercase">
                          SGD 50.00
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
