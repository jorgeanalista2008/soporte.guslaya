import { SendIcon, ClockFadingIcon, HeadsetIcon } from "lucide-react";
import Title from "../Common/Title";

/* =========================
   DATA EN EL MISMO ARCHIVO
========================= */
const ourSpecsData = [
  {
    title: "Entrega rápida y segura",
    description:
      "Procesamos y entregamos tus pedidos de forma rápida, cuidando cada producto para que llegue en perfectas condiciones.",
    icon: SendIcon,
    accent: "#05DF72",
  },
  {
    title: "Productos verificados",
    description:
      "Todos los productos y servicios se revisan previamente para garantizar calidad, funcionalidad y cumplimiento.",
    icon: ClockFadingIcon,
    accent: "#FF8904",
  },
  {
    title: "Atención personalizada",
    description:
      "Te asesoramos antes y durante tu compra para que elijas exactamente lo que necesitas, sin confusiones.",
    icon: HeadsetIcon,
    accent: "#A684FF",
  },
];


/* =========================
   COMPONENTE
========================= */
const OurSpecs = () => {
  return (
    <div className="px-6 my-20 max-w-6xl mx-auto">
      <Title
        visibleButton={false}
        title="Nuestras Especificaciones"
        description="Ofrecemos un servicio confiable y accesible para que tu experiencia de compra sea segura, rápida y sin preocupaciones."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-10 mt-16">
        {ourSpecsData.map((spec, index) => (
          <div
            key={index}
            className="relative h-44 px-8 flex flex-col items-center justify-center w-full text-center border rounded-lg group"
            style={{
              backgroundColor: spec.accent + "10",
              borderColor: spec.accent + "30",
            }}
          >
            {/* ICONO */}
            <div
              className="absolute -top-5 text-white size-10 flex items-center justify-center rounded-md group-hover:scale-105 transition"
              style={{ backgroundColor: spec.accent }}
            >
              <spec.icon size={20} />
            </div>

            {/* TEXTO */}
            <h3 className="text-slate-800 font-medium mt-4">
              {spec.title}
            </h3>
            <p className="text-sm text-slate-600 mt-3">
              {spec.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurSpecs;
