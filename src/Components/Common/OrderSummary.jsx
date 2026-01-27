import { useState } from "react";
import AddressModal from "./AddressModal";
import { Pencil, MapPin, CheckCircle, Package, Clock, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../services/supabase";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../features/cart/cartSlice";

const OrderSummary = () => {
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [address, setAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const products = useSelector((state) => state.product.list);
    const currency = "Q";
    
    // Calcular totales
    const calculateTotals = () => {
        let subtotal = 0;
        const productosDetallados = [];
        
        Object.entries(cartItems).forEach(([productId, quantity]) => {
            const product = products.find(p => p.id === productId || p.id === Number(productId));
            if (product) {
const precioOriginal = Number(product.precio_original) || 0;
const precioOferta = Number(product.precio_oferta) || 0;

// 🔥 precio final (oferta si existe)
const precioFinal =
  precioOferta > 0 && precioOferta < precioOriginal
    ? precioOferta
    : precioOriginal;

const totalProducto = precioFinal * quantity;
subtotal += totalProducto;

productosDetallados.push({
  id: product.id,
  nombre: product.name,
  precio_unitario: precioFinal,
  precio_original: precioOriginal,
  precio_oferta: precioOferta,
  cantidad: quantity,
  total: totalProducto,
  imagen: product.images?.[0] || "/default-image.png"
});

            }
        });
        
        const envio = 0; // Envío gratis
        const total = subtotal + envio;
        
        return { subtotal, envio, total, productosDetallados };
    };
    
    const { subtotal, envio, total, productosDetallados } = calculateTotals();
    
    // Función para crear el pedido en Supabase
    const crearPedidoEnSupabase = async (pedidoData) => {
        try {
            console.log("Enviando pedido a Supabase:", pedidoData);
            
            const { data, error } = await supabase
                .from('pedidos')
                .insert([pedidoData])
                .select();
            
            if (error) throw error;
            
            console.log("Pedido creado:", data);
            return data[0];
        } catch (error) {
            console.error("Error al crear pedido:", error);
            throw error;
        }
    };
    
    const handlePlaceOrder = async () => {
        // Validaciones
        if (!address) {
            toast.error("Por favor agrega una dirección antes de realizar el pedido.");
            return;
        }
        
        if (productosDetallados.length === 0) {
            toast.error("El carrito está vacío.");
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Preparar datos del pedido
            const pedidoData = {
                cliente_nombre: address.name,
                cliente_email: address.email,
                cliente_telefono: address.phone,
                direccion_entrega: address.address,
                total,
                subtotal,
                envio,
                metodo_pago: "Contra entrega",
                estado: "pendiente",
                productos: productosDetallados,
                fecha_pedido: new Date().toISOString(),
            };
            
            // Crear pedido en Supabase
            const pedidoCreado = await crearPedidoEnSupabase(pedidoData);
            
            // Guardar detalles del pedido para mostrar
            setOrderDetails({
                id: pedidoCreado.id,
                numero: pedidoCreado.id.slice(0, 8).toUpperCase(),
                fecha: new Date().toLocaleDateString('es-GT'),
                hora: new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }),
                total: total
            });
            
            // Mostrar mensaje de éxito
            toast.success("¡Pedido confirmado! Hemos recibido tu pedido.");
            
            // Limpiar carrito después del pedido exitoso
            if (dispatch && clearCart) {
                dispatch(clearCart());
            }
            
            // Marcar como confirmado para mostrar resumen
            setOrderConfirmed(true);
            
        } catch (error) {
            console.error("Error completo:", error);
            toast.error(`Error al realizar el pedido: ${error.message || 'Error desconocido'}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Componente de confirmación exitosa
    if (orderConfirmed && orderDetails) {
        return (
            <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">
                        ¡Pedido Confirmado!
                    </h1>
                    <p className="text-slate-600 mb-6">
                        Hemos recibido tu pedido.
                    </p>
                </div>
                
                <div className="border border-green-200 bg-green-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Package size={20} />
                        Resumen de tu pedido
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Número de pedido:</span>
                            <span className="font-mono font-bold text-slate-800">{orderDetails.numero}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Fecha y hora:</span>
                            <span>{orderDetails.fecha} - {orderDetails.hora}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Método de pago:</span>
                            <span className="font-semibold">Contra entrega</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-4">
                            <span>Total:</span>
                            <span className="text-green-600">{currency} {orderDetails.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <Clock size={20} />
                        ¿Qué sigue?
                    </h3>
                    <ul className="space-y-3 text-slate-600">
                        <li className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                            <span>Recibirás un correo de confirmación en <strong>{address.email}</strong></span>
                        </li>
                        <li className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                            <span>Nos contactaremos contigo al teléfono <strong>{address.phone}</strong> para coordinar la entrega</span>
                        </li>
                    </ul>
                </div>
                
                <button
                    onClick={() => {
                        setOrderConfirmed(false);
                        setOrderDetails(null);
                    }}
                    className="w-full bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-900 transition"
                >
                    Continuar comprando
                </button>
            </div>
        );
    }
    
    return (
        <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-6">
            {/* Título */}
            <h2 className="text-xl font-bold text-slate-800">Resumen del Pedido</h2>
            
            {/* Resumen de productos */}
            <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-700 mb-3">
                    Productos ({productosDetallados.length})
                </h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                    {productosDetallados.length === 0 ? (
                        <p className="text-slate-500 text-center py-4">
                            No hay productos en el carrito
                        </p>
                    ) : (
                        productosDetallados.map((producto, index) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={producto.imagen} 
                                        alt={producto.nombre}
                                        className="w-12 h-12 object-cover rounded"
                                        onError={(e) => e.target.src = '/default-image.png'}
                                    />
                                    <div>
                                        <p className="font-medium text-sm">{producto.nombre}</p>
                                        <p className="text-slate-500 text-xs">
                                            {currency}{producto.precio_unitario.toFixed(2)} × {producto.cantidad}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-semibold">
                                    {currency}{producto.total.toFixed(2)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Método de pago único */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-3">
                <h3 className="text-lg font-semibold text-slate-700">Método de Pago</h3>
                <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium text-blue-800">Contra entrega</p>
                    <p className="text-sm text-slate-600 mt-1">
                        Pedimos el 50% al realizar el pedido y el 50% restante al entregar el producto.
                    </p>
                </div>
            </div>

            {/* Dirección */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <MapPin size={20} />
                        Dirección de entrega
                    </h3>
                </div>

                {!address && (
                    <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-4 text-center space-y-3">
                        <p className="text-slate-600 text-sm">
                            No has agregado una dirección de entrega
                        </p>
                        <button
                            onClick={() => setShowAddressModal(true)}
                            className="w-full flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition"
                        >
                            <MapPin size={18} />
                            Agregar dirección
                        </button>
                    </div>
                )}

                {address && (
                    <>
                        <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded">
                            <p className="font-semibold">{address.name}</p>
                            <p className="leading-relaxed">{address.address}</p>
                            <p className="text-xs mt-2">
                                📞 {address.phone} {address.email && `| 📧 ${address.email}`}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddressModal(true)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            <Pencil size={16} />
                            Editar dirección
                        </button>
                    </>
                )}
            </div>

            {/* Totales */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="space-y-2">
                    <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>{currency} {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>Envío</span>
                        <span className="text-green-600">Gratis</span>
                    </div>
                </div>
                
                <div className="border-t pt-3">
                    <div className="flex justify-between text-slate-800 font-bold text-lg">
                        <span>Total</span>
                        <span>{currency} {total.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading || !address || productosDetallados.length === 0}
                    className="w-full mt-4 bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-900 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando pedido...
                        </span>
                    ) : (
                        "Confirmar Pedido"
                    )}
                </button>
                
                <p className="text-xs text-slate-500 text-center mt-3">
                    Al confirmar, aceptas nuestros <a href="/terms" className="text-blue-600 hover:underline">Términos y Condiciones</a>
                </p>
            </div>

            {/* Modal de dirección */}
            {showAddressModal && (
                <AddressModal 
                    setShowAddressModal={setShowAddressModal}
                    onSaveAddress={setAddress}
                    existingAddress={address}
                />
            )}
        </div>
    );
};

export default OrderSummary;