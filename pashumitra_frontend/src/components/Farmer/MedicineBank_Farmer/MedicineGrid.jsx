import MedicineCard from "./MedicineCard"

const MedicineGrid = ({ medicines }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {medicines.map((medicine, index) => (
        <MedicineCard key={index} medicine={medicine} />
      ))}
    </div>
  )
}

export default MedicineGrid
