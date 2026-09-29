import { useEffect, useState, useCallback } from "react";
import { Client, ClientService } from "../services/client.services";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const loadClients = useCallback(async () => {
    try {
      const data = await ClientService.getAll();
      setClients(data);
    } catch (error) {
      console.error("Failed to load clients", error);
    }
  }, []);

  useEffect(() => { const fetchClients = async () => {
      await loadClients();
    };
    fetchClients();
  }, [loadClients]);

  return { clients, loadClients };
}