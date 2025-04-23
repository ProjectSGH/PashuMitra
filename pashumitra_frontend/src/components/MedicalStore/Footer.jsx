import { Facebook, Twitter, Linkedin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">
                M
              </div>
              <span className="ml-2 text-lg font-bold">Meditech</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Transforming animal healthcare accessibility and management for rural communities and veterinary
              professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink text="Home" />
              <FooterLink text="Medicine Inventory" />
              <FooterLink text="Dashboard" />
              <FooterLink text="Expert Consultation" />
              <FooterLink text="Community Medicine Bank" />
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <FooterLink text="Emergency Helpline" />
              <FooterLink text="Awareness Portal" />
              <FooterLink text="Health Articles" />
              <FooterLink text="FAQs" />
              <FooterLink text="Contact Us" />
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium mb-4">Contact</h3>
            <address className="not-italic text-sm text-gray-600">
              <p className="mb-2">Meditech District Center</p>
              <p className="mb-2">123 Rural Road, District Zone</p>
              <p className="mb-4">Agriculture Region, PIN: 530068</p>
              <p className="mb-2">
                <span className="font-medium">Email:</span>{" "}
                <a href="mailto:help@meditech.org" className="text-blue-600 hover:underline">
                  help@meditech.org
                </a>
              </p>
              <p>
                <span className="font-medium">Phone:</span> +91 123-456-7890
              </p>
            </address>
          </div>
        </div>
      </div>
    </footer>
  )
}

const FooterLink = ({ text }) => {
  return (
    <li>
      <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
        {text}
      </a>
    </li>
  )
}

export default Footer
