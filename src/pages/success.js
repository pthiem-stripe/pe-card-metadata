import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  const [isDiscountEligible, setIsDiscountEligible] = useState(true);
  const [showLoadingSpinnger, setShowLoadingSpinner] = useState(true);

  useEffect(() => {
     if (!router.isReady) return;

     setShowLoadingSpinner(false);
     setIsDiscountEligible(router.query.isDiscountEligible === "true" ? true : false);
    console.log(
      "router.query.isDiscountEligible",
      router.query.isDiscountEligible
    );
  }, [router.isReady]);


  const hide = false;

  return (
    <>
      <Head>
        <title>Stripe Press</title>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="my-6  max-w-7xl mx-auto text-gray-700 text-sm">
        <main className="flex flex-col items-center justify-center ">
          <div className={showLoadingSpinnger ? "visible" : "hidden"}>
            <div className="h-8 w-8 mx-auto">
              <img src="loading.gif" />
            </div>
            <div className="mt-4">Getting things ready...</div>
          </div>
          <div className={showLoadingSpinnger ? "invisible" : "visible"}>
            <div className="w-full items-center flex flex-col mb-20  ">
              <div className="font-bold uppercase">PAyment successful</div>
              <div className="my-4">Your books will be on their way soon</div>

              <div className="flex flex-col mx-auto max-w-3xl  mb-4  ">
                {/* header */}

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

                      {isDiscountEligible && (
                        <>
                          <div className="mt-1 mx-5 flex justify-between  text-lg text-red-700 font-bold">
                            <div>Mastercard promotion (10%) </div>
                            <div className="uppercase">SGD -5.00</div>
                          </div>

                          <div className="mt-1 mx-5 flex justify-between  text-lg font-bold">
                            <div>Total </div>
                            <div className="uppercase">SGD 45.00</div>
                          </div>
                        </>
                      )}

                      {!isDiscountEligible && (
                        <div className="mt-1 mx-5 flex justify-between  text-lg font-bold">
                          <div>Total </div>
                          <div className="uppercase">SGD 50.00</div>
                        </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/">
                  <button className="buttonPrimary w-full mt-6">restart</button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
