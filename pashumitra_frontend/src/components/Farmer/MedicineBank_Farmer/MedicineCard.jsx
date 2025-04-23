import { toast } from "react-hot-toast";
import { Stethoscope, Truck, Calendar, AlertTriangle, Package, TrendingUp, Clock, FileText, PhoneCall } from "lucide-react";

const MedicineCard = ({ medicine }) => {
  const getBgColor = (category) => {
    switch (category.toLowerCase()) {
      case "antiparasitic":
        return "bg-green-50";
      case "antibiotic":
        return "bg-blue-50";
      case "anti-inflammatory":
        return "bg-red-50";
      case "supplement":
        return "bg-purple-50";
      default:
        return "bg-gray-50";
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "antiparasitic":
        return "bg-green-100 text-green-800";
      case "antibiotic":
        return "bg-blue-100 text-blue-800";
      case "anti-inflammatory":
        return "bg-red-100 text-red-800";
      case "supplement":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleRequestMedicine = () => {
    // Show success toast using react-hot-toast
    toast.success("Medicine requested successfully!", {
      duration: 4000,
      position: "bottom-right",
      style: {
        backgroundColor: "#4CAF50",
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "8px",
      },
    });
  };

  return (
    <div className={`${getBgColor(medicine.category)} rounded-lg p-4 h-full flex flex-col`}>
      <h3 className="text-xl font-bold mb-1">{medicine.name}</h3>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(medicine.category)}`}>
          {medicine.category}
        </span>
      </div>
      <p className="text-sm text-gray-700 mb-3 flex-grow">{medicine.description}</p>

      <div className="text-sm mb-1">
        <span className="font-semibold">Quantity: </span>
        {medicine.quantity}
      </div>

      <div className="text-sm mb-1">
        <span className="font-semibold">Expires: </span>
        {medicine.expires}
      </div>

      <div className="text-sm mb-3">
        <span className="font-semibold">Donated by: </span>
        {medicine.donatedBy}
      </div>

      <button
        onClick={handleRequestMedicine} // Trigger the success toast
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
      >
        Request Medicine
      </button>
    </div>
  );
};

export default MedicineCard;
