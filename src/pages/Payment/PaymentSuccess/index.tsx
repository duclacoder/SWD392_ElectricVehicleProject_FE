import { CheckCircle, Download, Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";

const PaymentSuccess = () => {
  const [showReceipt, setShowReceipt] = useState(false);

  const transactionInfo = {
    transactionId: "TXN-2025-789456",
    amount: "850,000,000 VNĐ",
    date: "23 Oct 2025, 14:35:22",
    vehicle: "Mercedes-Benz E-Class 2024",
    vin: "WDD2130451A123456",
    dealer: {
      name: "Luxury Motors Saigon",
      address: "123 Nguyen Hue, District 1, HCMC",
      phone: "+84 28 3823 4567",
      email: "contact@luxurymotors.vn"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-700 to-sky-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-40 right-32 w-24 h-24 border border-white/10 rounded-lg transform rotate-45"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border border-white/10 rounded-lg transform -rotate-12"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Payment Completed!</h1>
              <p className="text-green-50 text-lg">Your transaction has been processed successfully</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Transaction Summary */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-sky-700">
                  Transaction Summary
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 font-medium">Transaction ID</span>
                    <span className="text-gray-900 font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                      {transactionInfo.transactionId}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 font-medium">Amount Paid</span>
                    <span className="text-2xl font-bold text-green-600">
                      {transactionInfo.amount}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Date & Time
                    </span>
                    <span className="text-gray-900 text-right">{transactionInfo.date}</span>
                  </div>

                  <div className="bg-sky-50 rounded-lg p-4 mt-6">
                    <p className="text-sm font-semibold text-sky-900 mb-2">Vehicle Details</p>
                    <p className="text-gray-800 font-medium">{transactionInfo.vehicle}</p>
                    <p className="text-gray-500 text-sm mt-1">VIN: {transactionInfo.vin}</p>
                  </div>
                </div>
              </div>

              {/* Dealer Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-sky-700">
                  Dealer Information
                </h2>
                
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div>
                    <p className="text-lg font-bold text-gray-900 mb-1">
                      {transactionInfo.dealer.name}
                    </p>
                  </div>

                  <div className="flex items-start text-sm">
                    <MapPin className="w-5 h-5 text-sky-700 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{transactionInfo.dealer.address}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Phone className="w-5 h-5 text-sky-700 mr-3 flex-shrink-0" />
                    <a href={`tel:${transactionInfo.dealer.phone}`} className="text-sky-700 hover:text-sky-800 font-medium">
                      {transactionInfo.dealer.phone}
                    </a>
                  </div>

                  <div className="flex items-center text-sm">
                    <Mail className="w-5 h-5 text-sky-700 mr-3 flex-shrink-0" />
                    <a href={`mailto:${transactionInfo.dealer.email}`} className="text-sky-700 hover:text-sky-800 font-medium">
                      {transactionInfo.dealer.email}
                    </a>
                  </div>
                </div>

                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-900">
                    <span className="font-semibold">Next Steps:</span> The dealer will contact you within 24-48 hours to arrange vehicle inspection and delivery.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowReceipt(!showReceipt)}
                className="flex-1 bg-sky-700 hover:bg-sky-800 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Receipt
              </button>
              
              <button
                onClick={() => window.print()}
                className="flex-1 bg-white border-2 border-sky-700 text-sky-700 hover:bg-sky-50 font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Email Receipt
              </button>
              
              <button
                onClick={() => console.log("Navigate to dashboard")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-all flex items-center justify-center"
              >
                Go to Dashboard
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                A confirmation email with all details has been sent to your registered email address.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Questions? Contact our support team 24/7 at support@evmanagement.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-6 text-center">
          <p className="text-white/90 text-sm">
            Thank you for choosing EV Management. We're excited to be part of your journey!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;