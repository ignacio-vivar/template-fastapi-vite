import api from "./token.interceptor";
import { LOGIN_USERS, LOGIN_USERS_ID, AUTH_ME } from "@/config";
import { loadAbort } from "@/utilities";
import type { UseApiCall } from "@/models/useApi.model";
import type { Login, LoginCreate, LoginUpdate } from "@/models/login.model";

export const getMe = (): UseApiCall<Login> => {
  const controller = loadAbort();
  return {
    call: api.get<Login>(AUTH_ME, { signal: controller.signal }),
    controller,
  };
};

export const getLogins = (): UseApiCall<Login[]> => {
  const controller = loadAbort();
  return {
    call: api.get<Login[]>(LOGIN_USERS, { signal: controller.signal }),
    controller,
  };
};

export const getLogin = (id: number): UseApiCall<Login> => {
  const controller = loadAbort();
  return {
    call: api.get<Login>(LOGIN_USERS_ID(id), { signal: controller.signal }),
    controller,
  };
};

export const createLogin = (data: LoginCreate): UseApiCall<Login> => {
  const controller = loadAbort();
  return {
    call: api.post<Login>(LOGIN_USERS, data, { signal: controller.signal }),
    controller,
  };
};

export const updateLogin = ({
  id,
  changes,
}: {
  id: number;
  changes: LoginUpdate;
}): UseApiCall<Login> => {
  const controller = loadAbort();
  return {
    call: api.patch<Login>(LOGIN_USERS_ID(id), changes, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const deleteLogin = (id: number): UseApiCall<void> => {
  const controller = loadAbort();
  return {
    call: api.delete<void>(LOGIN_USERS_ID(id), { signal: controller.signal }),
    controller,
  };
};
