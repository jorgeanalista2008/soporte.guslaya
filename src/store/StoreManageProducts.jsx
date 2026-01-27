import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Loading from "../Components/Common/Loading";
import { supabase } from "../services/supabase"; // Ajusta la ruta según tu estructura

const AdministrarProductosTienda = () => {
  const moneda = "Q"; // Cambié a Quetzales

  const [cargando, setCargando] = useState(true);
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formularioEdicion, setFormularioEdicion] = useState({
    nombre: "",
    descripcion: "",
    precio_original: 0,
    precio_oferta: 0,
    imagen_url: "",
  });

  // Obtener productos desde Supabase
  const obtenerProductos = async () => {
    setCargando(true);
    try {
      console.log("Consultando productos en Supabase...");
      
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("fecha", { ascending: false });

      if (error) {
        console.error("Error al obtener productos:", error);
        throw new Error(error.message);
      }

      console.log("Productos obtenidos:", data?.length || 0);
      
      // Mapear los datos de Supabase al formato necesario
      const productosFormateados = (data || []).map((item) => ({
        id: item.id,
        name: item.nombre,
        description: item.descripcion,
        mrp: parseFloat(item.precio_original) || 0,
        price: parseFloat(item.precio_oferta || item.precio_original) || 0,
        images: item.imagen_url ? [item.imagen_url] : [],
        enStock: item.disponible !== false, // Asume campo 'disponible' en tu tabla
        // Guardar datos originales para edición
        datosOriginales: {
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio_original: item.precio_original,
          precio_oferta: item.precio_oferta,
          imagen_url: item.imagen_url,
        },
      }));

      setProductos(productosFormateados);
    } catch (error) {
      console.error("Error en obtenerProductos:", error);
      toast.error("Error al cargar los productos: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  // Alternar disponibilidad del producto
  const alternarStock = async (productoId) => {
    try {
      const producto = productos.find((p) => p.id === productoId);
      const nuevoEstado = !producto.enStock;

      // Actualizar en Supabase
      const { error } = await supabase
        .from("productos")
        .update({ disponible: nuevoEstado })
        .eq("id", productoId);

      if (error) throw error;

      // Actualizar estado local
      setProductos((productosAnteriores) =>
        productosAnteriores.map((producto) =>
          producto.id === productoId
            ? { ...producto, enStock: nuevoEstado }
            : producto
        )
      );

      toast.success("¡Disponibilidad del producto actualizada!");
    } catch (error) {
      console.error("Error al alternar stock:", error);
      toast.error("Error al actualizar disponibilidad");
    }
  };

  // Iniciar edición de un producto
  const iniciarEdicion = (producto) => {
    setEditandoId(producto.id);
    setFormularioEdicion({
      nombre: producto.datosOriginales.nombre || producto.name || "",
      descripcion: producto.datosOriginales.descripcion || producto.description || "",
      precio_original: producto.datosOriginales.precio_original || producto.mrp || 0,
      precio_oferta: producto.datosOriginales.precio_oferta || producto.price || 0,
      imagen_url: producto.datosOriginales.imagen_url || (producto.images && producto.images[0]) || "",
    });
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormularioEdicion({
      nombre: "",
      descripcion: "",
      precio_original: 0,
      precio_oferta: 0,
      imagen_url: "",
    });
  };

  // Guardar cambios de edición
  const guardarEdicion = async () => {
    if (!editandoId) return;

    try {
      // Validar campos requeridos
      if (!formularioEdicion.nombre.trim()) {
        toast.error("El nombre es requerido");
        return;
      }

      if (formularioEdicion.precio_oferta <= 0) {
        toast.error("El precio debe ser mayor a 0");
        return;
      }

      // Actualizar en Supabase
      const { error } = await supabase
        .from("productos")
        .update({
          nombre: formularioEdicion.nombre,
          descripcion: formularioEdicion.descripcion,
          precio_original: formularioEdicion.precio_original,
          precio_oferta: formularioEdicion.precio_oferta,
          imagen_url: formularioEdicion.imagen_url,
          fecha: new Date().toISOString(), // Actualizar fecha de modificación
        })
        .eq("id", editandoId);

      if (error) throw error;

      // Actualizar estado local
      setProductos((productosAnteriores) =>
        productosAnteriores.map((producto) =>
          producto.id === editandoId
            ? {
                ...producto,
                name: formularioEdicion.nombre,
                description: formularioEdicion.descripcion,
                mrp: parseFloat(formularioEdicion.precio_original),
                price: parseFloat(formularioEdicion.precio_oferta),
                images: formularioEdicion.imagen_url ? [formularioEdicion.imagen_url] : [],
                datosOriginales: {
                  ...producto.datosOriginales,
                  nombre: formularioEdicion.nombre,
                  descripcion: formularioEdicion.descripcion,
                  precio_original: formularioEdicion.precio_original,
                  precio_oferta: formularioEdicion.precio_oferta,
                  imagen_url: formularioEdicion.imagen_url,
                },
              }
            : producto
        )
      );

      toast.success("¡Producto actualizado exitosamente!");
      cancelarEdicion(); // Salir del modo edición
    } catch (error) {
      console.error("Error al guardar edición:", error);
      toast.error("Error al actualizar producto: " + error.message);
    }
  };

  // Eliminar producto
  const eliminarProducto = async (productoId) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      // Eliminar de Supabase
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id", productoId);

      if (error) throw error;

      // Eliminar del estado local
      setProductos((productosAnteriores) =>
        productosAnteriores.filter((producto) => producto.id !== productoId)
      );

      toast.success("¡Producto eliminado exitosamente!");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      toast.error("Error al eliminar producto: " + error.message);
    }
  };

  // Manejar cambios en el formulario de edición
  const manejarCambioFormulario = (e) => {
    const { name, value } = e.target;
    setFormularioEdicion((prev) => ({
      ...prev,
      [name]: name.includes("precio") ? parseFloat(value) || 0 : value,
    }));
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  if (cargando) return <Loading />;

  return (
    <div className="p-5">
      <h1 className="text-2xl text-slate-500 mb-5">
        Administrar <span className="text-slate-800 font-medium">Productos</span>
      </h1>

      <div className="mb-4">
        <p className="text-slate-600">
          Total de productos: <span className="font-semibold">{productos.length}</span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left ring ring-slate-200 rounded overflow-hidden text-sm">
          <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3 hidden md:table-cell">Descripción</th>
              <th className="px-4 py-3 hidden md:table-cell">Precio Original</th>
              <th className="px-4 py-3">Precio Oferta</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-slate-700">
            {productos.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                  No hay productos registrados
                </td>
              </tr>
            ) : (
              productos.map((producto) => (
                <tr
                  key={producto.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  {editandoId === producto.id ? (
                    // MODO EDICIÓN
                    <>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          name="nombre"
                          value={formularioEdicion.nombre}
                          onChange={manejarCambioFormulario}
                          className="border rounded px-2 py-1 w-full text-sm"
                          placeholder="Nombre del producto"
                        />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <textarea
                          name="descripcion"
                          value={formularioEdicion.descripcion}
                          onChange={manejarCambioFormulario}
                          className="border rounded px-2 py-1 w-full text-sm"
                          placeholder="Descripción"
                          rows="2"
                        />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <input
                          type="number"
                          name="precio_original"
                          value={formularioEdicion.precio_original}
                          onChange={manejarCambioFormulario}
                          className="border rounded px-2 py-1 w-full text-sm"
                          step="0.01"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          name="precio_oferta"
                          value={formularioEdicion.precio_oferta}
                          onChange={manejarCambioFormulario}
                          className="border rounded px-2 py-1 w-full text-sm"
                          step="0.01"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            onChange={() => alternarStock(producto.id)}
                            checked={producto.enStock}
                          />
                          <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                          <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                        </label>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={guardarEdicion}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={cancelarEdicion}
                            className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-400 transition"
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // MODO VISUALIZACIÓN
                    <>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 items-center">
                          <img
                            src={producto.images[0] || "/default-image.png"}
                            alt={producto.name}
                            className="w-10 h-10 object-cover p-1 shadow rounded cursor-pointer"
                            onError={(e) => {
                              e.target.src = "/default-image.png";
                            }}
                          />
                          <div>
                            <p className="font-medium">{producto.name}</p>
                            <p className="text-xs text-slate-500">ID: {producto.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell">
                        <div className="truncate max-w-xs" title={producto.description}>
                          {producto.description || "Sin descripción"}
                        </div>
                      </td>

                      <td className="px-4 py-3 hidden md:table-cell">
                        {moneda} {producto.mrp.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-semibold">
                          {moneda} {producto.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            onChange={() =>
                              toast.promise(alternarStock(producto.id), {
                                loading: "Actualizando disponibilidad...",
                                success: "¡Stock actualizado!",
                                error: "Error al actualizar el stock",
                              })
                            }
                            checked={producto.enStock}
                          />
                          <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                          <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                          <span className="text-xs ml-2">
                            {producto.enStock ? "Disponible" : "Agotado"}
                          </span>
                        </label>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => iniciarEdicion(producto)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarProducto(producto.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Botón para refrescar productos */}
      <div className="mt-6">
        <button
          onClick={obtenerProductos}
          className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-900 transition"
        >
          Refrescar lista de productos
        </button>
      </div>
    </div>
  );
};

export default AdministrarProductosTienda;