import { db } from '../../api/firebaseConfig';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

function PostDetail() {
  const router = useRouter();
const { postId } = router.query;

  const [comments, setComments] = useState([]);
  const [post, setPost] = useState(null);


  useEffect(() => {
    if (postId) {
      const loadPostAndComments = async () => {
        try {
          // Carregue os detalhes da publicação com base em postId
          const postRef = collection(db,'posts').getDocs(postId);
          const postSnapshot = await postRef.get();
          const postData = postSnapshot.data();

          if (postData) {
            setPost(postData);

            // Carregue os comentários com base em postId
            const commentsRef = collection(db,`posts/${postId}/comentarios`);
            const commentsQuerySnapshot = await commentsRef.get();
            const commentsData = commentsQuerySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setComments(commentsData);
          } else {
            console.error('Publicação não encontrada');
          }
        } catch (error) {
          console.error('Erro ao carregar post e comentários: ', error);
        }
      };

      loadPostAndComments();
    }
  }, [postId]);

  if (!post) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      {/* Conteúdo dos detalhes da publicação e dos comentários */}
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      <h2>Comentários:</h2>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.name}</p>
          <p>{comment.description}</p>
        </div>
      ))}
    </div>
  );  
}

export default PostDetail;
