import { redirect } from "next/navigation"

export default function ClientPage() {
  // Redirigir automáticamente al dashboard del cliente
  redirect("/client/dashboard")
}
