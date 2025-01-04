import { db, auth } from '@/config';
import { QUERY_KEYS } from '@/constants';
import { Roles } from '@/types';
import {
  User,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { collection, doc, FieldValue, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { createContext, ReactNode, useContext, useState, useEffect } from 'react';

type CreatedAt = {
  createdAt: {
    isEqual: (other: FieldValue) => boolean;
  };
};

export type UserInfo = {
  id?: string;
  email: string;
  role: Roles | null;
  customName: string | null;
  memberId: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
};

type Props = {
  login: (email: string, password: string) => Promise<UserCredential>;
  createUser: (email: string, password: string, memberId: string, role?: Roles, customName?: string) => Promise<User>;
  logout: () => Promise<void>;
  isUserExist: (email: string) => Promise<boolean>;
  user: UserInfo | null;
  isLoading: boolean;
};

const AuthContext = createContext<Props | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<Props['user']>(null);

  const login = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const createUser = async (email: string, password: string, memberId: string, role?: Roles, customName?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, QUERY_KEYS.USERS, userCredential.user.uid);
    await setDoc(userDocRef, {
      createdAt: serverTimestamp(),
      email,
      role: role || null,
      customName: customName || null,
      memberId,
      isAdmin: false,
      isSuperAdmin: false,
    } satisfies UserInfo & CreatedAt);

    return userCredential.user;
  };

  const getUser = async (user: User): Promise<UserInfo | null> => {
    const usersRef = collection(db, QUERY_KEYS.USERS);
    const q = query(usersRef, where('email', '==', user.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data() as UserInfo;

      return {
        ...userData,
        id: user.uid,
      };
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
      setIsLoading(true); // Start loading when the state changes.
      if (currentUser) {
        const userData = await getUser(currentUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      setIsLoading(false); // Only stop loading after all operations are complete.
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
