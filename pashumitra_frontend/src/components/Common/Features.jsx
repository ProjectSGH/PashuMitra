import { Search, Store, Truck, MessageSquare, Phone, BarChart3, Heart } from "lucide-react"

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 text-blue-600">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

const Features = () => {
  const features = [
    {
      icon: <Search size={24} />,
      title: "Medicine Inventory System",
      description:
        "Centralized platform for farmers to check medicine availability in real-time across all local stores.",
    },
    {
      icon: <Store size={24} />,
      title: "Medical Store Portal",
      description:
        "Specialized dashboard for store owners to update stock, manage inventory, and handle medicine requests.",
    },
    {
      icon: <Truck size={24} />,
      title: "Medicine Transport System",
      description: "Efficient logistics for transferring medicines between stores to meet urgent demand.",
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Expert Consultation",
      description:
        "Connect directly with veterinarians for timely advice and emergency support through chat and video calls.",
    },
    {
      icon: <Phone size={24} />,
      title: "Emergency Helpline",
      description: "Quick access to contact details for critical veterinary services and 24/7 emergency support.",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Predictive Medicine Supply",
      description:
        "AI-powered forecasting to predict medicine demand based on seasonal patterns and disease outbreaks.",
    },
    {
      icon: <Heart size={24} />,
      title: "Community Medicine Bank",
      description: "Donation-based system where NGOs and governmental agencies can contribute essential medicines.",
    },
  ]

  return (
    <section id="features" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Key Features & <span className="text-blue-600">Modules</span>
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600">
            Our platform offers a comprehensive suite of tools designed to address the unique challenges of animal
            healthcare in rural communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
