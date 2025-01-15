import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import {
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  User,
} from 'firebase/auth';
import { collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/config';
import { QUERY_KEYS } from '@/constants';
import { Roles } from '@/types';
import { setDocument } from '@/api';

export type UserInfo = {
  id?: string;
  email: string;
  role: Roles | null;
  customName: string | null;
  memberId: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
};

type AuthContextType = {
  login: (email: string, password: string) => Promise<UserCredential>;
  createUser: (email: string, password: string, memberId: string, role?: Roles, customName?: string) => Promise<User>;
  logout: () => Promise<void>;
  isUserExist: (email: string) => Promise<boolean>;
  user: UserInfo | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const createUser = async (email: string, password: string, memberId: string, role?: Roles, customName?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await setDocument(QUERY_KEYS.USERS, userCredential.user.uid, {
      createdAt: serverTimestamp(),
      email,
      role: role || null,
      customName: customName || null,
      memberId,
      isAdmin: false,
      isSuperAdmin: false,
    } as UserInfo);

    return userCredential.user;
  };

  const getUser = async (currentUser: User): Promise<UserInfo | null> => {
    const usersRef = collection(db, QUERY_KEYS.USERS);
    const q = query(usersRef, where('email', '==', currentUser.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data() as UserInfo;
      return { ...userData, id: currentUser.uid };
    }
    return null;
  };

  const isUserExist = async (email: string) => {
    const usersRef = collection(db, QUERY_KEYS.USERS);
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      if (currentUser) {
        const userData = await getUser(currentUser);
        setUser(userData);
      } else {
        localStorage.clear();
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ login, createUser, logout, isUserExist, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
