"use client"

import { useState } from "react"
import Header from "../../components/MedicalStore/InventoryManagement/Header_Medical"
import SearchBar from "../../components/MedicalStore/InventoryManagement/SearchBar_Medical"
import InventoryTable from "../../components/MedicalStore/InventoryManagement/InventoryTable_Medical"
import EditItemModal from "../../components/MedicalStore/InventoryManagement/EditItemModal_Medical"
import AddItemModal from "../../components/MedicalStore/InventoryManagement/AddItemModal_Medical"


const App = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [sortBy, setSortBy] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [inventory, setInventory] = useState([
      {
        id: 1,
        medicine: "Ivermectin Injection",
        category: "Antiparasitic",
        stock: 42,
        price: 450,
        expiryDate: "Sep 15, 2026",
        manufacturer: "Zoetis",
      },
      {
        id: 2,
        medicine: "Oxytetracycline",
        category: "Antibiotic",
        stock: 8,
        price: 320,
        expiryDate: "Dec 20, 2025",
        manufacturer: "Pfizer Animal Health",
        lowStock: true,
      },
      {
        id: 3,
        medicine: "Calcium Supplement",
        category: "Supplement",
        stock: 35,
        price: 180,
        expiryDate: "May 10, 2026",
        manufacturer: "Vetoquinol",
      },
      {
        id: 4,
        medicine: "Albendazole Suspension",
        category: "Antiparasitic",
        stock: 0,
        price: 275,
        expiryDate: "Feb 28, 2027",
        manufacturer: "Elanco",
        outOfStock: true,
      },
      {
        id: 5,
        medicine: "Multivitamin Injection",
        category: "Supplement",
        stock: 15,
        price: 220,
        expiryDate: "Jul 5, 2025",
        manufacturer: "Intas Pharmaceuticals",
        expiringSoon: true,
      },
      {
        id: 6,
        medicine: "Enrofloxacin Tablets",
        category: "Antibiotic",
        stock: 28,
        price: 350,
        expiryDate: "Mar 15, 2026",
        manufacturer: "Bayer",
      },
      {
        id: 7,
        medicine: "Foot Rot Treatment",
        category: "Antiseptic",
        stock: 12,
        price: 290,
        expiryDate: "Aug 10, 2025",
        manufacturer: "MSD Animal Health",
      },
    ])
  
    const handleAddItem = (newItem) => {
      setInventory([...inventory, { ...newItem, id: inventory.length + 1 }])
      setIsModalOpen(false)
    }
  
    const handleEditItem = (updatedItem) => {
      setInventory(inventory.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
      setIsEditModalOpen(false)
      setEditItem(null)
    }
  
    const handleDeleteItem = (id) => {
      setInventory(inventory.filter((item) => item.id !== id))
    }
  
    const filteredInventory = inventory
      .filter((item) => {
        // Filter by search term
        const matchesSearch =
          item.medicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  
        // Filter by category
        const matchesCategory = selectedCategory ? item.category === selectedCategory : true
  
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        // Sort logic
        if (!sortBy) return 0
  
        if (sortBy === "name") {
          return a.medicine.localeCompare(b.medicine)
        } else if (sortBy === "price-low") {
          return a.price - b.price
        } else if (sortBy === "price-high") {
          return b.price - a.price
        } else if (sortBy === "expiry") {
          return new Date(a.expiryDate) - new Date(b.expiryDate)
        }
  
        return 0
      })
  
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Header />
  
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              setIsModalOpen={setIsModalOpen}
            />
  
            <InventoryTable
              inventory={filteredInventory}
              onDelete={handleDeleteItem}
              onEdit={(item) => {
                setEditItem(item)
                setIsEditModalOpen(true)
              }}
            />
          </div>
        </div>
  
        {isModalOpen && <AddItemModal onClose={() => setIsModalOpen(false)} onAddItem={handleAddItem} />}
        {isEditModalOpen && editItem && (
          <EditItemModal
            item={editItem}
            onClose={() => {
              setIsEditModalOpen(false)
              setEditItem(null)
            }}
            onEditItem={handleEditItem}
          />
        )}
      </div>
    )
  }
  
  export default App
  