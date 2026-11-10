import api from "./token.interceptor";
import { LOGIN_CATEGORIES, LOGIN_CATEGORIES_ID } from "@/config";
import { loadAbort } from "@/utilities";
import type { UseApiCall } from "@/models/useApi.model";
import type {
  LoginCategory,
  LoginCategoryCreate,
  LoginCategoryUpdate,
} from "@/models/loginCategory.model";

export const getLoginCategories = (): UseApiCall<LoginCategory[]> => {
  const controller = loadAbort();
  return {
    call: api.get<LoginCategory[]>(LOGIN_CATEGORIES, { signal: controller.signal }),
    controller,
  };
};

export const getLoginCategory = (id: number): UseApiCall<LoginCategory> => {
  const controller = loadAbort();
  return {
    call: api.get<LoginCategory>(LOGIN_CATEGORIES_ID(id), { signal: controller.signal }),
    controller,
  };
};

export const createLoginCategory = (
  data: LoginCategoryCreate,
): UseApiCall<LoginCategory> => {
  const controller = loadAbort();
  return {
    call: api.post<LoginCategory>(LOGIN_CATEGORIES, data, { signal: controller.signal }),
    controller,
  };
};

export const updateLoginCategory = ({
  id,
  changes,
}: {
  id: number;
  changes: LoginCategoryUpdate;
}): UseApiCall<LoginCategory> => {
  const controller = loadAbort();
  return {
    call: api.patch<LoginCategory>(LOGIN_CATEGORIES_ID(id), changes, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const deleteLoginCategory = (id: number): UseApiCall<void> => {
  const controller = loadAbort();
  return {
    call: api.delete<void>(LOGIN_CATEGORIES_ID(id), { signal: controller.signal }),
    controller,
  };
};
