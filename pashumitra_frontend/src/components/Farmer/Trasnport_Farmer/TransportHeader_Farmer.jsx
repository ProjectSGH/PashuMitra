import { Truck, Pill } from "lucide-react"

export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Pill className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Medicine Transport System</h1>
        <Truck className="h-8 w-8 text-blue-600" />
      </div>
      <div className="max-w-3xl bg-white border border-blue-100 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">Nearby store out of stock?</h2>
        <p className="text-gray-600">
          When your required medicine is unavailable at the nearest store, you can request transport from another store
          that has it in stock. Simply fill in the details below and we'll arrange delivery to your preferred location.
        </p>
      </div>
    </header>
  )
}
