import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface User {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
}
interface IAppContext {
  user: User | null;
  isAuthenticated: boolean | null;
}

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContext = createContext<IAppContext>({
  user: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
  },
  isAuthenticated: false,
});

export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    console.log(storedToken);

    fetch("/api/auth/getuser", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          setUser(data);
          setIsAuthenticated(true);
        }
      });
  }, []);

  const values = useMemo(
    () => ({ user, isAuthenticated }),
    [user, isAuthenticated]
  );

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
