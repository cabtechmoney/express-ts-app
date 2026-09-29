"use client";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();

  const login = (token: string) => {
    localStorage.setItem("token", token);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  return { login, logout, getToken };
}