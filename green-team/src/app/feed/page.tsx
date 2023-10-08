"use client"

// pages/feed.tsx

// pages/feed.tsx

import React, { useEffect, useState } from "react";
import { auth, db } from "../../api/firebaseConfig";
import Navbar from "../components/navbar/navbar";
import {
  collection,
  getDocs,
  addDoc,
  query,
  onSnapshot,
} from "firebase/firestore";
import { useRouter } from "next/navigation"; // Corrija a importação do useRouter
import Link from "next/link";
import dynamic from "next/dynamic";

import PostDetail from './[postId]';


export default function Feed() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");
  const router = useRouter(); // Corrija a maneira como o useRouter é importado

  const PostDetail = dynamic(() => import(`./[postId]`));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const { postId } = router.query || {};

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, "posts");
        const querySnapshot = await getDocs(postsRef);

        const postsData = [];
        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          postsData.push({ id: doc.id, ...postData });
        });

        setPosts(postsData);

        postsData.forEach((post) => {
          const commentsRef = collection(db, `posts/${post.id}/comentarios`);
          const postCommentsQuery = query(commentsRef);

          onSnapshot(postCommentsQuery, (querySnapshot) => {
            const postCommentsData = [];
            querySnapshot.forEach((doc) => {
              const commentData = doc.data();
              postCommentsData.push({ id: doc.id, ...commentData });
            });

            setComments((prevComments) => ({
              ...prevComments,
              [post.id]: postCommentsData,
            }));
          });
        });
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  const addComment = async (postId, name, description) => {
    try {
      const commentsRef = collection(db, `posts/${postId}/comentarios`);
      await addDoc(commentsRef, { name, description });
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <div>
      <div>

        {user ? (
          <div>
            <Navbar username={user.displayName} />
          </div>
        ) : (
          <p>Usuário não está logado.</p>
        )}

        <div className="flex justify-center p-4">
          <div className="w-1/4">
            {posts.map((post, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-2 cursor-pointer mb-4 flex flex-col"
              >
                <div className="flex">
                  <div className="w-2/3 text-center px-4">
                    <div className="text-left">
                      <h2 className="text-lg text-black font-semibold">{post.name}</h2>
                      <p className="text-sm text-black">{post.description}</p>
                      <p className="text-xs text-black">{post.category}</p>
                    </div>
                  </div>
                  <div className="w-1/3 text-center">
                    {post.imageURL && (
                      <img
                        src={post.imageURL}
                        alt="Imagem da postagem"
                        className="h-32 w-auto rounded-lg"
                      />
                    )}
                    {post.logoURL && (
                      <img
                        src={post.logoURL}
                        alt="Logo da postagem"
                        className="h-16 w-auto rounded-lg"
                      />
                    )}
                  </div>
                </div>

                <div className="w-full mt-4">
                  <div>
                    {comments[post.id] && comments[post.id].length > 0 && (
                      <div>
                        <h3 className="text-lg text-black font-semibold">Comentários:</h3>
                        {comments[post.id].slice(0, 3).map((comment, commentIndex) => (
                          <div key={commentIndex} className="border border-gray-300 p-4 my-4">
                            <p className="text-black">{comment.name}</p>
                            <p className="text-black">{comment.description}</p>
                          </div>
                        ))}
                        {comments[post.id].length > 3 && (
                          <Link href="/feed/[postId]" as={`/feed/${post.id}`} passHref>
                            <span className="text-black">
                              Ver todos os comentários ({comments[post.id].length})
                            </span>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Adicionar Comentário:</h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        addComment(post.id, user.displayName, commentText[post.id]);
                      }}
                    >
                      <input
                        type="text"
                        className="text-black"
                        placeholder="Seu comentário"
                        value={commentText[post.id]}
                        onChange={(e) => {
                          setCommentText((prevCommentText) => ({
                            ...prevCommentText,
                            [post.id]: e.target.value,
                          }));
                        }}
                      />
                      <button type="submit" className="text-black">
                        Enviar
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
