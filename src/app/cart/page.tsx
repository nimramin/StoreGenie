"use client";

import { useCart } from "@/hooks/useCart";
import Link from "next/link";

export default function CartPage() {
  const { cart, isLoading, refetch } = useCart();

  const updateQuantity = async (cart_item_id: number, quantity: number) => {
    await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart_item_id, quantity }),
    });
    refetch();
  };

  const removeItem = async (cart_item_id: number) => {
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart_item_id }),
    });
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-magic-accent/20 to-magic-secondary/30">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Loading your magical cart...</h1>
        </div>
      </div>
    );
  }

  if (!cart || cart.cart_items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-magic-accent/20 to-magic-secondary/30">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added any magic yet.</p>
          <Link href="/" className="inline-block bg-magic-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.cart_items.reduce(
    (acc, item) => acc + item.products.price * item.quantity,
    0
  );
  const total = subtotal; // Assuming no shipping or taxes for now

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-magic-accent/20 to-magic-secondary/30 text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-12 text-center">Your Magical Cart</h1>
        <form className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul role="list" className="divide-y divide-border">
              {cart.cart_items.map((item) => (
                <li key={item.id} className="flex py-6">
                  <div className="flex-shrink-0">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product_images/${item.products.image}`}
                      alt={item.products.title}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold">
                            <a href="#" className="hover:text-magic-primary transition-colors">
                              {item.products.title}
                            </a>
                          </h3>
                        </div>
                        <p className="mt-1 text-lg font-bold text-magic-primary">${item.products.price.toFixed(2)}</p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label htmlFor={`quantity-${item.id}`} className="sr-only">
                          Quantity, {item.products.title}
                        </label>
                        <select
                          id={`quantity-${item.id}`}
                          name={`quantity-${item.id}`}
                          className="max-w-full rounded-md border border-border bg-background/80 py-1.5 text-left text-base font-medium leading-5 shadow-sm focus:border-magic-primary focus:outline-none focus:ring-1 focus:ring-magic-primary sm:text-sm"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        >
                          {[...Array(item.products.stock).keys()].map((i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>

                        <div className="absolute top-0 right-0">
                          <button type="button" className="-m-2 inline-flex p-2 text-muted-foreground hover:text-magic-primary transition-colors" onClick={() => removeItem(item.id)}>
                            <span className="sr-only">Remove</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-card/60 backdrop-blur-sm border border-magic-accent/50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2 id="summary-heading" className="text-xl font-semibold">
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-muted-foreground">Subtotal</dt>
                <dd className="text-sm font-medium">${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <dt className="flex items-center text-sm text-muted-foreground">
                  <span>Shipping estimate</span>
                </dt>
                <dd className="text-sm font-medium">$0.00</dd>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <dt className="text-base font-semibold">Order total</dt>
                <dd className="text-base font-semibold">${total.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full rounded-md border border-transparent bg-magic-primary px-4 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-magic-primary/90 focus:outline-none focus:ring-2 focus:ring-magic-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                Checkout
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}