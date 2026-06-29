"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, {});
  const error = pending ? undefined : state?.error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <Card variant="elevated" className="w-full max-w-md">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-2xl font-bold tracking-tight">Centro de Jubilados</CardTitle>
          <CardDescription className="text-base">
            Identifícate para continuar al panel.
          </CardDescription>
        </CardHeader>

        <form action={formAction} className="flex flex-col gap-6">
          <CardContent className="flex flex-col gap-4">
            <Input
              label="Usuario"
              id="username"
              name="username"
              type="text"
              required
              disabled={pending}
              error={!!error}
            />
            <Input
              label="Contraseña"
              id="password"
              name="password"
              type="password"
              required
              disabled={pending}
              error={!!error}
              errorText={error}
            />
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Ingresando..." : "Ingresar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}