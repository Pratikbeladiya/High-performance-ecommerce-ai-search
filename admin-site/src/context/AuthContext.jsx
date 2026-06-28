import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("user_token"));
  const [isLoading, setIsLoading] = useState(true);

  const getHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, [token]);

  // Fetch current profile from backend
  const fetchProfile = useCallback(async (authToken) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        // Token might be invalid or expired
        localStorage.removeItem("user_token");
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize and load user profile if token exists
  useEffect(() => {
    if (token) {
      fetchProfile(token);
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, [token, fetchProfile]);

  // Login handler
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to log in");
      }

      localStorage.setItem("user_token", data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone,
        address: data.address,
        city: data.city,
        zip: data.zip,
        country: data.country,
      });
      return data;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register/Signup handler
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to sign up");
      }

      localStorage.setItem("user_token", data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      return data;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile details
  const updateProfile = async (profileData) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser(data);
      if (data.token) {
        localStorage.setItem("user_token", data.token);
        setToken(data.token);
      }
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("user_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        getHeaders,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
