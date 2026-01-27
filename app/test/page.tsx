import Link from "next/link"

export default function TestDashboardIndex() {
  const roles = [
    {
      name: "Administrador",
      href: "/test/admin",
      description: "Vista completa del sistema, gestión de usuarios y reportes",
      color: "bg-blue-600 hover:bg-blue-700",
      features: ["Dashboard", "Gestión de Clientes", "Todas las Órdenes", "Reportes y Análisis", "Gestión de Usuarios"],
    },
    {
      name: "Técnico",
      href: "/test/technician",
      description: "Órdenes asignadas y herramientas de diagnóstico",
      color: "bg-green-600 hover:bg-green-700",
      features: ["Dashboard", "Mis Órdenes", "Diagnósticos", "Actualizar Estados"],
    },
    {
      name: "Recepcionista",
      href: "/test/receptionist",
      description: "Recepción de órdenes y gestión de clientes",
      color: "bg-purple-600 hover:bg-purple-700",
      features: ["Dashboard", "Nueva Orden", "Gestión de Órdenes", "Consulta de Clientes"],
    },
    {
      name: "Cliente",
      href: "/test/client",
      description: "Ver órdenes personales e historial",
      color: "bg-orange-600 hover:bg-orange-700",
      features: ["Dashboard", "Mis Órdenes", "Mi Perfil", "Historial de Servicios"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Servicio Técnico Pro - Interfaces de Prueba
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Explora todas las funcionalidades de cada rol sin autenticación
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roles.map((role) => (
            <div key={role.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <Link
                href={role.href}
                className={`${role.color} text-white p-6 block transition-all duration-200 hover:opacity-90`}
              >
                <h3 className="text-2xl font-bold mb-3">{role.name}</h3>
                <p className="text-blue-100 mb-4">{role.description}</p>
                <div className="flex items-center text-blue-100">
                  <span>Explorar Funcionalidades</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Funcionalidades Disponibles:</h4>
                <ul className="space-y-2">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                      <svg
                        className="w-4 h-4 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Nota Importante</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Estas interfaces de prueba simulan usuarios autenticados con datos mock. No requieren login y muestran todas
            las funcionalidades de cada rol para propósitos de demostración y testing.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Características de las Interfaces de Prueba:
            </h3>
            <ul className="text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Sidebar colapsible con navegación completa</li>
              <li>• Datos mock realistas para cada funcionalidad</li>
              <li>• Componentes idénticos a la versión autenticada</li>
              <li>• Todas las páginas y formularios funcionales</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
