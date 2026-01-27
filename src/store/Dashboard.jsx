import { useEffect, useState } from "react";
import { 
  CircleDollarSignIcon, 
  ShoppingBasketIcon, 
  StarIcon, 
  TagsIcon,
  TrendingUpIcon,
  PackageIcon,
  UsersIcon,
  CalendarIcon
} from "lucide-react";
import Loading from "../Components/Common/Loading";
import { supabase } from "../services/supabase"; // Ajusta la ruta según tu estructura

export default function Dashboard() {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "Q";
  
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalEarnings: 0,
    totalPotentialProfit: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averagePrice: 0,
    recentProducts: [],
    outOfStock: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [timeRange, setTimeRange] = useState('month'); // day, week, month, year

  // Función para obtener datos del dashboard
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Obtener productos
      const { data: productos, error: productosError } = await supabase
        .from('productos')
        .select('*')
        .order('fecha', { ascending: false });

      if (productosError) throw productosError;

      // 2. Obtener pedidos (si tienes tabla pedidos)
      let pedidos = [];
      try {
        const { data: pedidosData } = await supabase
          .from('pedidos')
          .select('*')
          .order('fecha_pedido', { ascending: false })
          .limit(5);
        pedidos = pedidosData || [];
      } catch (e) {
        console.log("No hay tabla de pedidos aún");
      }

      // 3. Calcular métricas
      const totalProducts = productos.length;
      
      // Calcular ganancias potenciales (30% de margen sobre precio de venta)
      const totalRevenue = productos.reduce((sum, producto) => {
        const precioVenta = parseFloat(producto.precio_oferta || producto.precio_original) || 0;
        return sum + precioVenta;
      }, 0);

      const totalPotentialProfit = totalRevenue * 0.30; // 30% de ganancia
      const totalCost = totalRevenue * 0.70; // 70% es el costo
      
      // Calcular promedio de precios
      const averagePrice = totalProducts > 0 ? totalRevenue / totalProducts : 0;
      
      // Productos agotados
      const outOfStock = productos.filter(p => !p.disponible).length;
      
      // Productos recientes (últimos 5)
      const recentProducts = productos.slice(0, 5);
      
      // Calcular total de pedidos
      const totalOrders = pedidos.length;

      setDashboardData({
        totalProducts,
        totalEarnings: totalRevenue, // Ingresos totales (sin restar costos)
        totalPotentialProfit, // Ganancia potencial (30%)
        totalOrders,
        totalRevenue,
        totalCost,
        averagePrice,
        recentProducts,
        outOfStock
      });

      setRecentOrders(pedidos);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tarjetas del panel con datos generales
  const dashboardCardsData = [
    { 
      title: "Total Productos", 
      value: dashboardData.totalProducts, 
      icon: ShoppingBasketIcon,
      change: "+12%",
      color: "bg-blue-500",
      description: "Productos en inventario"
    },
    { 
      title: "Ingresos Totales", 
      value: currency + dashboardData.totalRevenue.toFixed(2), 
      icon: CircleDollarSignIcon,
      change: "+18%",
      color: "bg-green-500",
      description: "Ventas brutas totales"
    },
    { 
      title: "Ganancia Potencial", 
      value: currency + dashboardData.totalPotentialProfit.toFixed(2), 
      icon: TrendingUpIcon,
      change: "+15%",
      color: "bg-purple-500",
      description: "30% margen de ganancia"
    },
    { 
      title: "Pedidos Totales", 
      value: dashboardData.totalOrders, 
      icon: TagsIcon,
      change: "+8%",
      color: "bg-orange-500",
      description: "Total de órdenes"
    },
    { 
      title: "Precio Promedio", 
      value: currency + dashboardData.averagePrice.toFixed(2), 
      icon: PackageIcon,
      change: "+5%",
      color: "bg-teal-500",
      description: "Precio promedio por producto"
    },
    { 
      title: "Agotados", 
      value: dashboardData.outOfStock, 
      icon: ShoppingBasketIcon,
      change: dashboardData.outOfStock > 0 ? "Reabastecer" : "OK",
      color: "bg-red-500",
      description: "Productos sin stock"
    },
  ];

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Refrescar datos cada 30 segundos
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  if (loading) return <Loading />;

  return (
    <div className="p-6 text-slate-500 mb-28">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl">
            Panel de <span className="text-slate-800 font-medium">TecnoMarket GT</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Resumen completo de tu negocio
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <button 
            onClick={() => setTimeRange('day')}
            className={`px-3 py-1 text-sm rounded ${timeRange === 'day' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
          >
            Hoy
          </button>
          <button 
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 text-sm rounded ${timeRange === 'week' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
          >
            Semana
          </button>
          <button 
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 text-sm rounded ${timeRange === 'month' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
          >
            Mes
          </button>
          <button 
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1 text-sm rounded ${timeRange === 'year' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}
          >
            Año
          </button>
        </div>
      </div>

      {/* Tarjetas de información */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {dashboardCardsData.map((card, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 mb-1">{card.title}</p>
                <b className="text-2xl md:text-3xl font-bold text-slate-800">{card.value}</b>
                <p className="text-xs text-slate-400 mt-2">{card.description}</p>
              </div>
              <div className={`p-3 rounded-full ${card.color} text-white`}>
                <card.icon size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className={`text-sm font-medium ${card.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                {card.change}
              </span>
              <span className="text-xs text-slate-400 ml-2">vs. período anterior</span>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Resumen Financiero</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Ingresos Totales:</span>
              <span className="font-semibold text-green-600">
                {currency}{dashboardData.totalRevenue.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Costo Total (70%):</span>
              <span className="font-semibold text-orange-600">
                {currency}{dashboardData.totalCost?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Ganancia Potencial (30%):</span>
              <span className="font-semibold text-purple-600">
                {currency}{dashboardData.totalPotentialProfit.toFixed(2)}
              </span>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-slate-800">Margen de Ganancia:</span>
                <span className="text-lg font-bold text-green-600">30%</span>
              </div>
              <div className="mt-2 bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: '30%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Productos Recientes */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Productos Recientes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b">
                  <th className="pb-3">Producto</th>
                  <th className="pb-3">Precio</th>
                  <th className="pb-3">Ganancia</th>
                  <th className="pb-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-slate-400">
                      No hay productos recientes
                    </td>
                  </tr>
                ) : (
                  dashboardData.recentProducts.map((producto) => (
                    <tr key={producto.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3">
                        <div className="flex items-center">
                          {producto.imagen_url && (
                            <img 
                              src={producto.imagen_url} 
                              alt={producto.nombre}
                              className="w-8 h-8 rounded mr-3"
                              onError={(e) => e.target.src = '/default-image.png'}
                            />
                          )}
                          <span className="font-medium text-sm">{producto.nombre}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="font-semibold">
                          {currency}{parseFloat(producto.precio_oferta || producto.precio_original).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-green-600 font-medium">
                          {currency}{(parseFloat(producto.precio_oferta || producto.precio_original) * 0.30).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-slate-500">
                        {formatDate(producto.fecha)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Estadísticas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <ShoppingBasketIcon className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Productos Activos</p>
              <p className="text-2xl font-bold text-slate-800">{dashboardData.totalProducts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <TrendingUpIcon className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Margen Promedio</p>
              <p className="text-2xl font-bold text-slate-800">30%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full mr-4">
              <CalendarIcon className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Última Actualización</p>
              <p className="text-2xl font-bold text-slate-800">
                {new Date().toLocaleDateString('es-GT')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón para refrescar */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar Datos
        </button>
      </div>
    </div>
  );
}  