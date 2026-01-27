
import Title from "../Common/Title";
import ProductCard from "../Common/ProductCard";
import { useSelector } from "react-redux";

const BestSelling = () => {
  // Cantidad de productos a mostrar
  const displayQuantity = 8;

  // Obtener la lista de productos desde Redux
  const products = useSelector((state) => state.product.list);

  return (
    <div className="px-6 my-30 max-w-6xl mx-auto">
<Title
  title="Productos Más Vendidos"

  
  description={`Se muestran ${
    products.length < displayQuantity
      ? products.length
      : displayQuantity
  } de ${products.length} disponibles`}
  href="/shop"
/>

      <div className="mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12">
        {products
          .slice()
          // Ordenar por número de valoraciones (rating)
          .sort((a, b) => b.rating.length - a.rating.length)
          // Mostrar solo los primeros 8 productos
          .slice(0, displayQuantity)
          // Renderizar cada tarjeta
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default BestSelling;
