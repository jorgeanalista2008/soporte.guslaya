import { useEffect, useState } from "react";
import Loading from "../Components/Common/Loading";
import { supabase } from "../services/supabase"; 
import { CheckCircle, XCircle, Clock, Package, Truck, Home, Mail, Phone, MapPin } from "lucide-react";

export default function PedidosTienda() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    pendientes: 0,
    procesando: 0,
    enviados: 0,
    entregados: 0
  });
  const [filtroEstado, setFiltroEstado] = useState("todos");
  
  const currency = "Q"; // Quetzales

  // Obtener pedidos reales de Supabase
  const obtenerPedidos = async () => {
    setCargando(true);
    try {
      console.log("Consultando pedidos en Supabase...");
      
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('fecha_pedido', { ascending: false });

      if (error) {
        console.error("Error al obtener pedidos:", error);
        throw new Error(error.message);
      }

      console.log("Pedidos obtenidos:", data?.length || 0);
      
      // Calcular estadísticas
      calcularEstadisticas(data || []);
      
      setPedidos(data || []);
    } catch (error) {
      console.error("Error en obtenerPedidos:", error);
      alert("Error al cargar pedidos: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  // Actualizar estado del pedido en Supabase
  const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      console.log(`Actualizando pedido ${pedidoId} a estado: ${nuevoEstado}`);
      
      const { error } = await supabase
        .from('pedidos')
        .update({ 
          estado: nuevoEstado,
          updated_at: new Date().toISOString()
        })
        .eq('id', pedidoId);

      if (error) throw error;

      // Actualizar estado local
      setPedidos((prev) =>
        prev.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
        )
      );

      // Recalcular estadísticas
      calcularEstadisticas(pedidos.map(p => 
        p.id === pedidoId ? {...p, estado: nuevoEstado} : p
      ));

      alert(`✅ Estado del pedido actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("❌ Error al actualizar estado del pedido");
    }
  };

  // Calcular estadísticas
  const calcularEstadisticas = (pedidosData) => {
    const total = pedidosData.length;
    const pendientes = pedidosData.filter(p => p.estado === 'pendiente').length;
    const procesando = pedidosData.filter(p => p.estado === 'procesando').length;
    const enviados = pedidosData.filter(p => p.estado === 'enviado').length;
    const entregados = pedidosData.filter(p => p.estado === 'entregado').length;
    
    setEstadisticas({
      total,
      pendientes,
      procesando,
      enviados,
      entregados
    });
  };

  // Filtrar pedidos por estado
  const pedidosFiltrados = filtroEstado === "todos" 
    ? pedidos 
    : pedidos.filter(pedido => pedido.estado === filtroEstado);

  // Obtener icono según estado
  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'pendiente':
        return <Clock className="text-yellow-500" size={16} />;
      case 'procesando':
        return <Package className="text-blue-500" size={16} />;
      case 'enviado':
        return <Truck className="text-purple-500" size={16} />;
      case 'entregado':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'cancelado':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  // Obtener color según estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return "bg-yellow-100 text-yellow-800";
      case 'procesando':
        return "bg-blue-100 text-blue-800";
      case 'enviado':
        return "bg-purple-100 text-purple-800";
      case 'entregado':
        return "bg-green-100 text-green-800";
      case 'cancelado':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const abrirModal = (pedido) => {
    setPedidoSeleccionado(pedido);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setPedidoSeleccionado(null);
    setModalAbierto(false);
  };

  useEffect(() => {
    obtenerPedidos();
    
    // Opcional: Refrescar cada 30 segundos
    const interval = setInterval(obtenerPedidos, 30000);
    return () => clearInterval(interval);
  }, []);

  if (cargando) return <Loading />;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl text-slate-500 mb-2">
        Pedidos de la <span className="text-slate-800 font-semibold">Tienda</span>
      </h1>
      <p className="text-slate-400 text-sm mb-6">
        Gestiona y monitorea todos los pedidos de tus clientes
      </p>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Total Pedidos</p>
              <p className="text-2xl font-bold text-slate-800">{estadisticas.total}</p>
            </div>
            <div className="bg-slate-100 p-2 rounded-full">
              <Package className="text-slate-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <Clock className="text-yellow-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Procesando</p>
              <p className="text-2xl font-bold text-blue-600">{estadisticas.procesando}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Package className="text-blue-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Enviados</p>
              <p className="text-2xl font-bold text-purple-600">{estadisticas.enviados}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <Truck className="text-purple-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Entregados</p>
              <p className="text-2xl font-bold text-green-600">{estadisticas.entregados}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="text-green-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setFiltroEstado("todos")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filtroEstado === "todos" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700"}`}
          >
            Todos ({estadisticas.total})
          </button>
          <button
            onClick={() => setFiltroEstado("pendiente")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${filtroEstado === "pendiente" ? "bg-yellow-100 text-yellow-800 border border-yellow-300" : "bg-slate-100 text-slate-700"}`}
          >
            <Clock size={14} />
            Pendientes ({estadisticas.pendientes})
          </button>
          <button
            onClick={() => setFiltroEstado("procesando")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${filtroEstado === "procesando" ? "bg-blue-100 text-blue-800 border border-blue-300" : "bg-slate-100 text-slate-700"}`}
          >
            <Package size={14} />
            Procesando ({estadisticas.procesando})
          </button>
          <button
            onClick={() => setFiltroEstado("enviado")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${filtroEstado === "enviado" ? "bg-purple-100 text-purple-800 border border-purple-300" : "bg-slate-100 text-slate-700"}`}
          >
            <Truck size={14} />
            Enviados ({estadisticas.enviados})
          </button>
          <button
            onClick={() => setFiltroEstado("entregado")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${filtroEstado === "entregado" ? "bg-green-100 text-green-800 border border-green-300" : "bg-slate-100 text-slate-700"}`}
          >
            <CheckCircle size={14} />
            Entregados ({estadisticas.entregados})
          </button>
        </div>
        
        <button
          onClick={obtenerPedidos}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </div>

      {pedidos.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
          <Package className="mx-auto text-slate-300" size={48} />
          <p className="text-slate-500 mt-4">No hay pedidos registrados</p>
          <p className="text-slate-400 text-sm mt-1">Los pedidos de los clientes aparecerán aquí</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-slate-200">
          <table className="w-full text-sm text-left text-slate-700">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
              <tr>
                {["ID", "Cliente", "Total", "Pago", "Productos", "Estado", "Fecha", "Acciones"].map(
                  (encabezado, i) => (
                    <th key={i} className="px-6 py-3 font-medium">
                      {encabezado}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {pedidosFiltrados.map((pedido, index) => (
                <tr
                  key={pedido.id}
                  className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => abrirModal(pedido)}
                >
                  <td className="pl-6 py-4 font-mono text-sm">
                    #{pedido.id.toString().padStart(6, '0')}
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium">{pedido.cliente_nombre}</p>
                      <p className="text-slate-500 text-xs">{pedido.cliente_email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-800">
                    {currency} {parseFloat(pedido.total).toFixed(2)}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${pedido.metodo_pago === 'COD' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {pedido.metodo_pago === 'COD' ? 'Contra entrega' : 'Tarjeta/Online'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">
                      {pedido.productos?.length || 0} productos
                    </span>
                  </td>
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {getEstadoIcon(pedido.estado)}
                      <select
                        value={pedido.estado}
                        onChange={(e) => actualizarEstadoPedido(pedido.id, e.target.value)}
                        className={`border-none rounded-md text-sm font-medium focus:ring-0 ${getEstadoColor(pedido.estado)}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="procesando">Procesando</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-500 text-xs">
                    {formatDate(pedido.fecha_pedido)}
                  </td>
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => abrirModal(pedido)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de detalles */}
      {modalAbierto && pedidoSeleccionado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Pedido #{pedidoSeleccionado.id.toString().padStart(6, '0')}
                  </h2>
                  <p className="text-slate-500 text-sm">
                    {formatDate(pedidoSeleccionado.fecha_pedido)}
                  </p>
                </div>
                <button
                  onClick={cerrarModal}
                  className="text-slate-500 hover:text-slate-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información del cliente */}
                <div className="bg-slate-50 rounded-lg p-5">
                  <h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <User className="text-slate-600" size={20} />
                    Información del Cliente
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded">
                        <User className="text-slate-400" size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Nombre</p>
                        <p className="font-medium">{pedidoSeleccionado.cliente_nombre}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded">
                        <Mail className="text-slate-400" size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="font-medium">{pedidoSeleccionado.cliente_email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded">
                        <Phone className="text-slate-400" size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Teléfono</p>
                        <p className="font-medium">{pedidoSeleccionado.cliente_telefono}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dirección de entrega */}
                <div className="bg-slate-50 rounded-lg p-5">
                  <h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <MapPin className="text-slate-600" size={20} />
                    Dirección de Entrega
                  </h3>


<div className="space-y-2">
  <p className="text-sm text-slate-500">Dirección completa</p>

  <p className="text-slate-800 leading-relaxed bg-white p-3 rounded-lg border">
    {pedidoSeleccionado.direccion_entrega}
  </p>
</div>



                </div>
              </div>

              {/* Productos */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg text-slate-800 mb-4">
                  Productos ({pedidoSeleccionado.productos?.length || 0})
                </h3>
                <div className="space-y-3">
                  {pedidoSeleccionado.productos?.map((producto, index) => (
                    <div key={index} className="flex items-center justify-between border border-slate-200 rounded-lg p-4 hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <img
                          src={producto.imagen || '/default-image.png'}
                          alt={producto.nombre}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => e.target.src = '/default-image.png'}
                        />
                        <div>
                          <p className="font-medium">{producto.nombre}</p>
                          <p className="text-sm text-slate-500">
                            {currency}{producto.precio_unitario?.toFixed(2)} × {producto.cantidad}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {currency} {producto.total?.toFixed(2)}
                        </p>
                        <p className="text-sm text-slate-500">
                          ID: {producto.id}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen del pedido */}
              <div className="mt-6 bg-slate-50 rounded-lg p-5">
                <h3 className="font-semibold text-lg text-slate-800 mb-4">Resumen del Pedido</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-medium">{currency} {parseFloat(pedidoSeleccionado.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Envío:</span>
                    <span className="font-medium">{currency} {parseFloat(pedidoSeleccionado.envio).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-lg font-semibold text-slate-800">Total:</span>
                    <span className="text-lg font-bold text-green-600">
                      {currency} {parseFloat(pedidoSeleccionado.total).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Método de pago:</span>
                    <span className="font-medium">
                      {pedidoSeleccionado.metodo_pago === 'COD' ? 'Contra entrega' : 'Tarjeta/Online'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Estado actual:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(pedidoSeleccionado.estado)}`}>
                      {pedidoSeleccionado.estado}
                    </span>
                  </div>
                  {pedidoSeleccionado.notas && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-slate-600 mb-1">Notas:</p>
                      <p className="text-slate-700 bg-white p-3 rounded border">{pedidoSeleccionado.notas}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={cerrarModal}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    // Aquí podrías agregar funcionalidad para imprimir o exportar
                    window.print();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente User icon (si no lo tienes importado)
function User(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}



