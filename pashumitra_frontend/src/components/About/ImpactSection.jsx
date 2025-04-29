"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Users, ShoppingBag, Truck, Clock } from "lucide-react"

export default function ImpactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const stats = [
    {
      icon: Users,
      value: 5000,
      label: "Farmers Served",
      color: "bg-blue-600",
    },
    {
      icon: ShoppingBag,
      value: 12500,
      label: "Crops Sold Directly",
      color: "bg-green-600",
    },
    {
      icon: Truck,
      value: 3200,
      label: "Medicine Deliveries",
      color: "bg-amber-600",
    },
    {
      icon: Clock,
      value: 8500,
      label: "Hours of Consultation",
      color: "bg-purple-600",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Our Impact & Benefits</h2>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-md p-6 text-center"
            >
              <div
                className={`${stat.color} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}
              >
                <stat.icon className="h-8 w-8" />
              </div>
              <CountUp
                target={stat.value}
                isInView={isInView}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
              />
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CountUp({ target, isInView, className }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const duration = 2000
    const increment = target / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start > target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isInView, target])

  return <div className={className}>{count.toLocaleString()}</div>
}
