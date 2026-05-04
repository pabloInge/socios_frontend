import Link from "next/link";
import { Plus } from "lucide-react";
import { fabVariants } from "@/components/ui/fab";
import { cn } from "@/lib/utils";

export default function SociosPage() {
  return (
    <div className="relative h-full">
      <h1 className="text-2xl font-bold mb-4">Listado de Socios</h1>

      <Link
        href="/dashboard/socios/nuevo"
        className={cn(
          fabVariants({ variant: "primary", size: "large" }),
          "fixed bottom-8 right-8"
        )}
        aria-label="Nuevo socio"
      >
        <Plus />
      </Link>
    </div>
  );
}
