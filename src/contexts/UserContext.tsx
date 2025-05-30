import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

interface UserContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isPremium: boolean;
  trialDays: number;
  loading: boolean;
  error: string | null;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  subscribeToPremium: (planType: string, paymentDetails: any) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  birthData?: {
    date: string;
    time: string;
    place: string;
    latitude: string;
    longitude: string;
  };
  isPremium: boolean;
  premiumExpiry?: Date;
  trialDays: number;
  savedCharts: string[];
  preferences: {
    language: string;
    theme: string;
    notifications: boolean;
  };
  createdAt: Date;
  lastLogin: Date;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            setUserProfile(userData);
            
            // Update last login
            await updateDoc(doc(db, 'users', user.uid), {
              lastLogin: new Date()
            });
          } else {
            // Create default profile if it doesn't exist
            const defaultProfile: UserProfile = {
              uid: user.uid,
              displayName: user.displayName || 'User',
              email: user.email || '',
              isPremium: false,
              trialDays: 7,
              savedCharts: [],
              preferences: {
                language: 'en',
                theme: 'light',
                notifications: true
              },
              createdAt: new Date(),
              lastLogin: new Date()
            };
            
            await setDoc(doc(db, 'users', user.uid), defaultProfile);
            setUserProfile(defaultProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError('Failed to load user profile');
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, {
        displayName: name
      });
      
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        displayName: name,
        email: email,
        isPremium: false,
        trialDays: 7,
        savedCharts: [],
        preferences: {
          language: 'en',
          theme: 'light',
          notifications: true
        },
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      setUserProfile(userProfile);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) {
      setError('No user logged in');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        ...data,
      });
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
      
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPremium = async (planType: string, paymentDetails: any) => {
    if (!currentUser || !userProfile) {
      setError('No user logged in');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      
      // Calculate expiry date based on plan type
      let expiryDate = new Date();
      if (planType === 'monthly') {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      } else if (planType === 'yearly') {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      } else if (planType === 'lifetime') {
        expiryDate = new Date(2099, 11, 31); // Far future date for lifetime
      }
      
      // Update user profile with premium status
      await updateDoc(doc(db, 'users', currentUser.uid), {
        isPremium: true,
        premiumExpiry: expiryDate,
        // Store payment details in a separate collection for security
      });
      
      // Store payment transaction
      await setDoc(doc(db, 'payments', `${currentUser.uid}_${Date.now()}`), {
        userId: currentUser.uid,
        planType,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        paymentMethod: paymentDetails.method,
        transactionId: paymentDetails.transactionId,
        timestamp: new Date()
      });
      
      // Update local state
      setUserProfile(prev => prev ? { 
        ...prev, 
        isPremium: true,
        premiumExpiry: expiryDate
      } : null);
      
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!currentUser || !userProfile) {
      setError('No user logged in');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      
      // Update user profile to cancel premium
      await updateDoc(doc(db, 'users', currentUser.uid), {
        isPremium: false,
        premiumExpiry: null
      });
      
      // Update local state
      setUserProfile(prev => prev ? { 
        ...prev, 
        isPremium: false,
        premiumExpiry: undefined
      } : null);
      
    } catch (err: any) {
      console.error('Subscription cancellation error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    userProfile,
    isPremium: userProfile?.isPremium || false,
    trialDays: userProfile?.trialDays || 0,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    subscribeToPremium,
    cancelSubscription
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
