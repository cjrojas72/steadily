import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/auth/AuthContext";
import { router } from "./router";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" richColors closeButton />
    </AuthProvider>
  );
}
