import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import app from '../firebase/firebaseConfig';

// Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

// Define user profile type
interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isPremium: boolean;
  createdAt: Date;
  lastLogin: Date;
}

// Define auth context type
interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  register: (email: string, password: string, displayName: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  checkIsPremium: () => Promise<boolean>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Register a new user with email and password
  const register = async (email: string, password: string, displayName: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, { displayName });
    
    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      isPremium: false,
      createdAt: new Date(),
      lastLogin: new Date()
    };
    
    await setDoc(doc(firestore, 'users', user.uid), userProfile);
    
    return user;
  };

  // Sign in with email and password
  const login = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update last login
    await setDoc(doc(firestore, 'users', user.uid), {
      lastLogin: new Date()
    }, { merge: true });
    
    return user;
  };

  // Sign in with Google
  const loginWithGoogle = async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Check if user profile exists
    const userDoc = await getDoc(doc(firestore, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Create new user profile
      const userProfile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        isPremium: false,
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      await setDoc(doc(firestore, 'users', user.uid), userProfile);
    } else {
      // Update last login
      await setDoc(doc(firestore, 'users', user.uid), {
        lastLogin: new Date()
      }, { merge: true });
    }
    
    return user;
  };

  // Sign out
  const logout = async (): Promise<void> => {
    return signOut(auth);
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    return sendPasswordResetEmail(auth, email);
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<UserProfile>): Promise<void> => {
    if (!currentUser) throw new Error('No user is logged in');
    
    await setDoc(doc(firestore, 'users', currentUser.uid), data, { merge: true });
    
    // Update local state
    if (userProfile) {
      setUserProfile({ ...userProfile, ...data });
    }
  };

  // Check if user has premium subscription
  const checkIsPremium = async (): Promise<boolean> => {
    if (!currentUser) return false;
    
    const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserProfile;
      return userData.isPremium || false;
    }
    
    return false;
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Get user profile from Firestore
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    checkIsPremium
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
