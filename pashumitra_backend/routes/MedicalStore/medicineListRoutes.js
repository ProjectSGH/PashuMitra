// routes/MedicalStore/medicineListRoutes.js
import express from 'express'
import MedicineList from '../../models/MedicalStore/MedicineList.js'

const router = express.Router()

// Get all medicine list
router.get('/', async (req, res) => {
  try {
    console.log('📦 Fetching medicine list...')
    const medicines = await MedicineList.find()
    console.log(`✅ Found ${medicines.length} medicines`)
    res.json(medicines)
  } catch (error) {
    console.error('❌ Error fetching medicine list:', error)
    res.status(500).json({ error: error.message })
  }
})

// Add more routes if needed
router.post('/', async (req, res) => {
  try {
    const medicine = new MedicineList(req.body)
    await medicine.save()
    res.status(201).json(medicine)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router