import { Info } from "lucide-react"

const InfoBanner = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 my-4 rounded-lg flex items-start gap-3">
      <Info className="text-blue-500 mt-1" size={20} />
      <div>
        <h2 className="font-semibold">How the Medicine Bank works:</h2>
        <p className="text-sm mt-1">
          Browse the available medicines, make a request, and our team will verify your requirements. Once approved,
          you'll receive a notification to collect the medicine from the nearest distribution center. If you are a
          provider feel free to contact us to certify yourself.
        </p>
      </div>
    </div>
  )
}

export default InfoBanner
