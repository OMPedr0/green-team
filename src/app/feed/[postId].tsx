import { db } from '../../api/firebaseConfig';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

interface Comment {
  id: string;
  name: string;
  description: string;
}

interface Post {
  title: string;
  content: string;
}

function PostDetail() {
  const router = useRouter();
  const { postId } = router.query;

  const [comments, setComments] = useState<Comment[]>([]);
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (postId) {
      const loadPostAndComments = async () => {
        try {
          // Carregue os detalhes da publicação com base em postId
          const postRef = doc(db, 'posts', postId as string);
          const postSnapshot: DocumentSnapshot = await getDoc(postRef);
          const postData = postSnapshot.data() as Post | undefined;

          if (postData) {
            setPost(postData);

            // Carregue os comentários com base em postId
            const commentsRef = collection(db, `posts/${postId}/comentarios`);
            const commentsQuerySnapshot = await getDocs(commentsRef);
            const commentsData: Comment[] = commentsQuerySnapshot.docs.map(
              (doc: QueryDocumentSnapshot) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

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
