import { useCallback, useEffect, useRef, useState } from "react";
import axios, { type AxiosError } from "axios";
import type { UseApiCall } from "@/models/useApi.model";

type UseApiOptions<T> = {
  autoFetch?: boolean; // solo para llamadas sin parámetros
  initialData?: T;
};

type CustomError = AxiosError | Error | null;

// apiCall debe ser estable: una función de services o una envuelta en useCallback
export const useApi = <T, P = void>(
  apiCall: (param: P) => UseApiCall<T>,
  options?: UseApiOptions<T>,
) => {
  const [loading, setLoading] = useState(options?.autoFetch ?? false);
  const [data, setData] = useState<T | undefined>(options?.initialData);
  const [error, setError] = useState<CustomError>(null);
  const controllers = useRef(new Set<AbortController>());

  // Ejecuta la llamada. No toca setState de forma síncrona.
  const run = useCallback(
    (
      param: P,
      onFinish?: (data: T) => void,
      onError?: (error: AxiosError) => void,
    ) => {
      const { call, controller } = apiCall(param);
      controllers.current.add(controller);

      call
        .then((response) => {
          setData(response.data);
          setError(null);
          onFinish?.(response.data);
        })
        .catch((err) => {
          if (axios.isCancel(err)) return; // cancelada a propósito, no es un error
          setError(err);
          onError?.(err);
        })
        .finally(() => {
          controllers.current.delete(controller);
          if (controllers.current.size === 0) setLoading(false);
        });
    },
    [apiCall],
  );

  const fetch = useCallback(
    (
      param: P,
      onFinish?: (data: T) => void,
      onError?: (error: AxiosError) => void,
    ) => {
      setLoading(true);
      run(param, onFinish, onError);
    },
    [run],
  );

  // Al desmontar, cancela lo que siga en curso
  useEffect(() => {
    const active = controllers.current;
    return () => active.forEach((c) => c.abort());
  }, []);

  useEffect(() => {
    if (options?.autoFetch) run(undefined as P);
  }, [run, options?.autoFetch]);

  return { loading, data, setData, error, fetch };
};
