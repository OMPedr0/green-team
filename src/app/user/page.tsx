"use client"
// Importe os módulos necessários
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; // Corrija a importação do useRouter
import { auth, db } from "../../api/firebaseConfig";
import Navbar from "../components/navbar/navbar";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

interface PostData {
  imageURL: string | undefined;
  id: string;
  name: string;
  description: string;
  category: string;
  user_id: string;
}
interface EditFormProps {
  editName: string;
  editDescription: string;
  editCategory: string;
  handleEditSubmit: (e: React.FormEvent) => void;
  handleEditNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleEditCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  closeEditModal: () => void;
  editablePost?: PostData; // Adicionando editablePost como uma propriedade opcional
}

function EditForm({
  editName,
  editDescription,
  editCategory,
  handleEditSubmit,
  handleEditNameChange,
  handleEditDescriptionChange,
  handleEditCategoryChange,
  closeEditModal,
  editablePost // Declaramos a propriedade como opcional
}: EditFormProps) { return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-40"></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-50">
        <form onSubmit={handleEditSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-name" className="block text-gray-600 mb-2">Nome:</label>
            <input
              type="text"
              id="edit-name"
              name="edit-name"
              value={editName}
              onChange={handleEditNameChange}
              className="w-full p-2 border text-black border-gray-300 rounded-lg focus:ring focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="edit-description" className="block text-gray-600 mb-2">Descrição:</label>
            <textarea
              id="edit-description"
              name="edit-description"
              value={editDescription}
              onChange={handleEditDescriptionChange}
              className="w-full p-2 border text-black border-gray-300 rounded-lg focus:ring focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="edit-category" className="block text-gray-600 mb-2">Categoria:</label>
            <select
              id="edit-category"
              name="edit-category"
              value={editCategory}
              onChange={handleEditCategoryChange}
              className="w-full p-2 text-black border border-gray-300 rounded-lg focus:ring focus:ring-blue-400"
            >
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
              Salvar
            </button>
            <button
              type="button"
              onClick={closeEditModal}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ml-2"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function User() {
  const [user, setUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<PostData[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editablePost, setEditablePost] = useState<PostData | null>(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const [selectedPost, setSelectedPost] = useState<PostData | null>(null); // Postagem selecionada
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserPosts(authUser.uid);
      } else {
        router.push('/');
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserPosts = async (userId: string) => {
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("user_id", "==", userId));
      const querySnapshot = await getDocs(q);

      const userPostsData: PostData[] = [];
      querySnapshot.forEach((doc) => {
        const postData = doc.data() as PostData;
        postData.id = doc.id; // Assign the document ID to the post data
        userPostsData.push(postData);
      });

      setUserPosts(userPostsData);
    } catch (error) {
      console.error("Error fetching user posts: ", error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Atualize os dados no Firebase
      const postDocRef = doc(db, 'posts', editablePost!.id); // Certifique-se de que editablePost não é nulo
      await updateDoc(postDocRef, {
        name: editName,
        description: editDescription,
        category: editCategory,
      });

      // Feche o modal de edição
      setIsEditModalOpen(false);

      // Atualize a postagem selecionada se estiver aberta
      if (selectedPost) {
        setSelectedPost({
          ...selectedPost,
          name: editName,
          description: editDescription,
          category: editCategory,
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar a postagem: ', error);
    }
  };

  const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };

  const handleEditDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditDescription(e.target.value);
  };

  const handleEditCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditCategory(e.target.value);
  };

  const editPost = (post: PostData) => {
    setEditablePost(post);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openPostDetails = (post: PostData) => {
    setSelectedPost(post);
  };

  const closePostDetails = () => {
    setSelectedPost(null);
  };

  return (
    <div>
      {user ? (
        <div>
          <Navbar username={user.displayName} />
          <h1 className="text-3xl font-bold my-4">Perfil do Usuário</h1>
          <p className="mb-4">Bem-vindo, {user.displayName}!</p>

          <h2 className="text-2xl font-semibold my-4">Minhas Publicações</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg p-4 cursor-pointer">
                <div className="text-right">
                  {/* Posicione a imagem e o botão à direita */}
                  {post.imageURL && (
                    <img
                      src={post.imageURL}
                      alt="Imagem da postagem"
                      className="max-h-32 mb-2 float-right rounded-lg" // Use float-right para mover a imagem para a direita
                    />
                  )}
                </div>
                <div onClick={() => openPostDetails(post)}>
                  <p className="text-xl text-black font-semibold">{post.name}</p>
                  <p className="text-lg text-black">{post.description}</p>
                  <p className="text-black">{post.category}</p>
                </div>
                <div>
                  <button
                    onClick={() => editPost(post)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mt-2 ml-auto" // Use ml-auto para mover o botão para a direita
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedPost && (
            <div className="text-black rounded-lg shadow-md p-4 mt-4">
              <button
                onClick={closePostDetails}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
              >
                Fechar
              </button>
              <p className="text-xl text-black font-semibold mt-2">{selectedPost.name}</p>
              <p className="text-xl text-black mt-2">{selectedPost.description}</p>
              <p className="text-xl text-black mt-2">{selectedPost.category}</p>
            </div>
          )}

          {isEditModalOpen && editablePost && (
            <EditForm
              editablePost={editablePost}
              editName={editName}
              editDescription={editDescription}
              editCategory={editCategory}
              handleEditSubmit={handleEditSubmit}
              handleEditNameChange={handleEditNameChange}
              handleEditDescriptionChange={handleEditDescriptionChange}
              handleEditCategoryChange={handleEditCategoryChange}
              closeEditModal={closeEditModal}
            />
          )}
        </div>
      ) : (
        <p>Usuário não está logado.</p>
      )}
    </div>
  );
}
