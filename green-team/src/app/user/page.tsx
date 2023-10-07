import React, { useEffect, useState } from "react";




import { useAuth } from "../../api/auth"; // Importe o contexto de autenticação

type FormData = {
  name: string;
  email: string;
  // Adicione outros campos do formulário aqui
};

export default function User() {

  const { user } = useAuth(); // Use o contexto de autenticação para obter os dados do usuário
  const [formData, setFormData] = useState<FormData>({
    // Defina os campos do formulário e seus valores iniciais
    name: user ? user.displayName || "" : "",
    email: user ? user.email || "" : "",
    // Adicione outros campos aqui
  });

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Faça algo com os dados do formulário, como enviar para o servidor ou armazenar localmente
    console.log(formData);
  };

  return (
    <div>
      <h1>Perfil do Usuário</h1>
      <p>Bem-vindo, {formData.name}!</p>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <br />
        {/* Adicione outros campos do formulário aqui */}
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
