import React, { useEffect, useState } from "react";
import { Trash2Icon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteItemFromCart } from "../features/cart/cartSlice";
import PageTitle from "../Components/Common/PageTitle";
import Counter from "../Components/Common/Counter";
import OrderSummary from "../Components/Common/OrderSummary";
import { Link } from "react-router-dom";
import { useNotify } from "../hook/useNotify";

export default function Cart() {
  const currency = "Q";
  const notify = useNotify();

  const { cartItems } = useSelector((state) => state.cart);
  const products = useSelector((state) => state.product.list);
  const dispatch = useDispatch();

  const [cartArray, setCartArray] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const createCartArray = () => {
    let total = 0;
    const newCartArray = [];

    for (const [key, quantity] of Object.entries(cartItems)) {
      const product = products.find(
        (item) => item.id === Number(key)
      );

      if (product) {
        const precioOriginal = Number(product.precio_original) || 0;
        const precioOferta = Number(product.precio_oferta) || 0;

        const precioFinal =
          precioOferta > 0 && precioOferta < precioOriginal
            ? precioOferta
            : precioOriginal;

        newCartArray.push({
          ...product,
          quantity,
          precioFinal,
        });

        total += precioFinal * quantity;
      }
    }

    setCartArray(newCartArray);
    setTotalPrice(total);
  };

  const handleDeleteItemFromCart = (productId) => {
    dispatch(deleteItemFromCart({ productId }));
  };

  const handleConfirmOrder = () => {
    notify.success(
      "✅ Hemos recibido tu pedido. Nos pondremos en contacto contigo pronto."
    );
  };

  useEffect(() => {
    if (products.length > 0) {
      createCartArray();
    }
  }, [cartItems, products]);

  return cartArray.length > 0 ? (
    <div className="min-h-screen mx-6 pt-24 text-slate-800">
      <div className="max-w-7xl mx-auto">

        <PageTitle
          heading="Mi Carrito"
          text="Artículos en tu carrito"
          linkText="Agregar más"
        />

        <div className="flex items-start justify-between gap-5 max-lg:flex-col">
          <table className="w-full max-w-4xl text-slate-600 table-auto">
            <thead>
              <tr>
                <th className="text-left">Producto</th>
                <th>Cantidad</th>
                <th>Precio Total</th>
                <th className="max-md:hidden">Eliminar</th>
              </tr>
            </thead>

            <tbody>
              {cartArray.map((item) => (
                <tr key={item.id}>
                  <td className="flex gap-3 my-4">
                    <div className="bg-slate-100 size-18 rounded-md flex items-center justify-center">
                      <img
                        src={item.images?.[0]}
                        className="h-14"
                        alt={item.name}
                      />
                    </div>
                    <div>
                      <p>{item.name}</p>

                      {item.precio_oferta > 0 && (
                        <p className="text-xs text-slate-400 line-through">
                          {currency}
                          {Number(item.precio_original).toFixed(2)}
                        </p>
                      )}

                      <p className="font-medium text-slate-800">
                        {currency}
                        {item.precioFinal.toFixed(2)}
                      </p>
                    </div>
                  </td>

                  <td className="text-center">
                    <Counter productId={item.id} />
                  </td>

                  <td className="text-center font-medium">
                    {currency}
                    {(item.precioFinal * item.quantity).toFixed(2)}
                  </td>

                  <td className="text-center max-md:hidden">
                    <button
                      onClick={() =>
                        handleDeleteItemFromCart(item.id)
                      }
                      className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                    >
                      <Trash2Icon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <OrderSummary
            totalPrice={totalPrice}
            items={cartArray}
            onConfirm={handleConfirmOrder}
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 pt-24">
      <h2 className="text-xl font-semibold">
        Tu carrito está vacío
      </h2>
      <Link
        to="/"
        className="px-6 py-3 bg-slate-800 text-white rounded-lg"
      >
        Ir al inicio
      </Link>
    </div>
  );
}
