const PetImageCard = () => (
  <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-100 h-64">
    <img
      src="https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="Pet"
      className="w-full h-full object-cover"
    />
    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
      <h3 className="text-white text-lg font-semibold">Maxi</h3>
      <p className="text-white text-sm">Banho às 09:00</p>
    </div>
  </div>
);

export default PetImageCard;
