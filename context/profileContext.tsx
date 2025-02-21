import { shopDetails, UserData } from '@/models/common';
import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of the profile data
interface ProfileProps {
  _id: string;
  shopId?: string;  // Optional if it may not always be present
  firstname: string;
  lastname: string;
  email: string;
  phone: number;
}

// Define the shape of the context value
interface ProfileContextValue {
  profileData: UserData | null;
  setProfileData: React.Dispatch<React.SetStateAction<UserData | null>>;
  ShopDetails: shopDetails| null;
  setShopDetails: React.Dispatch<React.SetStateAction<shopDetails | null>>;
  authToken : string | null
  setAuthToken:  React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the context with a default value
export const ProfileContext = createContext<ProfileContextValue>({
  profileData: null,
  setProfileData: () => {},
  ShopDetails: null,
  setShopDetails: () => {},
  authToken: null,
  setAuthToken: () => {},

});

interface ProfileContextProviderProps {
  children: ReactNode;
}

export function ProfileContextProvider({ children }: ProfileContextProviderProps) {
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [ShopDetails,setShopDetails] = useState<shopDetails | null>(null);
  const [authToken,setAuthToken] = useState<string | null>(null);

  const userContextValue: ProfileContextValue = {
    profileData,
    setProfileData,
    ShopDetails,
    setShopDetails,
    authToken,
    setAuthToken
  };

  return (
    <ProfileContext.Provider value={userContextValue}>
      {children}
    </ProfileContext.Provider>
  );
}
