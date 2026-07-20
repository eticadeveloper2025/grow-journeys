import { useEffect, useState, useCallback } from "react";
import { authRepository } from "@/repositories";
import type { User } from "@/types";

/** Hook demonstrativo. A validação real deverá ocorrer no backend. */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await authRepository.me();
      setUser(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await authRepository.login(email, password);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authRepository.logout();
    setUser(null);
  }, []);

  return { user, loading, login, logout, refresh, isAuthenticated: !!user };
}
