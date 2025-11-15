export default function About() {
  return (
    <div className="min-h-screen py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">About ShellCycle</h1>

        <div className="prose prose-lg max-w-none space-y-6">
          <section className="card">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700">
              ShellCycle is dedicated to transforming seafood waste into valuable
              biomaterials by connecting restaurants with research institutions. We
              believe that crustacean shells should not end up in landfills when they
              can be converted into sustainable, biodegradable materials that benefit
              society and the environment.
            </p>
          </section>

          <section className="card">
            <h2 className="text-2xl font-semibold mb-4">The Problem</h2>
            <p className="text-gray-700 mb-4">
              Every year, the seafood industry generates 6-8 million tons of
              crustacean shell waste globally. Currently, about 90% of this waste
              ends up in landfills, creating environmental challenges:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Landfill space consumption</li>
              <li>Greenhouse gas emissions from decomposition</li>
              <li>Lost opportunities for sustainable material production</li>
              <li>High disposal costs for restaurants</li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-2xl font-semibold mb-4">The Solution</h2>
            <p className="text-gray-700 mb-4">
              Crustacean shells contain chitin, which can be extracted and converted
              into chitosan - a valuable biopolymer with numerous applications:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Biodegradable medical implants and sutures</li>
              <li>Water filtration systems</li>
              <li>Sustainable food packaging</li>
              <li>Agricultural products</li>
              <li>Cosmetics and pharmaceuticals</li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-2xl font-semibold mb-4">How We Work</h2>
            <p className="text-gray-700 mb-4">
              ShellCycle operates as an intelligent matching platform:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>
                <strong>Restaurants</strong> register and submit their weekly shell
                supply data (type, quantity, storage method)
              </li>
              <li>
                <strong>Research Labs</strong> register and specify their shell
                requirements (type, quantity, pickup radius)
              </li>
              <li>
                <strong>Our Algorithm</strong> matches supply with demand based on:
                <ul className="list-disc list-inside ml-8 mt-2 space-y-1">
                  <li>Shell type compatibility</li>
                  <li>Quantity requirements</li>
                  <li>Geographic proximity</li>
                  <li>Pickup frequency</li>
                </ul>
              </li>
              <li>
                <strong>Coordination</strong> Matched parties coordinate pickup
                logistics through our platform
              </li>
            </ol>
          </section>

          <section className="card">
            <h2 className="text-2xl font-semibold mb-4">Impact</h2>
            <p className="text-gray-700">
              By facilitating these connections, ShellCycle helps:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
              <li>Reduce seafood waste going to landfills</li>
              <li>Lower costs for restaurants and research labs</li>
              <li>Accelerate sustainable biomaterial research</li>
              <li>Support the circular economy</li>
              <li>Create new sustainable supply chains</li>
            </ul>
          </section>

          <section className="card bg-ocean-50 border-ocean-200">
            <h2 className="text-2xl font-semibold mb-4 text-ocean-800">
              Join Our Mission
            </h2>
            <p className="text-gray-700">
              Whether you're a restaurant looking to reduce waste or a research lab
              seeking sustainable shell sources, ShellCycle makes it easy to
              participate in the circular economy. Together, we can transform waste
              into valuable resources.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
