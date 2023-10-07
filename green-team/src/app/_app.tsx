// pages/_app.tsx

import { AuthProvider } from "../api/auth"; // Importe o AuthProvider
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider> {/* Envolve todos os componentes com o AuthProvider */}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
