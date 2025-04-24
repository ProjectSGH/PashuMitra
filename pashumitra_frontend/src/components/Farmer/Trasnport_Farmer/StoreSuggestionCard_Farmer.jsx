import { MapPin, Clock, Pill, StoreIcon } from "lucide-react";

export default function StoreSuggestionCard({ store, medicineName }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Suggested Store with Stock</h2>

      <div className="flex items-start gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <StoreIcon className="h-6 w-6 text-blue-600" />
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-lg">{store.name}</h3>
          <p className="text-gray-600 mb-2">{store.address}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-blue-600" />
              <span>{store.distance} miles away</span>
            </div>

            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-blue-600" />
              <span>~{store.estimatedDeliveryTime} min delivery</span>
            </div>

            <div className="flex items-center">
              <Pill className="h-4 w-4 mr-1 text-green-600" />
              <span className="text-green-600 font-medium">{medicineName} In Stock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
