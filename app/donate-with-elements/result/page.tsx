import type { Stripe } from "stripe";
import PrintObject from "@/app/components/PrintObject";
import { stripe } from "@/lib/stripe";
import { JSX } from "react";

// 1. Forzamos a que la página sea dinámica para que Vercel no falle en el Build
export const dynamic = "force-dynamic";

export default async function ResultPage(props: {
  searchParams: Promise<{ payment_intent?: string }>;
}): Promise<JSX.Element> {
  // 2. Esperamos a que los parámetros de búsqueda estén listos
  const { payment_intent } = await props.searchParams;

  if (!payment_intent) {
    return (
      <div className="p-4">
        <h2>Error: No se proporcionó un ID de pago (payment_intent).</h2>
        <p>Verifica tu enlace o regresa a la página de inicio.</p>
      </div>
    );
  }

  try {
    // 3. Recuperamos la información desde Stripe
    const paymentIntent: Stripe.PaymentIntent =
      await stripe.paymentIntents.retrieve(payment_intent);

    return (
      <div className="p-4">
        <h2>Status: {paymentIntent.status}</h2>
        <h3>Payment Intent response:</h3>
        <PrintObject content={paymentIntent} />
      </div>
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Error desconocido";
    return (
      <div className="p-4 text-red-500">
        <h2>Error al recuperar los datos del pago</h2>
        <p>{errorMessage}</p>
      </div>
    );
  }
}