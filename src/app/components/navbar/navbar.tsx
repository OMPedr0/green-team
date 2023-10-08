import React from 'react';
import Link from 'next/link'; // Importe o componente Link do Next.js
import { auth } from "../../../api/firebaseConfig";
import router from 'next/router';

function Navbar({ username }: { username: string }) {

  function handleLogoutClick() {
    auth.signOut();
    router.push("/");
  }
  return (
    <nav className="bg-emerald-500 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src="/logo.png" // Substitua pelo URL da imagem da logo do usuário
            alt="Logo do Usuário"
            className="w-12 h-12" // Aumente o tamanho da imagem aqui
          />
          <span className="text-white text-lg font-semibold">{username}</span>
        </div>
        <ul className="flex space-x-4">
          <li>
            <a href="/feed" className="text-white hover:underline">Feed</a>
          </li>
          <li>
            <a href="/user" className="text-white hover:underline">Perfil</a>
          </li>
          <li>
            <Link href="/post"> {/* Adicione o caminho da página de criação de post aqui */}
              <a className="text-white hover:underline">Criar Post</a>
            </Link>
          </li>
          <li>
            <a onClick={handleLogoutClick} className="text-white hover:underline">Sair</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}     

export default Navbar;
