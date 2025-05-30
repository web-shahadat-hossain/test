import { FC } from "react";

const PaymentGateways: FC = () => {
  const paymentMethods = [
    {
      name: "Paypal",
      type: "Big Brands",
      amount: "+$6235",
      icon: (
        <svg
          className="w-8 h-8 text-blue-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.5 9.5c0 .4-.1.8-.2 1.2-.6 2.6-2.8 3.5-5.7 3.5H9.8l-.8 5.2H6.5l.1-.6.8-5.1.1-.3c0-.2.2-.3.4-.3h1.1c2.3 0 4.1-.7 4.6-2.9.2-.8 0-1.5-.3-2-.1-.1-.1-.2-.2-.3" />
          <path d="M8.9 9.5c-.3 1.8-1.6 1.8-2.9 1.8h-.7l.5-3.2c0-.2.2-.3.4-.3h.3c.9 0 1.7 0 2.1.5.3.3.3.7.3 1.2m9.2.7c-.1-.3-.2-.6-.4-.9-.2-.3-.4-.5-.7-.7-.6-.4-1.5-.6-2.7-.6h-3.5c-.3 0-.5.2-.6.5l-1.5 9.5c0 .2.1.4.3.4h2.1l.5-3.2.1-.3c0-.2.2-.3.4-.3h1.1c2.3 0 4.1-.7 4.6-2.9.2-.8.1-1.5-.3-2-.1-.1-.2-.2-.3-.3" />
        </svg>
      ),
    },
    {
      name: "Wallet",
      type: "Bill payment",
      amount: "-$235",
      icon: (
        <svg
          className="w-8 h-8 text-yellow-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M18 4H6C3.79086 4 2 5.79086 2 8V16C2 18.2091 3.79086 20 6 20H18C20.2091 20 22 18.2091 22 16V8C22 5.79086 20.2091 4 18 4Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "Credit card",
      type: "Bill Payment",
      amount: "+$2235",
      icon: (
        <svg
          className="w-8 h-8 text-indigo-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1 10H23"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Payment Gateways
        </h2>
        <button className="text-indigo-600 text-sm hover:text-indigo-700">
          View all transactions
        </button>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                {method.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{method.name}</h3>
                <p className="text-sm text-gray-500">{method.type}</p>
              </div>
            </div>
            <span
              className={`font-medium ${
                method.amount.startsWith("+")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {method.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentGateways;
