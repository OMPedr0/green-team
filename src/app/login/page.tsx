import { AuthProvider } from "@/api/auth"
import LoginUser from "../../api/loginuser/page"
import React from "react"



export default function Login() {



  return (
    <div>
      <AuthProvider>
        <LoginUser />
      </AuthProvider>

    </div>
  )
}
