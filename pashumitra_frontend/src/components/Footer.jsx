import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">Meditech</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Transforming animal healthcare accessibility and management for rural communities and veterinary
              professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Medicine Inventory
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Expert Consultation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Community Medicine Bank
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Emergency Helpline
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Awareness Portal
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Health Articles
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex">
                <MapPin size={18} className="text-blue-600 mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm">
                  Meditech Headquarters
                  <br />
                  123 Rural Road, District Zone
                  <br />
                  Agriculture Region, PIN-123456
                </span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-blue-600 mr-2 flex-shrink-0" />
                <a href="mailto:info@meditech.org" className="text-gray-600 text-sm hover:text-blue-600">
                  info@meditech.org
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-blue-600 mr-2 flex-shrink-0" />
                <a href="tel:+911234567890" className="text-gray-600 text-sm hover:text-blue-600">
                  +91 123-456-7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2023 Meditech. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
