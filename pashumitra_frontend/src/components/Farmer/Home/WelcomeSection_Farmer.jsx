export default function WelcomeSection() {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome to Meditech <span className="text-blue-600">Farmer Portal</span>
        </h1>
        <p className="text-gray-600 mb-4">
          Access all the tools you need to care for your animal health needs. Check medicine availability, request
          transport, book consultations with veterinarians, and more.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Check Medicines
          </button>
          <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition">
            Book Consultation
          </button>
        </div>
      </div>
    )
  }
  