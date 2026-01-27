import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import {useNavigate } from "react-router-dom";
import CategoriesMarquee from "../Common/CategoriesMarquee";

const Hero = () => {
  const currency = "Q";
  const navigate = useNavigate()

  return (
    <div className="mx-6">
      <div className="flex max-xl:flex-col gap-8 max-w-7xl mx-auto mt-6 mb-10">

        {/* HERO PRINCIPAL */}
        <div
          className="relative flex-1 flex flex-col
          bg-gradient-to-br from-slate-900 to-indigo-900
          rounded-3xl xl:min-h-[420px] group overflow-hidden
          border border-indigo-800 text-white"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />

          <div className="p-5 sm:p-16 relative z-10">
            <div className="inline-flex items-center gap-3 bg-indigo-600 text-white pr-4 p-1 rounded-full text-xs sm:text-sm border border-indigo-500">
              <span className="bg-white text-indigo-600 px-3 py-1 max-sm:ml-1 rounded-full text-xs font-medium">
                Dirección
              </span>
              Aldea Campat, San Juan Chamelco
              <ChevronRightIcon className="group-hover:ml-2 transition-all" size={16} />
            </div>

            <h2 className="text-3xl sm:text-5xl leading-[1.2] my-3 font-medium max-w-md">
              En <span className="text-indigo-300">Multiservicios KUK</span>{" "}
              encuentras servicios y productos para tu día a día.
            </h2>

            <div className="text-indigo-100 text-sm font-medium mt-4 sm:mt-8">
              <p className="text-indigo-300">Precios desde</p>
              <p className="text-3xl text-white">{currency}12.90</p>
            </div>

            <button onClick={() => navigate("/shop")} className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md">
              VER CATÁLOGO
            </button>
          </div>

          <img
            className="sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm"
            src="/images/hero.png"
            alt="Multiservicios KUK"
          />
        </div>

        {/* CARDS DERECHA */}
        <div className="flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm">

          {/* SERVICIOS */}
          <div
            className="flex-1 flex items-center justify-between w-full
            bg-gradient-to-br from-emerald-700 to-emerald-800
            rounded-3xl p-6 px-8 group transition-all
            border border-emerald-600 text-white hover:scale-[1.01] hover:shadow-xl"
          >
            <div>
              <p className="text-3xl font-medium max-w-40">
                Trámites y servicios
              </p>
              <p className="flex items-center gap-1 mt-4 text-emerald-100 group-hover:text-white transition-colors">
                RENAP, RTU, pagos, certificaciones y más
                <ArrowRightIcon
                  className="group-hover:ml-2 transition-all"
                  size={18}
                />
              </p>
            </div>

            <img
              className="w-32 transform group-hover:scale-105 transition-transform"
              src="/images/vehiculo.png"
              alt="Servicios Multiservicios KUK"
            />
          </div>

          {/* AUDÍFONOS Y CARGADORES */}
          <div
            className="flex-1 flex items-center justify-between w-full
            bg-gradient-to-br from-indigo-500 to-purple-600
            rounded-3xl p-6 px-8 group transition-all
            border border-indigo-600 text-white hover:scale-[1.01] hover:shadow-xl"
          >
            <div>
              <p className="text-3xl font-medium max-w-40">
                Audífonos y cargadores
              </p>
              <p className="flex items-center gap-1 mt-4 text-indigo-100 group-hover:text-white transition-colors">
                Venta por unidad y al por mayor • Ideal para reventa
                <ArrowRightIcon
                  className="group-hover:ml-2 transition-all"
                  size={18}
                />
              </p>
            </div>

            <img
              className="w-32 transform group-hover:scale-105 transition-transform"
              src="/images/hero2.png"
              alt="Audífonos y cargadores Multiservicios KUK"
            />
          </div>
        </div>
      </div>

      <CategoriesMarquee />
    </div>
  );
};

export default Hero;
