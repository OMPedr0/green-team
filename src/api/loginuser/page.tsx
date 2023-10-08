"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SiGmail } from "react-icons/si";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseConfig";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginUser = () => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      if (isChecked) {
        // Permitir login somente se a caixa de seleção estiver marcada
        await signInWithPopup(auth, provider);
        router.push("/feed");
      } else {
        toast.error("Favor marcar a caixa de concordância com os Termos de Uso e a Política de Privacidade", { theme: "dark" });
      }
    } catch (error) {
      router.push("/");
      console.error(error);
      // Trate o erro aqui, talvez exibindo uma mensagem de erro para o usuário.
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };



  return (
    <div>
       <ToastContainer />
      <div className="relative flex flex-col justify-center min-h-screen">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Logo da Minha Aplicação" className="mt-2 w-80 mx-auto" />
        </div>
        <div className="w-full mx-auto p-2 bg-white rounded-lg shadow-lg lg:max-w-xl">
        <div className="mt-6 text-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="nome_da_caixa"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="form-checkbox text-blue-500 border-blue-500 focus:ring-2 focus:ring-blue-300"
            />
            <span className="text-gray-600">
              Concordo com os{" "}
              <a href="/politica-de-privacidade" className="text-blue-500 hover:underline">
                Termos de Uso
              </a>{" "}
              e{" "}
              <a href="/termos-de-servico" className="text-blue-500 hover:underline">
                Política de Privacidade
              </a>
            </span>
          </label>
        </div>
        <div className="flex mt-4 gap-x-2 p-4">
          <button
            type="button"
            className="flex items-center justify-center w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md"
            onClick={handleGoogleLogin}
            aria-label="Login with Google"
            disabled={!isChecked} // Desabilitar o botão se a caixa de seleção não estiver marcada
          >
            <SiGmail /> <span className="ml-2">Login Gmail</span>
          </button>
        </div>
          </div>
        </div>
       
      </div>
  );
};

export default LoginUser;
