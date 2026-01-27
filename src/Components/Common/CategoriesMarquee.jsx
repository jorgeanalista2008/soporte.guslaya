import "./CategoriesMarquee.css";

const services = [
  "🖨️ Impresiones",
  "📚 Útiles escolares",
  "🎧 Accesorios para teléfono",
  "📄 Certificado de nacimiento",
  "💡 Pago de luz",
  "🏦 Génesis Empresarial",
  "🏦 Banco Antigua",
  "💳 Krediya",
  "💳 Credigo",
  "💰 FAFIDES",
  "💼 Interconsumo",
  "🧾 Trámites y pagos",
];

const CategoriesMarquee = () => {
  return (
    <div className="mx-6 mt-10">
      {/* CONTENEDOR IGUAL QUE HERO Y NAVBAR */}
      <div className="max-w-7xl mx-auto">
        <div className="tv-marquee-container">
          <div className="tv-marquee-track">
            {[...services, ...services, ...services].map((item, index) => (
              <span key={index} className="tv-marquee-item">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesMarquee;
