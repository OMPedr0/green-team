"use client"

import React, { useEffect, useState } from "react";
import "firebase/auth"; // Importe o módulo de autenticação do Firebase aqui


// Importe auth de "../../api/firebaseConfig"
import { auth } from "../../api/firebaseConfig";
import Navbar from "../components/navbar/navbar";

import { useDropzone } from 'react-dropzone';

interface CreatePostCardProps {
  onSubmit: (postData: PostData) => void;
}

interface PostData {
  image: File | null;
  name: string;
  description: string;
  category: string;
}


export default function Post() {

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState<PostData>({
    image: null,
    name: '',
    description: '',
    category: '',
  });

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFormData({
        ...formData,
        image: acceptedFiles[0],
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      image: null,
      name: '',
      description: '',
      category: '',
    });
  };

  return (
    <div>
       {user ? (
        <div>
          {/* Navbar deve ser importado e renderizado aqui */}
          <Navbar username={user.displayName} /> {/* Use o nome do usuário do Firebase */}
        </div>
      ) : (
        <p>Usuário não está logado.</p>
      )}
  

    <div> 
    <div className="bg-white p-4 rounded-lg shadow-lg w-auto">
      <h2 className="text-xl font-semibold mb-4">Criar um novo post</h2>
      <form onSubmit={handleSubmit}>
      <div className="mb-4">
          <label htmlFor="image" className="block text-gray-600 mb-2">Imagem:</label>
          <div {...getRootProps()} className="border border-dashed border-gray-300 rounded-lg p-4 cursor-pointer">
            <input {...getInputProps()} />
            {formData.image ? (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Imagem selecionada"
                className="max-h-32 mx-auto mb-2"
              />
            ) : (
              <p>Arraste e solte uma imagem aqui ou clique para selecionar uma.</p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-600 mb-2">Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-600 mb-2">Descrição:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-600 mb-2">Categoria:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 text-black border border-gray-300 rounded-lg focus:ring focus:ring-blue-400"
          >
            <option className="text-black" value="">Selecione uma categoria</option>
            <option className="text-black" value="categoria1">Agricultural Techniques</option>
            <option className="text-black" value="categoria2">Medicinal Techniques</option>
            <option className="text-black" value="categoria3">Solving Problems About Agriculture</option>
          </select>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
    </div>

    </div>
  )
}
