import { toast } from "react-hot-toast";

const RequestCard = ({ request }) => {
  const getStatusColor = (status) => {
    if (status.toLowerCase() === "under review") {
      return "text-orange-500";
    } else if (status.toLowerCase() === "approved") {
      return "text-green-500";
    } else if (status.toLowerCase() === "rejected") {
      return "text-red-500";
    }
    return "text-gray-500";
  };

  const getStatusBadge = (status) => {
    if (status.toLowerCase() === "pending approval") {
      return "bg-amber-100 text-amber-800";
    } else if (status.toLowerCase() === "approved") {
      return "bg-green-100 text-green-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const getBgColor = (name) => {
    if (name.toLowerCase().includes("oxytetracycline")) {
      return "bg-blue-50";
    } else if (name.toLowerCase().includes("albendazole")) {
      return "bg-amber-50";
    } else if (name.toLowerCase().includes("flunixin")) {
      return "bg-red-50";
    } else if (name.toLowerCase().includes("ceftiofur")) {
      return "bg-teal-50";
    } else if (name.toLowerCase().includes("vitamin")) {
      return "bg-purple-50";
    }
    return "bg-gray-50";
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 flex flex-col md:flex-row md:items-center">
      <div
        className={`${getBgColor(request.name)} w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center text-center p-2 mr-4`}
      >
        <span className="text-sm font-medium">{request.name}</span>
      </div>

      <div className="flex-grow mt-3 md:mt-0">
        <h3 className="text-xl font-bold">{request.name}</h3>
        <p className="text-sm text-gray-600 mt-1">Requested on {request.requestedDate}</p>
        <p className="text-sm mt-1">
          Status: <span className={getStatusColor(request.status)}>{request.status}</span>
        </p>
      </div>

      <div className="mt-3 md:mt-0">
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(request.approvalStatus)}`}>
          {request.approvalStatus}
        </span>
      </div>
    </div>
  );
};

export default RequestCard;
