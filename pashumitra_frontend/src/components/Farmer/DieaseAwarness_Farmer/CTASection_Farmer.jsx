import { Stethoscope } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-12 text-center">
      <div className="bg-blue-600 text-white rounded-xl p-8 md:p-12 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Need expert help?</h2>
        <p className="mb-8 text-lg max-w-2xl mx-auto">
          Our veterinary experts are available to provide guidance on disease prevention and treatment for your
          livestock.
        </p>
        <button className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium">
          <Stethoscope className="mr-2 h-5 w-5" />
          Consult a Vet
        </button>
      </div>
    </section>
  )
}
