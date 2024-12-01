import { db, auth } from '@/config';
import {
  User,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { createContext, ReactNode, useContext, useState, useEffect } from 'react';

type Props = {
  login: (email: string, password: string) => Promise<UserCredential>;
  createUser: (email: string, password: string, name: string) => Promise<User>;
  logout: () => Promise<void>;
  isUserExist: (email: string) => Promise<boolean>;
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<Props | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<Props['user']>(null);

  const login = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const createUser = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userDocRef, {
      name: name,
      email,
      createdAt: serverTimestamp(),
    });

    return userCredential.user;
  };

  const isUserExist = async (email: string) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  };

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        createUser,
        login,
        logout,
        isUserExist,
        user,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): Props => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
