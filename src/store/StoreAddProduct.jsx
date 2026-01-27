import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "../services/supabase";
import {
  Trash2,
  Pencil,
  Check,
  X,
  ImagePlus
} from "lucide-react";

const StoreAddProduct = () => {
  const [categorias, setCategorias] = useState([]);
  const [imagen, setImagen] = useState(null);

  const [infoProducto, setInfoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio_original: "",
    precio_oferta: "",
    precio_mayorista: "", // NUEVO CAMPO
    categoria: "",
  });

  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [cargando, setCargando] = useState(false);

  /* =========================
     CARGAR CATEGORÍAS
  ========================== */
  const cargarCategorias = async () => {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("nombre");

    if (!error) setCategorias(data);
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const manejarCambio = (e) => {
    setInfoProducto({ ...infoProducto, [e.target.name]: e.target.value });
  };

  /* =========================
     SUBIR IMAGEN
  ========================== */
  const subirImagen = async () => {
    if (!imagen) return null;

    const fileName = `${Date.now()}-${imagen.name}`;

    const { error } = await supabase.storage
      .from("productos")
      .upload(fileName, imagen);

    if (error) {
      toast.error("Error al subir imagen");
      return null;
    }

    const { data } = supabase.storage
      .from("productos")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  /* =========================
     AGREGAR CATEGORÍA
  ========================== */
  const agregarCategoria = async (e) => {
    e.preventDefault();

    if (!nuevaCategoria.trim()) {
      toast.error("Escribe una categoría");
      return;
    }

    const { error } = await supabase
      .from("categorias")
      .insert([{ nombre: nuevaCategoria }]);

    if (!error) {
      toast.success("Categoría agregada");
      setNuevaCategoria("");
      cargarCategorias();
    }
  };

  /* =========================
     ELIMINAR CATEGORÍA
  ========================== */
  const eliminarCategoria = async (id) => {
    if (!confirm("¿Eliminar esta categoría?")) return;

    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("id", id);

    if (!error) {
      toast.success("Categoría eliminada");
      cargarCategorias();
    }
  };

  /* =========================
     EDITAR CATEGORÍA
  ========================== */
  const guardarEdicion = async (id) => {
    const { error } = await supabase
      .from("categorias")
      .update({ nombre: nombreEditado })
      .eq("id", id);

    if (!error) {
      toast.success("Categoría actualizada");
      setCategoriaEditando(null);
      setNombreEditado("");
      cargarCategorias();
    }
  };

  /* =========================
     ENVIAR PRODUCTO
  ========================== */
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);

    const urlImagen = await subirImagen();

    const { error } = await supabase.from("productos").insert([
      {
        nombre: infoProducto.nombre,
        descripcion: infoProducto.descripcion,
        precio_original: Number(infoProducto.precio_original),
        precio_oferta: Number(infoProducto.precio_oferta),
        precio_mayorista: Number(infoProducto.precio_mayorista), // GUARDAR PRECIO MAYORISTA
        categoria: infoProducto.categoria,
        imagen_url: urlImagen,
      },
    ]);

    if (!error) {
      toast.success("Producto agregado");
      setInfoProducto({
        nombre: "",
        descripcion: "",
        precio_original: "",
        precio_oferta: "",
        precio_mayorista: "",
        categoria: "",
      });
      setImagen(null);
    }

    setCargando(false);
  };

  return (
    <div className="px-4 pb-20 text-slate-700 max-w-5xl mx-auto">

      {/* =========================
         CATEGORÍAS
      ========================== */}
      <div className="bg-white rounded-xl p-5 shadow mb-10">
        <h2 className="text-xl font-bold mb-4">Categorías</h2>

        <form onSubmit={agregarCategoria} className="flex gap-3 mb-5">
          <input
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            placeholder="Nueva categoría"
            className="flex-1 p-2 border rounded-lg"
          />
          <button className="bg-blue-600 text-white px-4 rounded-lg">
            Agregar
          </button>
        </form>

        <ul className="space-y-3">
          {categorias.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between border p-3 rounded-lg"
            >
              {categoriaEditando === cat.id ? (
                <input
                  value={nombreEditado}
                  onChange={(e) => setNombreEditado(e.target.value)}
                  className="border p-1 rounded w-full mr-3"
                />
              ) : (
                <span className="font-medium">{cat.nombre}</span>
              )}

              <div className="flex gap-2">
                {categoriaEditando === cat.id ? (
                  <>
                    <button onClick={() => guardarEdicion(cat.id)}>
                      <Check className="text-green-600" size={18} />
                    </button>
                    <button onClick={() => setCategoriaEditando(null)}>
                      <X className="text-gray-500" size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setCategoriaEditando(cat.id);
                        setNombreEditado(cat.nombre);
                      }}
                    >
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => eliminarCategoria(cat.id)}>
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* =========================
         PRODUCTO
      ========================== */}
      <div className="bg-white rounded-xl p-5 shadow">
        <h1 className="text-2xl font-bold mb-5">Agregar Producto</h1>

        <form onSubmit={(e) => toast.promise(manejarEnvio(e), { loading: "Agregando..." })}>
          
          {/* IMAGEN */}
          <p className="mb-2">Imagen</p>

          <label className="relative w-32 h-32 border rounded-xl flex items-center justify-center cursor-pointer overflow-hidden">
            {imagen ? (
              <img
                src={URL.createObjectURL(imagen)}
                className="object-cover w-full h-full"
              />
            ) : (
              <ImagePlus size={40} className="text-slate-400" />
            )}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImagen(e.target.files[0])}
            />
          </label>

          {/* FORM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <input name="nombre" value={infoProducto.nombre} onChange={manejarCambio} placeholder="Nombre" className="p-2 border rounded" required />
            <select value={infoProducto.categoria} onChange={(e) => setInfoProducto({ ...infoProducto, categoria: e.target.value })} className="p-2 border rounded" required>
              <option value="">Categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.nombre}>{c.nombre}</option>
              ))}
            </select>
            <input type="number" name="precio_original" value={infoProducto.precio_original} onChange={manejarCambio} placeholder="Precio original" className="p-2 border rounded" required />
            <input type="number" name="precio_oferta" value={infoProducto.precio_oferta} onChange={manejarCambio} placeholder="Precio oferta" className="p-2 border rounded" required />
            <input type="number" name="precio_mayorista" value={infoProducto.precio_mayorista} onChange={manejarCambio} placeholder="Precio mayorista" className="p-2 border rounded" required /> {/* NUEVO INPUT */}
          </div>

          <textarea name="descripcion" value={infoProducto.descripcion} onChange={manejarCambio} rows="4" placeholder="Descripción" className="p-2 border rounded w-full mt-4" />

          <button disabled={cargando} className="mt-5 bg-slate-800 text-white px-6 py-2 rounded hover:bg-black">
            {cargando ? "Agregando..." : "Agregar producto"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoreAddProduct;
