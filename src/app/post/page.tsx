"use client";
import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../../api/firebaseConfig"; // Certifique-se de importar o storage
import Navbar from "../components/navbar/navbar";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Importe as funções do Firebase Storage
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

interface PostData {
  image: File | null;
  name: string;
  description: string;
  category: string;
}

export default function Post() {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<PostData>({
    image: null,
    name: '',
    description: '',
    category: '',
  });
  const router = useRouter();

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
    accept: ['image/*'],
    multiple: false,
  });
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        router.push('/login');
        setUser(null);
      } else {
        setUser(authUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Verifique se há uma imagem selecionada
    if (!formData.image) {
      console.error("Você deve selecionar uma imagem.");
      return;
    }
  
    // Crie uma referência ao Firebase Storage
    const storageRef = ref(storage, 'images/' + formData.image.name);
  
    // Faz o upload da imagem para o Firebase Storage
    const uploadTask = uploadBytes(storageRef, formData.image);
  
    try {
      // Aguarda o término do upload
      const uploadSnapshot = await uploadTask;
  
      // Obtém a URL de download da imagem
      const imageURL = await getDownloadURL(storageRef);
  
      // Crie uma referência à coleção "posts" no Firestore
      const postsRef = collection(db, "posts");
  
      // Prepare os dados que você deseja salvar
      const postData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        user_id: auth.currentUser?.uid,
        imageURL: imageURL, // Adicione a URL da imagem aos dados do post
      };
  
      // Adicione os dados do post ao Firestore
      await addDoc(postsRef, postData);
  
      // Redefina o formulário após o envio bem-sucedido
      setFormData({
        image: null,
        name: "",
        description: "",
        category: "",
      });
  
      // Você pode adicionar uma mensagem de sucesso ou navegar para outra página
      // router.push("/success"); // Exemplo de navegação
    } catch (error) {
      console.error("Erro ao adicionar documento: ", error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <Navbar username={user.displayName} />
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
                className="w-full p-2 border text-black border-gray-300 rounded-lg focus:ring focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-600 mb-2">Descrição:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border text-black border-gray-300 rounded-lg focus:ring focus:ring-blue-400"
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
                <option value="Agricultural Techniques">Agricultural Techniques</option>
                <option value="Medicinal Techniques">Medicinal Techniques</option>
                <option value="Solving Problems About Agriculture">Solving Problems About Agriculture</option>
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
  );
}
