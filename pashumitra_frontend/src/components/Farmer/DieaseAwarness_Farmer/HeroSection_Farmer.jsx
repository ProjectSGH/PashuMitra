import { ShieldAlert } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="bg-blue-600 text-white py-12 md:py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <ShieldAlert className="h-16 w-16 md:h-20 md:w-20" />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Stay Aware, Keep Animals Healthy</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">
          Get information about common diseases, symptoms, and prevention tips.
        </p>
      </div>
    </section>
  )
}
