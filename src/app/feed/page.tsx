"use client"
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
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
import { User } from "firebase/auth";

interface Comment {
  id: string;
  name: string;
  description: string;
}

interface Post {
  id: string;
  name: string;
  description: string;
  category: string;
  imageURL?: string;
  logoURL?: string;
}

export default function Feed() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [commentText, setCommentText] = useState<string>("");

  const router = useRouter();


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



  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, "posts");
        const querySnapshot = await getDocs(postsRef);
        const postsData: Post[] = [];

        querySnapshot.forEach((doc) => {
          const postData = doc.data() as Post;
          postsData.push({
            ...postData,
            id: doc.id,
          });
        });

        setPosts(postsData);

        postsData.forEach((post) => {
          const commentsRef = collection(db, `posts/${post.id}/comentarios`);
          const postCommentsQuery = query(commentsRef);

          onSnapshot(postCommentsQuery, (querySnapshot) => {
            const postCommentsData: Comment[] = [];

            querySnapshot.forEach((doc) => {
              const commentData = doc.data() as Comment;
              postCommentsData.push({
                ...commentData,
                id: doc.id,

              });
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




  const addComment = async (postId: string, name: string, description: string) => {
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
            <Navbar username={user.displayName || ""} />
          </div>
        ) : (
          <p>Usuário não está logado.</p>
        )}

        <div className="flex justify-center p-4">
          <div className="w-1/4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg p-2 cursor-pointer mb-4 flex flex-col"
              >
                <div className="flex">
                  <div className="w-2/3 text-center px-4">
                    <div className="text-left">
                      <h2 className="text-lg text-black font-semibold">
                        {post.name}
                      </h2>
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
                        <h3 className="text-lg text-black font-semibold">
                          Comentários:
                        </h3>
                        {comments[post.id].slice(0, 3).map((comment) => (
                          <div
                            key={comment.id}
                            className="border border-gray-300 p-4 my-4"
                          >
                            <p className="text-black">{comment.name}</p>
                            <p className="text-black">{comment.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Adicionar Comentário:
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        addComment(post.id, user?.displayName || "", commentText);
                        setCommentText("");
                      }}
                    >
                      <input
                        type="text"
                        className="text-black"
                        placeholder="Seu comentário"
                        value={commentText}
                        onChange={(e) => {
                          setCommentText(e.target.value);
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
