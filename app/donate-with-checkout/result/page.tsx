import type { Stripe } from "stripe";
import PrintObject from "@/app/components/PrintObject";
import { stripe } from "@/lib/stripe";
import { JSX } from "react";

// 1. Esto le dice a Vercel que no intente pre-renderizar esta página en el build
export const dynamic = "force-dynamic";

export default async function ResultPage(props: {
  searchParams: Promise<{ session_id?: string }>;
}): Promise<JSX.Element> {
  // 2. En Next.js 15+, searchParams es una Promise, hay que usar await
  const { session_id } = await props.searchParams;

  if (!session_id) {
    return (
      <div className="p-4">
        <h2>Error: No se encontró un ID de sesión válido.</h2>
        <p>Por favor, regresa a la tienda e intenta de nuevo.</p>
      </div>
    );
  }

  try {
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items", "payment_intent"],
      });

    const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent;

    return (
      <div className="p-4">
        <h2>Status: {paymentIntent.status}</h2>
        <h3>Checkout Session response:</h3>
        <PrintObject content={checkoutSession} />
      </div>
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Error desconocido";
    return (
      <div className="p-4 text-red-500">
        <h2>Error al recuperar la sesión</h2>
        <p>{errorMessage}</p>
      </div>
    );
  }
}