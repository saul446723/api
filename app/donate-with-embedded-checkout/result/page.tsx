import type { Stripe } from "stripe";
import PrintObject from "@/app/components/PrintObject";
import { stripe } from "@/lib/stripe";
import { JSX } from "react";

// 1. Forzamos renderizado dinámico para evitar el error de "prerender" en Vercel
export const dynamic = "force-dynamic";

export default async function ResultPage(props: {
  searchParams: Promise<{ session_id?: string }>;
}): Promise<JSX.Element> {
  // 2. Extraemos el session_id de la promesa (Estándar Next.js 15/16)
  const { session_id } = await props.searchParams;

  if (!session_id) {
    return (
      <div className="p-4">
        <h2>Error: No se encontró el ID de la sesión.</h2>
        <p>Asegúrate de venir desde un proceso de pago válido.</p>
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
        <h2>Error de Stripe</h2>
        <p>{errorMessage}</p>
      </div>
    );
  }
}