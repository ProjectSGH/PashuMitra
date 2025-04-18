import { Link, UserPlus, Store, Check } from "lucide-react"

const RoleCard = ({ icon, title, description, features, buttonText, buttonColor }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${buttonColor === "green" ? "bg-green-100" : buttonColor === "blue" ? "bg-blue-100" : "bg-purple-100"}`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>

      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check size={16} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const Roles = () => {
  const roles = [
    {
      icon: <Link size={24} className="text-green-500" />,
      title: "Farmer",
      description: "Access medicine availability, request consultations, and get emergency support for your animals.",
      features: ["Medicine availability checking", "Book veterinary consultations", "Emergency helpline access"],
    },
    {
      icon: <UserPlus size={24} className="text-blue-600" />,
      title: "Veterinary Doctor",
      description: "Provide expert consultations, prescribe treatments, and help with animal healthcare.",
      features: ["Manage consultations", "Chat with farmers", "Upload educational articles"],
    },
    {
      icon: <Store size={24} className="text-purple-600" />,
      title: "Medical Store Owner",
      description: "Manage inventory, coordinate with other stores, and fulfill medicine requests efficiently.",
      features: ["Inventory management", "Handle transport requests", "Medicine bank contribution"],
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Role</h2>
          <p className="max-w-3xl mx-auto text-gray-600">
            Our platform provides specialized experiences for different roles in the animal healthcare ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <RoleCard
              key={index}
              icon={role.icon}
              title={role.title}
              description={role.description}
              features={role.features}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Roles
