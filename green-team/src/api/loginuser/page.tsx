"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { SiGmail } from "react-icons/si";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseConfig";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../../public/logo.png"

const LoginUser = () => {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/procura");
    } catch (error) {
      console.error(error);
      // Trate o erro aqui, talvez exibindo uma mensagem de erro para o usuário.
    }
  };

  return (
    <div>
      <div className="relative flex flex-col justify-center min-h-screen">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Logo da Minha Aplicação" className="mt-2 w-80 mx-auto" />
        </div>
        <div className="w-full mx-auto p-2 bg-white rounded-lg shadow-lg lg:max-w-xl">
          <div className="flex mt-4 gap-x-2 p-4">
            <button
              type="button"
              className="flex items-center justify-center w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md"
              onClick={handleGoogleLogin}
              aria-label="Login with Google"
            >
              <SiGmail /> <span className="ml-2">Login Gmail</span>
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Ao entrar, você concorda com nossos{' '}
              <a href="/politica-de-privacidade" className="text-blue-500 hover:underline">
                termos de uso
              </a>{' '}
              e{' '}
              <a href="/termos-de-servico" className="text-blue-500 hover:underline">
                política de privacidade
              </a>
            </p>
          </div>
        </div>
        {/* Adicione aqui outros elementos, como imagens ou informações adicionais, conforme necessário */}
      </div>
    </div>
  );
};

export default LoginUser;
