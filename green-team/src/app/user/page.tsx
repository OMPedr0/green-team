"use client"

// Importe os módulos necessários
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";

import { auth } from "../../api/firebaseConfig";
// Defina o tipo para os dados do formulário


export default function User() {

  
  const [user, setUser] = useState(null);

  // Obtenha o usuário do contexto de autenticação
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
      <h1>Perfil do Usuário</h1>
      {user ? (
        <div>
         <p>Bem-vindo, {user.displayName}!</p>
        </div>
      ) : (
        <p>Usuário não está logado.</p>
      )}
     
    </div>
  );
}
