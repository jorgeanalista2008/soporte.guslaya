import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  // 🔐 Credenciales demo
  const ADMIN_USER = "admin123";
  const ADMIN_PASS = "12389012";

  // 🚀 Inputs precargados
  const [username, setUsername] = useState(ADMIN_USER);
  const [password, setPassword] = useState(ADMIN_PASS);

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      toast.success("Acceso concedido");
      navigate("/store");
    } else {
      toast.error("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

        <h2 className="text-2xl font-semibold text-slate-800 text-center mb-6">
          Panel de Administración
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Usuario precargado */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300
                       text-sm text-slate-700
                       focus:outline-none focus:ring-2 focus:ring-slate-800"
          />

          {/* Contraseña visible y precargada */}
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300
                       text-sm text-slate-700
                       focus:outline-none focus:ring-2 focus:ring-slate-800"
          />

          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-2.5 rounded-lg
                       font-medium hover:bg-slate-900 active:scale-95 transition"
          >
            Acceder
          </button>
        </form>

        {/* Mensaje claro de DEMO */}
        <p className="text-xs text-slate-400 text-center mt-6">
          Modo demostración · Acceso automático
        </p>

      </div>
    </div>
  );
};

export default Login;
