import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard"); // 🔄 Redirige a "/dashboard"
}
