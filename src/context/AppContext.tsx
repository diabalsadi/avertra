import { createContext, ReactNode, useContext, useMemo } from "react";
import { useSession } from "next-auth/react";

interface User {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
}

interface IAppContext {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
}

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContext = createContext<IAppContext>({
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: true,
});

export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const { data: session, status } = useSession();

  const values = useMemo(() => {
    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated" && !!session;
    const token = session?.accessToken || null;

    const user: User | null = session?.user
      ? {
          id: session.user.id || "",
          email: session.user.email || "",
          firstName: session.user.firstName || "",
          lastName: session.user.lastName || "",
        }
      : null;

    return {
      user,
      isAuthenticated,
      token,
      isLoading,
    };
  }, [session, status]);

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
