import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  StarIcon,
  TagIcon,
  EarthIcon,
  CreditCardIcon,
  UserIcon,
} from "lucide-react";

import { addToCart } from "../features/cart/cartSlice";
import Counter from "../Components/Common/Counter";
import { useNotify } from "../hook/useNotify";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = useNotify();

  const products = useSelector((state) => state.product.list);
  const cart = useSelector((state) => state.cart.cartItems);

  const product = products.find(
    (p) => p.id === Number(id) || p.id === id
  );

  if (!product) {
    return (
      <p className="text-center mt-10 text-slate-600">
        Producto no encontrado
      </p>
    );
  }

  const productId = product.id;
  const currency = "Q";

  const [mainImage, setMainImage] = useState(
    product.images?.[0] || "/default-image.png"
  );

  /* ⭐ Rating seguro */
  const averageRating = product.rating?.length
    ? product.rating.reduce((acc, item) => acc + item.rating, 0) /
      product.rating.length
    : 0;

  /* 💰 Precios seguros */
  const precioOriginal = Number(product.precio_original) || 0;
  const precioOferta = Number(product.precio_oferta) || 0;

  const hasOffer =
    precioOferta > 0 && precioOferta < precioOriginal;

  const precioActual = hasOffer ? precioOferta : precioOriginal;

  /* 🛒 Agregar al carrito */
  const addToCartHandler = () => {
    if (cart[productId]) {
      notify.warning("Este producto ya está en el carrito");
      return;
    }

    dispatch(addToCart({ productId }));
    notify.success("Producto agregado al carrito");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-10">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

        {/* ===== GALERÍA ===== */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-1/2">
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible">
            {product.images?.map((image, index) => (
              <div
                key={index}
                onClick={() => setMainImage(image)}
                className="bg-slate-100 flex items-center justify-center size-16 sm:size-20 rounded-lg cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Miniatura ${index + 1}`}
                  className="max-h-12 sm:max-h-14 object-contain"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center bg-slate-100 rounded-lg w-full h-64 sm:h-80 lg:h-96">
            <img
              src={mainImage}
              alt={product.name}
              className="max-h-full max-w-full object-contain p-4"
            />
          </div>
        </div>

        {/* ===== INFO ===== */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-2">
            {product.name}
          </h1>

          {product.description && (
            <p className="text-sm sm:text-base text-slate-600 mb-4">
              {product.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex">
              {Array(5)
                .fill("")
                .map((_, index) => (
                  <StarIcon
                    key={index}
                    size={16}
                    className="text-transparent"
                    fill={
                      averageRating >= index + 1
                        ? "#00C950"
                        : "#D1D5DB"
                    }
                  />
                ))}
            </div>
            <span className="text-sm ml-2 text-slate-500">
              {product.rating?.length || 0} reseñas
            </span>
          </div>

          {/* 💰 Precios */}
          <div className="flex items-end gap-3 mb-4">
            <p className="text-2xl sm:text-3xl font-semibold text-black">
              {currency}
              {precioActual.toFixed(2)}
            </p>

            {hasOffer && (
              <p className="text-xl text-slate-400 line-through">
                {currency}
                {precioOriginal.toFixed(2)}
              </p>
            )}
          </div>

          {/* 🔖 Ahorro */}
          {hasOffer && (
            <div className="flex items-center gap-2 text-slate-500 mb-6">
              <TagIcon size={16} />
              <p className="text-sm sm:text-base">
                Ahorra{" "}
                {(
                  ((precioOriginal - precioOferta) /
                    precioOriginal) *
                  100
                ).toFixed(0)}
                %
              </p>
            </div>
          )}

          {/* 🛒 Acciones */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            {cart[productId] && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">
                  Cantidad
                </span>
                <Counter productId={productId} />
              </div>
            )}

            <button
              onClick={() =>
                !cart[productId]
                  ? addToCartHandler()
                  : navigate("/cart")
              }
              className="bg-slate-800 text-white px-6 py-3 text-sm font-medium rounded-lg hover:bg-slate-900 active:scale-95 transition w-full sm:w-auto"
            >
              {!cart[productId]
                ? "Agregar al carrito"
                : "Ver carrito"}
            </button>
          </div>

          <hr className="border-gray-300 my-6" />

          {/* Info extra */}
          <div className="flex flex-col gap-3 text-slate-500">
            <div className="flex items-center gap-3">
              <EarthIcon size={18} />
              <span>Envío gratis solo en San Juan Chamelco</span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCardIcon size={18} />
              <span>Pago 100% seguro</span>
            </div>
            <div className="flex items-center gap-3">
              <UserIcon size={18} />
              <span>Vendedor confiable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
