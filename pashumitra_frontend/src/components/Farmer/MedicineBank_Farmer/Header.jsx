import { Phone } from "lucide-react"

const Header = () => {
  return (
    <div className="bg-red-500 text-white flex p-4 rounded-t-lg">
      <div className="flex items-start gap-3">
        <Phone className="mt-1" size={24} />
        <div>
          <h1 className="text-xl font-bold">Community Medicine Bank</h1>
          <p className="text-sm mt-1">
            Access donated medicines through our community initiative. These medicines are contributed by medical
            clinics, veterinary clinics, and pharmaceutical companies to support animal healthcare in rural communities.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Header
