import { Package, FileText, BarChart2, Clock } from "lucide-react"

const StatsCards = () => {
  const stats = [
    {
      title: "Total Stock Items",
      value: "247",
      icon: <Package size={20} />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Pending Requests",
      value: "14",
      icon: <FileText size={20} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Low Stock Items",
      value: "23",
      icon: <BarChart2 size={20} />,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Near Expiry",
      value: "8",
      icon: <Clock size={20} />,
      color: "bg-yellow-100 text-yellow-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
            <div className={`p-2 rounded-full ${stat.color}`}>{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
