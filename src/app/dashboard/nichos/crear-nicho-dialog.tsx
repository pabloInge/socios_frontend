"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { crearNicho } from "./actions";

interface CrearNichoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CrearNichoDialog({
  open,
  onOpenChange,
  onSuccess,
}: CrearNichoDialogProps) {
  const [sector, setSector] = React.useState("");
  const [nroNicho, setNroNicho] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const resetForm = () => {
    setSector("");
    setNroNicho("");
    setErrorMsg(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sector.trim()) {
      setErrorMsg("El sector es obligatorio.");
      return;
    }
    if (!nroNicho.trim()) {
      setErrorMsg("El número de nicho es obligatorio.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await crearNicho({
        sector: sector.trim(),
        nroNicho: nroNicho.trim(),
      });

      if (res.success) {
        handleClose();
        onSuccess();
      } else {
        setErrorMsg(res.mensaje || "Ocurrió un error al crear el nicho.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado al crear.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? handleClose() : onOpenChange(true))}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nuevo Nicho</DialogTitle>
            <DialogDescription>
              Ingrese el sector y número para registrar un nicho disponible.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nicho-sector">Sector</Label>
              <Input
                id="nicho-sector"
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="Ej: A, B, Pabellón 1..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nicho-numero">Número de Nicho</Label>
              <Input
                id="nicho-numero"
                type="text"
                value={nroNicho}
                onChange={(e) => setNroNicho(e.target.value)}
                placeholder="Ej: 104, 12..."
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="default" disabled={loading}>
              {loading ? "Creando..." : "Crear Nicho"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
