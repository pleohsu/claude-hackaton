export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">ShellCycle</h3>
            <p className="text-gray-300 text-sm">
              Transforming seafood waste into sustainable biomaterials through
              intelligent matching of restaurants and research labs.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-300 hover:text-white text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="/register/restaurant" className="text-gray-300 hover:text-white text-sm">
                  For Restaurants
                </a>
              </li>
              <li>
                <a href="/register/lab" className="text-gray-300 hover:text-white text-sm">
                  For Research Labs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-300 text-sm">
              Questions? Reach out to us at:
              <br />
              <a href="mailto:info@shellcycle.com" className="text-ocean-300 hover:text-ocean-200">
                info@shellcycle.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} ShellCycle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
