"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <Card variant="elevated" className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Centro de Jubilados</CardTitle>
          <CardDescription className="text-sm">
            Identifícate para continuar al panel.
          </CardDescription>
        </CardHeader>
        
        <form action={formAction} className="flex flex-col gap-8">
          <CardContent className="flex flex-col gap-4">
            {state?.error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                {state.error}
              </div>
            )}
            
            <Input
              label="Usuario"
              id="username"
              name="username" 
              type="text"
              required
              disabled={pending}
            />
            
            <Input
              label="Contraseña"
              id="password"
              name="password"
              type="password"
              required
              disabled={pending}
            />
          </CardContent>

          <CardFooter className="px-0">
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Ingresando..." : "Ingresar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}