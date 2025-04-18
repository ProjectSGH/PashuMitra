import { ChevronDown } from "lucide-react"

const Hero = () => {
  return (
    <div className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-blue-600 text-sm font-medium mb-4">Transforming Animal Healthcare</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Efficient Medicine Management
          <br />
          for <span className="text-blue-600">Rural Animal Healthcare</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 mb-8">
          Connecting farmers, medical stores, and veterinarians to improve animal healthcare accessibility in rural
          areas through a centralized platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <a
            href="#"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
          <a href="#" className="text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
            Browse Medicines
          </a>
        </div>
        <div className="flex justify-center">
          <a href="#features" className="text-gray-500 text-sm flex flex-col items-center">
            <span className="mb-2">Scroll to learn more</span>
            <ChevronDown size={20} className="animate-bounce" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Hero
