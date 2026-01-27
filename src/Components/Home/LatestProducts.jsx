import { useEffect } from "react";
import Title from "../Common/Title";
import ProductCard from "../Common/ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../redux/productActions";

const LatestProducts = () => {
  const displayQuantity = 4;
  const dispatch = useDispatch();
  
  // Obtener estado de Redux
  const products = useSelector((state) => state.product.list);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);

  // Cargar productos al montar el componente
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Logs para depuración
  useEffect(() => {
    console.log("Productos en estado:", products);
    console.log("Cargando:", loading);
    console.log("Error:", error);
  }, [products, loading, error]);

  // Mostrar estados de carga y error
  if (loading) {
    return (
      <div className="px-6 my-30 max-w-6xl mx-auto">
        <Title title="Accesorios Para Telefono" description="Cargando productos..." />
        <div className="mt-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          <p className="mt-2 text-slate-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 my-30 max-w-6xl mx-auto">
        <Title title="Accesorios para Telefono" description="Error al cargar productos" />
        <div className="mt-12 text-center text-red-500">
          <p>Error: {error}</p>
          <button
            onClick={() => dispatch(fetchProducts())}
            className="mt-4 bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-900"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="px-6 my-30 max-w-6xl mx-auto">
        <Title title="Accesorios para telefono" description="No hay productos disponibles" />
        <div className="mt-12 text-center">
          <p className="text-slate-600">No se encontraron productos</p>
        </div>
      </div>
    );
  }

  // Ordenar por fecha (más reciente primero)
  const sortedProducts = [...products].sort((a, b) => {
    try {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    } catch (error) {
      console.error("Error al ordenar productos:", error);
      return 0;
    }
  });

  // Tomar solo los más recientes
  const latestProducts = sortedProducts.slice(0, displayQuantity);

  return (
    <div className="px-6 my-30 max-w-6xl mx-auto">
      <Title
        title="Accesorios Para Telefonos"
        description={`Se muestran ${latestProducts.length} de ${products.length} disponibles`}
        href="/shop"
      />

      <div className="mt-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {latestProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default LatestProducts;