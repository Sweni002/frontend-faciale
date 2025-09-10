import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (matricule, mot_de_passe) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      credentials: "include",  // ⚡ VERY important
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matricule, mot_de_passe })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur login");

    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
    setUser(null);
  };

const fetchMe = async () => {
  const res = await fetch("http://localhost:5000/api/auth/me", {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Non authentifié");

  // ⚡ On met à jour le contexte user avec les infos essentielles
  const userData = {
    id: data.id,
    nom: data.nom,
    matricule: data.matricule,
    role: data.role,
    ...data, // ajoute le reste si besoin
  };
  console.log(userData)
  setUser(userData);

  return userData; // renvoie {id, nom, role, ...}
};


  return (
    <AuthContext.Provider value={{ user, login, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};
