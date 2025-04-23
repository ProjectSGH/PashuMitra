import {
  Stethoscope,
  Truck,
  Calendar,
  AlertTriangle,
  Package,
  TrendingUp,
  Clock,
  FileText,
  PhoneCall,
} from "lucide-react";

export default function ServicesDropdown() {
  const services = [
    {
      icon: <Stethoscope size={16} />,
      text: "Medicine Availability",
      link: "/farmer/medicineavailability",
    },
    {
      icon: <Truck size={16} />,
      text: "Transport Request",
      link: "/farmer/transport",
    },
    {
      icon: <Calendar size={16} />,
      text: "Book Consultation",
      link: "/farmer/book-consultation",
    },
    {
      icon: <AlertTriangle size={16} />,
      text: "Disease Awareness",
      link: "/farmer/disease-awareness",
    },
    {
      icon: <Package size={16} />,
      text: "Medicine Bank",
      link: "/farmer/medicinebank",
    },
    {
      icon: <TrendingUp size={16} />,
      text: "Predictive Planning",
      link: "/farmer/predictive-planning",
    },
    {
      icon: <Clock size={16} />,
      text: "Consultation History",
      link: "/farmer/consultation-history",
    },
    {
      icon: <FileText size={16} />,
      text: "Request Status",
      link: "/farmer/request-status",
    },
    {
      icon: <PhoneCall size={16} />,
      text: "Emergency Helpline",
      link: "/farmer/emergency",
    },
  ];

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200">
      <div className="py-1">
        {services.map((service, index) => (
          <a
            key={index}
            href={service.link}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <span className="mr-3 text-gray-500">{service.icon}</span>
            {service.text}
          </a>
        ))}
      </div>
    </div>
  );
}
