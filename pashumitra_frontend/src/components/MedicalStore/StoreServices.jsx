import { Package, Truck, Pill, Building2, Clock } from "lucide-react"

const StoreServices = () => {
  const services = [
    {
      title: "Manage Inventory",
      description: "Track and manage your medicine inventory efficiently",
      icon: <Package size={24} />,
      iconBg: "bg-blue-600",
    },
    {
      title: "Receive Transport Requests",
      description: "View and process medicine transport requests from farmers",
      icon: <Truck size={24} />,
      iconBg: "bg-blue-600",
    },
    {
      title: "Request Medicines",
      description: "Request medicines from other stores or suppliers",
      icon: <Pill size={24} />,
      iconBg: "bg-green-500",
    },
    {
      title: "Contribute to Medicine Bank",
      description: "Donate medicines to the community medicine bank",
      icon: <Building2 size={24} />,
      iconBg: "bg-orange-500",
    },
    {
      title: "Medicine Expiry Alerts",
      description: "Get alerts about medicines approaching expiry dates",
      icon: <Clock size={24} />,
      iconBg: "bg-red-500",
    },
  ]

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-6">Store Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start">
              <div className={`p-3 rounded-lg ${service.iconBg} text-white mr-4`}>{service.icon}</div>
              <div>
                <h3 className="font-bold mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StoreServices
