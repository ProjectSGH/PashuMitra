import PageHeader from "../../components/MedicalStore/RequestMedicines/PageHeader"
import EmptyState from "../../components/MedicalStore/RequestMedicines/EmptyState"

const RequestMedicines = () => {
  return (
    <div className="h-auto bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-6">
        <PageHeader />
        <div className="mt-6">
          <EmptyState />
        </div>
      </main>
    </div>
  )
}

export default RequestMedicines
