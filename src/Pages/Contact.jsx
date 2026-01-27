import React, { useState } from "react";
import { 
  Phone, 
  Clock,  
  MessageCircle,
  Send,
  Facebook
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    alert("¡Gracias por tu mensaje! Te contactaremos pronto.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/50245984577", "_blank", "noopener noreferrer");
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-6">
        <div className="max-w-7xl mx-auto py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-slate-800 mb-4">
            Contacto <span className="text-blue-600">-</span>
          </h2>
            <p className="text-base text-slate-600 max-w-3xl mx-auto">
              Estamos aquí para ayudarte. Visítanos, llámanos o escríbenos - en Multiservicios KUK en Chamelco, tu satisfacción es nuestra prioridad.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Información de Contacto */}
            <div className="space-y-8">
              {/* Horarios */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-blue-500 p-3 rounded-full">
                    <Clock className="text-white" size={24} />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800">Horario de Atención</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-slate-600">Lunes a Sábado</span>
                    <span className="font-semibold text-slate-800">7:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Domingo</span>
                    <span className="font-semibold text-slate-800">1:00 PM - 6:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <Phone className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <p className="text-slate-600 text-base">Teléfono</p>
                    <p className="font-semibold text-slate-800">+502 45984577</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Phone className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-slate-600 text-base">Dirección</p>
                    <p className="font-semibold text-slate-800">Aldea Campat, San Juan Chamelco, A.V.</p>
                  </div>
                </div>
              </div>

              {/* Botón WhatsApp */}
              <button
                onClick={openWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle size={24} />
                <span>Chatear por WhatsApp</span>
              </button>

              {/* Redes Sociales */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h4 className="font-bold text-slate-800 mb-4 text-center text-base">Síguenos en Redes Sociales</h4>
                <div className="flex justify-center gap-4">

                  
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all hover:scale-110"
                  >
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Formulario de Contacto */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-3xl font-bold text-slate-800 mb-6">Envíanos un Mensaje</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-medium text-slate-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-slate-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="+502 45984577"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-slate-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    placeholder="Cuéntanos más sobre tu consulta..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
                >
                  <Send size={20} />
                  <span>Enviar Mensaje</span>
                </button>
              </form>
            </div>
          </div>

          {/* Llamado a la acción */}
          <div className="text-center bg-gradient-to-r from-slate-100 to-blue-50 rounded-3xl p-12">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">
              ¿Listo para resolver tus necesidades?
            </h3>
            <p className="text-base text-slate-600 mb-8 max-w-2xl mx-auto">
              En Multiservicios KUK en Chamelco estamos comprometidos con brindarte la mejor atención y soluciones integrales para hacer tu vida más fácil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={openWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-full font-semibold flex items-center gap-3 transition-all hover:scale-105"
              >
                <MessageCircle size={20} />
                WhatsApp Rápido
              </button>
              <a
                href="tel:+50245984577"
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-8 rounded-full font-semibold flex items-center gap-3 transition-all hover:scale-105"
              >
                <Phone size={20} />
                Llamar Ahora
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
