import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import logo from "../../assets/images/logo_light.webp";

const Navbar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartCount = useSelector((state) => state.cart.total);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/shop?search=${search}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-white border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 gap-3">
            {/* MENÚ + LOGO */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:text-indigo-600"
              >
                <Menu size={22} />
              </button>

              <img
                src={logo}
                alt="Logo"
                className="h-8 cursor-pointer hidden sm:block"
                onClick={() => navigate("/")}
              />
            </div>

            {/* BUSCADOR (CENTRADO) */}
<form
  onSubmit={handleSearch}
  className="
    flex items-center gap-2
    bg-white
    px-4 py-2
    rounded-full
    border border-indigo-500
    flex-1 max-w-md mx-auto
    transition-colors duration-200
    hover:bg-slate-100
  "
>
  <Search size={18} className="text-indigo-500" />
  <input
    type="text"
    placeholder="Buscar productos..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="
      w-full bg-transparent outline-none
      placeholder-slate-500 text-sm
    "
    required
  />
</form>


            {/* ENLACES DESKTOP */}
            <div className="hidden lg:flex items-center gap-6 text-slate-600 ml-6">
              <Link to="/" className="hover:text-indigo-600 transition">
                Inicio
              </Link>
              <Link to="/shop" className="hover:text-indigo-600 transition">
                Comercio
              </Link>
              <Link to="/about" className="hover:text-indigo-600 transition">
                Sobre Nosotros
              </Link>
              <Link to="/contact" className="hover:text-indigo-600 transition">
                Contacto
              </Link>
            </div>

            {/* BOTÓN ADMIN (SUTIL) */}
            <Link
              to="/admin"
              className="
                hidden lg:flex items-center px-4 py-1.5 text-sm
                border border-slate-300 rounded-full
                text-slate-500 bg-white
                hover:border-indigo-500 hover:text-indigo-600
                transition
              "
            >
              Admin
            </Link>

            {/* CARRITO */}
            <Link
              to="/cart"
              className="relative flex-shrink-0 p-2 text-slate-600 hover:text-indigo-600"
            >
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 text-[10px] bg-slate-700 text-white size-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* MENÚ MÓVIL */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-full h-full bg-white z-50 transform transition-transform duration-300
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <img src={logo} alt="Logo" className="h-8" />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-slate-600 hover:text-indigo-600"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-3">
          {[
            { to: "/", label: "Inicio" },
            { to: "/shop", label: "Comercio" },
            { to: "/about", label: "Sobre Nosotros" },
            { to: "/contact", label: "Contacto" },
            { to: "/admin", label: "Admin" }, // Admin en móvil (discreto)
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 border border-slate-200 rounded-lg
                         text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
