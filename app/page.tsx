import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-ocean text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Transform Seafood Waste into Sustainable Biomaterials
            </h1>
            <p className="text-xl mb-8 text-ocean-100">
              ShellCycle connects restaurants generating crustacean shell waste with
              research labs extracting chitosan for sustainable biomaterials.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register/restaurant"
                className="btn btn-primary bg-white text-ocean-700 hover:bg-gray-100 px-8 py-3 text-lg"
              >
                I Am a Restaurant
              </Link>
              <Link
                href="/register/lab"
                className="btn bg-ocean-800 text-white hover:bg-ocean-900 px-8 py-3 text-lg"
              >
                I Am a Research Lab
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🦐</div>
              <h3 className="text-xl font-semibold mb-2">1. Restaurants Submit Supply</h3>
              <p className="text-gray-600">
                Seafood restaurants register and list their weekly crustacean shell
                waste by type and quantity.
              </p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">🔬</div>
              <h3 className="text-xl font-semibold mb-2">2. Labs Submit Demand</h3>
              <p className="text-gray-600">
                Research labs specify their shell needs for chitosan extraction and
                biomaterial research.
              </p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold mb-2">3. Intelligent Matching</h3>
              <p className="text-gray-600">
                Our algorithm matches supply with demand based on shell type,
                quantity, and distance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            Sustainability Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="text-4xl font-bold text-ocean-600 mb-2">6-8M</div>
              <p className="text-gray-600">
                Tons of shell waste generated annually worldwide
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">90%</div>
              <p className="text-gray-600">
                Current shell waste that ends up in landfills
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
              <p className="text-gray-600">
                Biodegradable chitosan-based materials
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">$10B+</div>
              <p className="text-gray-600">
                Global chitosan market value by 2027
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">For Restaurants</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Reduce waste disposal costs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Improve sustainability credentials</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Free, convenient shell pickup</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Contribute to circular economy</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">For Research Labs</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Reliable, local shell supply</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Lower material sourcing costs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Support sustainable research</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Access to diverse shell types</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-ocean text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-ocean-100">
            Join the circular economy for seafood waste today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register/restaurant"
              className="btn bg-white text-ocean-700 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Register as Restaurant
            </Link>
            <Link
              href="/register/lab"
              className="btn bg-ocean-800 text-white hover:bg-ocean-900 px-8 py-3 text-lg"
            >
              Register as Lab
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
