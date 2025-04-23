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
  } from "lucide-react"
  
  export default function ServicesDropdown() {
    const services = [
      { icon: <Stethoscope size={16} />, text: "Medicine Availability" },
      { icon: <Truck size={16} />, text: "Transport Request" },
      { icon: <Calendar size={16} />, text: "Book Consultation" },
      { icon: <AlertTriangle size={16} />, text: "Disease Awareness" },
      { icon: <Package size={16} />, text: "Medicine Bank" },
      { icon: <TrendingUp size={16} />, text: "Predictive Planning" },
      { icon: <Clock size={16} />, text: "Consultation History" },
      { icon: <FileText size={16} />, text: "Request Status" },
      { icon: <PhoneCall size={16} />, text: "Emergency Helpline" },
    ]
  
    return (
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200">
        <div className="py-1">
          {services.map((service, index) => (
            <a key={index} href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <span className="mr-3 text-gray-500">{service.icon}</span>
              {service.text}
            </a>
          ))}
        </div>
      </div>
    )
  }
  