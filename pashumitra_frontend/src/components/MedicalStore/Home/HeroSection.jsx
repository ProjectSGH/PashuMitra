const HeroSection = () => {
    return (
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-4">Welcome to Meditech Store Portal</h1>
          <p className="mb-8 max-w-3xl">
            Your central hub for managing medical inventory. Handle transport requests, coordinate with other stores, and
            contribute to the community medicine bank.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
              Manage Inventory
            </button>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-full font-medium border border-white hover:bg-blue-700 transition-colors">
              View Requests
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  export default HeroSection
  