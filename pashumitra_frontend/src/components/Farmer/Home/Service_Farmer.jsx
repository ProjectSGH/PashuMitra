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
  
  export default function FarmerServices() {
    const services = [
      {
        icon: <Stethoscope size={20} className="text-white" />,
        title: "Medicine Availability",
        description: "Check availability of medicines for your animals",
        bgColor: "bg-emerald-500",
      },
      {
        icon: <Truck size={20} className="text-white" />,
        title: "Transport Request",
        description: "Request medicine transport from nearby stores",
        bgColor: "bg-blue-600",
      },
      {
        icon: <Calendar size={20} className="text-white" />,
        title: "Book Consultation",
        description: "Schedule veterinary consultations for your animals",
        bgColor: "bg-purple-600",
      },
      {
        icon: <AlertTriangle size={20} className="text-white" />,
        title: "Disease Awareness",
        description: "Get information about seasonal diseases and prevention",
        bgColor: "bg-amber-500",
      },
      {
        icon: <Package size={20} className="text-white" />,
        title: "Medicine Bank",
        description: "Access donated medicines through community medicine bank",
        bgColor: "bg-red-500",
      },
      {
        icon: <TrendingUp size={20} className="text-white" />,
        title: "Predictive Planning",
        description: "Plan ahead for medicine needs based on seasons",
        bgColor: "bg-teal-500",
      },
      {
        icon: <Clock size={20} className="text-white" />,
        title: "Consultation History",
        description: "View your past consultations with veterinarians",
        bgColor: "bg-pink-500",
      },
      {
        icon: <FileText size={20} className="text-white" />,
        title: "Request Status",
        description: "Track status of your medicine transport requests",
        bgColor: "bg-orange-500",
      },
      {
        icon: <PhoneCall size={20} className="text-white" />,
        title: "Emergency Helpline",
        description: "Contact emergency veterinary services",
        bgColor: "bg-rose-500",
      },
    ]
  
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Farmer Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    )
  }
  
  function ServiceCard({ service }) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
        <div className="flex items-start rounded-lg">
          <div className={`${service.bgColor} p-2 rounded-lg mr-3`}>{service.icon}</div>
          <div>
            <h3 className="font-medium text-gray-900">{service.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
          </div>
        </div>
      </div>
    )
  }
  