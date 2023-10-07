"use client"

import React, { useEffect, useState } from "react";
import "firebase/auth"; // Importe o módulo de autenticação do Firebase aqui


// Importe auth de "../../api/firebaseConfig"
import { auth } from "../../api/firebaseConfig";
import Navbar from "../components/navbar/navbar";

export default function Procura() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // O usuário está autenticado, você pode acessar suas informações em authUser
        setUser(authUser);
      } else {
        // O usuário não está autenticado
        setUser(null);
      }
    });

    // Certifique-se de limpar o listener ao desmontar o componente
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          {/* Navbar deve ser importado e renderizado aqui */}
          <Navbar username={user.displayName} /> {/* Use o nome do usuário do Firebase */}
          <h1>Teste 2</h1>
        </div>
      ) : (
        <p>Usuário não está logado.</p>
      )}
    </div>
  );
}
