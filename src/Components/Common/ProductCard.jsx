// src/Components/Common/ProductCard.jsx
import React from "react";
import { StarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import Counter from "./Counter";
import { useNotify } from "../../hook/useNotify";

const ProductCard = ({ product }) => {
  const currency = "Q";
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartItems);
  const notify = useNotify();

  const productId = product.id;

  // ⭐ Rating seguro
  const rating = product.rating?.length
    ? Math.round(
        product.rating.reduce((acc, curr) => acc + curr.rating, 0) /
          product.rating.length
      )
    : 0;

  // 💰 Precios blindados
  const precioOriginal = Number(product.precio_original) || 0;
  const precioOferta = Number(product.precio_oferta) || 0;

  const hasOffer =
    precioOferta > 0 && precioOferta < precioOriginal;

  const precioActual = hasOffer ? precioOferta : precioOriginal;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (cart[productId]) {
      notify.warning("Este producto ya está en el carrito");
      return;
    }

    dispatch(addToCart({ productId }));
    notify.success("Producto agregado al carrito");
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group max-xl:mx-auto no-underline"
    >
      {/* Imagen */}
      <div className="bg-[#F5F5F5] h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src={product.images?.[0] || "/default-image.png"}
          alt={product.name}
          className="max-h-30 sm:max-h-40 w-auto group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 text-slate-800 pt-2 max-w-60">
        <div className="flex justify-between items-center">
          <p className="text-sm">{product.name}</p>

          <div className="text-right">
            {hasOffer && (
              <p className="text-xs text-slate-400 line-through">
                {currency}{precioOriginal.toFixed(2)}
              </p>
            )}
            <p className="text-sm font-semibold text-black">
              {currency}{precioActual.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex">
          {Array(5).fill("").map((_, index) => (
            <StarIcon
              key={index}
              size={14}
              className="text-transparent mt-0.5"
              fill={rating >= index + 1 ? "#00C950" : "#D1D5DB"}
            />
          ))}
        </div>

        {/* Acción */}
        <div className="mt-2">
          {!cart[productId] ? (
            <button
              onClick={handleAddToCart}
              className="w-full bg-slate-800 text-white text-sm py-1 rounded hover:bg-slate-900 transition"
            >
              Agregar al carrito
            </button>
          ) : (
            <Counter productId={productId} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
