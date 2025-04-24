"use client"

import React from "react"
import { Search, Filter, ArrowUpDown, Plus } from "lucide-react"

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  setIsModalOpen,
}) => {
  const categories = ["Antibiotic", "Antiparasitic", "Supplement", "Antiseptic"]
  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "price-low", label: "Price (Low to High)" },
    { value: "price-high", label: "Price (High to Low)" },
    { value: "expiry", label: "Expiry Date" },
  ]

  const [showCategoryDropdown, setShowCategoryDropdown] = React.useState(false)
  const [showSortDropdown, setShowSortDropdown] = React.useState(false)

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="relative w-full md:w-auto flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name or manufacturer"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter by Category
          </button>

          {showCategoryDropdown && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  className={`block px-4 py-2 text-sm w-full text-left ${!selectedCategory ? "bg-gray-100 text-gray-900" : "text-gray-700"}`}
                  onClick={() => {
                    setSelectedCategory("")
                    setShowCategoryDropdown(false)
                  }}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`block px-4 py-2 text-sm w-full text-left ${selectedCategory === category ? "bg-gray-100 text-gray-900" : "text-gray-700"}`}
                    onClick={() => {
                      setSelectedCategory(category)
                      setShowCategoryDropdown(false)
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </button>

          {showSortDropdown && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`block px-4 py-2 text-sm w-full text-left ${sortBy === option.value ? "bg-gray-100 text-gray-900" : "text-gray-700"}`}
                    onClick={() => {
                      setSortBy(option.value)
                      setShowSortDropdown(false)
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </button>
      </div>
    </div>
  )
}

export default SearchBar
