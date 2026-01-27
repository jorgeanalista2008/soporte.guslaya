import { Link } from "react-router-dom";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import logo from "../../assets/images/logo_light.webp";

const Footer = () => {
  const linkSections = [
    {
      title: "PRODUCTOS",
      links: [
        { text: "Útiles escolares", path: "/shop" },
        { text: "Accesorios para teléfono", path: "/shop" },
        { text: "Impresiones y calcomanías", path: "/shop" },
        { text: "Tarjeta de circulación", path: "/shop" },
      ],
    },
    {
      title: "EMPRESA",
      links: [
        { text: "Inicio", path: "/" },
        { text: "Comercio", path: "/shop" },
        { text: "Sobre Nosotros", path: "/about" },
        { text: "Contacto", path: "/contact" },
      ],
    },
  ];

  return (
    <>
      {/* FOOTER */}
      <footer className="mx-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 py-10 border-b border-slate-200 text-slate-500">

            {/* LOGO + DESCRIPCIÓN */}
            <div>
              <Link to="/" className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="Logo Multiservicios KUK"
                  className="h-8"
                />
              </Link>

              <p className="max-w-[420px] mt-6 text-sm">
                En <strong>Multiservicios KUK</strong> ofrecemos útiles escolares,
                accesorios para teléfono, impresiones y trámites RENAP.
                Atención rápida, confiable y directa desde Guatemala.
              </p>
            </div>

            {/* LINKS */}
            <div className="flex flex-wrap gap-10 text-sm">
              {linkSections.map((section, index) => (
                <div key={index}>
                  <h3 className="font-medium text-slate-700 mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link, i) => (
                      <li key={i}>
                        <Link
                          to={link.path}
                          className="hover:text-indigo-600 transition"
                        >
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* CONTACTO */}
              <div>
                <h3 className="font-medium text-slate-700 mb-4">CONTACTO</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a
                      href="https://wa.me/50245984577"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-600"
                    >
                      +502 4598 4577
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p className="py-4 text-sm text-slate-500 text-center">
            © 2025 Multiservicios KUK. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* BOTÓN WHATSAPP FLOTANTE */}
      <a
        href="https://wa.me/50245984577?text=Hola%20Multiservicios%20KUK,%20quiero%20información"
        target="_blank"
        rel="noopener noreferrer"
        className="
          fixed bottom-6 right-6 z-[9999]
          bg-green-500 hover:bg-green-600
          text-white p-4 rounded-full
          shadow-2xl
          transition-all duration-300
          hover:scale-110 active:scale-95
        "
        aria-label="WhatsApp Multiservicios KUK"
      >
        <MessageCircle size={28} />
      </a>
    </>
  );
};

export default Footer;
