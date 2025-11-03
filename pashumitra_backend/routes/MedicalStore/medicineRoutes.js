// routes/MedicalStore/medicineRoutes.js
import express from 'express'
import Medicine from '../../models/MedicalStore/Medicine.js'

const router = express.Router()

// Get medicines by store
router.get('/store/:storeId', async (req, res) => {
  try {
    console.log(`🏪 Fetching medicines for store: ${req.params.storeId}`)
    
    // Validate storeId
    if (req.params.storeId === 'your-store-id') {
      return res.status(400).json({ 
        error: 'Please provide a valid store ID. Replace "your-store-id" with actual store ID.' 
      })
    }

    const medicines = await Medicine.find({ storeId: req.params.storeId })
    console.log(`✅ Found ${medicines.length} medicines for store`)
    res.json(medicines)
  } catch (error) {
    console.error('❌ Error fetching store medicines:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get available medicines for farmers
router.get('/available', async (req, res) => {
  try {
    console.log('👨‍🌾 Fetching available medicines for farmers...')
    const medicines = await Medicine.find({ status: 'In Stock' })
      .populate('storeId', 'email phone storeName') // Populate with actual User fields
      .populate('medicineId')
    
    console.log(`✅ Found ${medicines.length} available medicines`)
    
    const availableMedicines = medicines.map(med => ({
      _id: med._id,
      name: med.name,
      category: med.category,
      type: med.type,
      composition: med.composition,
      quantity: med.quantity,
      status: med.status,
      expiry: med.expiry,
      price: med.price,
      supplier: med.supplier,
      manufacturer: med.manufacturer,
      description: med.description,
      storeName: med.storeId?.storeName || 'Medical Store', // Use email or other available field
      storeId: med.storeId?._id
    }))
    
    res.json(availableMedicines)
  } catch (error) {
    console.error('❌ Error fetching available medicines:', error)
    res.status(500).json({ error: error.message })
  }
})

// Add medicine to store
router.post('/', async (req, res) => {
  try {
    console.log('➕ Adding new medicine to store...')
    const medicine = new Medicine(req.body)
    await medicine.save()
    
    // Populate the saved medicine
    const populatedMedicine = await Medicine.findById(medicine._id)
      .populate('storeId', 'name')
      .populate('medicineId')
    
    console.log('✅ Medicine added successfully')
    res.status(201).json(populatedMedicine)
  } catch (error) {
    console.error('❌ Error adding medicine:', error)
    res.status(400).json({ error: error.message })
  }
})

// Update medicine
router.put('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).populate('storeId', 'name').populate('medicineId')
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' })
    }
    
    res.json(medicine)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete medicine
router.delete('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id)
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' })
    }
    res.json({ message: 'Medicine deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router