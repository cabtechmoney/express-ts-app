// services/client.service.ts

import { api } from "../lib/api";

export interface CreateClientDto {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface Client extends CreateClientDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export const ClientService = {
  getAll: () => api<Client[]>("/clients"),

  create: (data: CreateClientDto) =>
    api<Client>("/clients", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
