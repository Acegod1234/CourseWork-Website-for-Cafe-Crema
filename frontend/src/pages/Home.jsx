export default function Home() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-amber-800 mb-4 md:mb-6">
          Welcome to Cafe Crema
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8 md:mb-12 leading-relaxed">
          A cozy haven for coffee lovers and foodies alike.
        </p>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-amber-700 mb-4 md:mb-6">
            Our Ambiance
          </h2>
          <p className="text-gray-700 mb-6 md:mb-8 leading-relaxed text-base md:text-lg">
            Step into a world of aromatic brews, warm lighting, and friendly faces. At Cafe Crema, we blend tradition with modern comfort, making every visit a unique experience.
          </p>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-amber-700 mb-4 md:mb-6">
            What Makes Us Unique?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-amber-50 rounded-lg p-4 md:p-6">
              <h3 className="font-semibold text-amber-800 mb-2">☕ Handcrafted Beverages</h3>
              <p className="text-gray-600 text-sm md:text-base">Expertly crafted coffee and gourmet treats</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 md:p-6">
              <h3 className="font-semibold text-amber-800 mb-2">🌱 Locally Sourced</h3>
              <p className="text-gray-600 text-sm md:text-base">Fresh ingredients from local suppliers</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 md:p-6">
              <h3 className="font-semibold text-amber-800 mb-2">🥐 Artisan Pastries</h3>
              <p className="text-gray-600 text-sm md:text-base">Freshly baked daily with love</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 md:p-6">
              <h3 className="font-semibold text-amber-800 mb-2">🏠 Welcoming Space</h3>
              <p className="text-gray-600 text-sm md:text-base">Perfect for work, study, or relaxation</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl p-6 md:p-8 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Experience?
          </h2>
          <p className="text-amber-100 mb-6 text-base md:text-lg">
            Explore our menu, discover today's specials, or place an order to taste the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/menu" 
              className="bg-white text-amber-800 px-6 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors duration-300 text-center"
            >
              View Menu
            </a>
            <a 
              href="/specials" 
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-800 transition-colors duration-300 text-center"
            >
              Today's Specials
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 