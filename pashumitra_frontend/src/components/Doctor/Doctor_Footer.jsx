import React from "react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">VetPortal</h3>
          <p className="text-sm text-gray-400">
            Connecting veterinarians with farmers for better animal healthcare.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="#" className="hover:underline">Emergency Contacts</a></li>
            <li><a href="#" className="hover:underline">Medical Guidelines</a></li>
            <li><a href="#" className="hover:underline">Training Resources</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Support</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">Contact Support</a></li>
            <li><a href="#" className="hover:underline">Report Issues</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © 2024 VetPortal. All rights reserved.
      </div>
    </footer>
  )
}
