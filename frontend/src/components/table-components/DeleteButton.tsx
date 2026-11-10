import { X } from "lucide-react";
import type { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import type { UseApiCall } from "@/models/useApi.model";

type Props<P> = {
  param: P; // lo que recibe el servicio (normalmente el id)
  apiCall: (param: P) => UseApiCall<void>; // servicio de borrado
  onDeleted: () => void; // acá cada tabla saca la fila de su estado
  onError?: (error: AxiosError) => void;
};

export function DeleteButton<P>({ param, apiCall, onDeleted, onError }: Props<P>) {
  const { fetch: remove, loading } = useApi(apiCall);

  return (
    <div className="flex justify-center">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Eliminar"
        disabled={loading}
        onClick={() => remove(param, onDeleted, onError)}
        className="text-muted-foreground hover:text-destructive"
      >
        <X size={18} />
      </Button>
    </div>

  );
}
