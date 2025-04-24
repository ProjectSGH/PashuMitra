"use client"

import { CheckCircle, Truck, AlertCircle } from "lucide-react"

export default function TransportStatus({
  transportRequested,
  medicineName,
  fromStore,
  toStore,
  estimatedTime,
  onReset,
}) {
  if (!transportRequested) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-md">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <div>
            <h3 className="font-semibold">No Transport Requested</h3>
            <p>Please fill out the form to request medicine transport.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle className="h-6 w-6 text-green-600" />
        <h2 className="text-lg font-semibold text-green-700">Transport Request Confirmed</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-md">
          <p className="text-gray-700">
            Your request for <span className="font-semibold">{medicineName}</span> has been confirmed.
          </p>
          <div className="mt-2 flex items-center text-gray-600">
            <Truck className="h-5 w-5 mr-2 text-blue-600" />
            <p>
              Transport from <span className="font-medium">{fromStore}</span> to{" "}
              <span className="font-medium">{toStore}</span>
            </p>
          </div>
          <p className="mt-2 text-gray-600">
            Estimated delivery time: <span className="font-medium">{estimatedTime} minutes</span>
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-400 text-yellow-700">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <div>
              <h3 className="font-semibold">Tracking Information</h3>
              <p>You will receive SMS updates about your medicine transport status.</p>
            </div>
          </div>
        </div>

        <div
          className="w-full mt-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-center text-gray-700 cursor-pointer hover:bg-gray-200"
          onClick={onReset}
        >
          Request Another Transport
        </div>
      </div>
    </div>
  )
}
