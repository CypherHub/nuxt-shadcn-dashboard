import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
  sendPasswordResetEmail,
} from "firebase/auth";

export const useAuth = () => {
  const { $auth } = useNuxtApp();
  const user = useState<User | null>("user", () => null);
  const error = ref<string | null>(null);
  const loading = ref(false);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      console.log("loginWithEmail called", { email });
      loading.value = true;
      error.value = null;
      const result = await signInWithEmailAndPassword($auth, email, password);
      user.value = result.user;
      console.log("loginWithEmail success", { user: result.user });
      return result.user;
    } catch (e: any) {
      error.value = e.message;
      console.error("loginWithEmail error", e);
      throw e;
    } finally {
      loading.value = false;
      console.log("loginWithEmail finished");
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log("loginWithGoogle called");
      loading.value = true;
      error.value = null;
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup($auth, provider);
      user.value = result.user;
      console.log("loginWithGoogle success", { user: result.user });
      return result.user;
    } catch (e: any) {
      error.value = e.message;
      console.error("loginWithGoogle error", e);
      throw e;
    } finally {
      loading.value = false;
      console.log("loginWithGoogle finished");
    }
  };

  const logout = async () => {
    try {
      console.log("logout called");
      await signOut($auth);
      user.value = null;
      console.log("logout success");
    } catch (e: any) {
      error.value = e.message;
      console.error("logout error", e);
      throw e;
    }
  };

  const sendResetEmail = async (email: string) => {
    try {
      await sendPasswordResetEmail($auth, email, {
        url: "http://localhost:3000/login",
        handleCodeInApp: false,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    error,
    loading,
    loginWithEmail,
    loginWithGoogle,
    logout,
    sendResetEmail,
  };
};
