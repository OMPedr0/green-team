"use client"

import { SiGmail } from "react-icons/si";
import { signInWithPopup } from "firebase/auth";

import Image from 'next/image';
import { useRouter } from "next/navigation";

import { auth, provider } from "../firebaseConfig";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from "react";



const Login = () => {
    const router = useRouter();

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);

            router.push("/procura");

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="relative  flex flex-col justify-center min-h-screen">
                <div className="w-full p-6 m-auto bg-zinc-50 rounded-lg shadow-xl lg:max-w-xl">
                    <div className="flex mt-4 gap-x-2 p-4 ">
                        <button
                            type="button"
                            className="flex items-center justify-center w-full p-2 border border-gray-600 hover:bg-gray-400 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-violet-600"
                            onClick={handleGoogleLogin}
                        >
                            <SiGmail /> <span className="ml-2">Gmail</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
