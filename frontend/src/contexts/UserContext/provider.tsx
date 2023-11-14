import React, { createContext, useState, useEffect, Dispatch, SetStateAction, ReactNode, useContext } from "react";
import { Route, Routes } from 'react-router-dom';
import axios from "axios";
import { Login } from "../../pages";
import Verify2fa from '../../pages/Verify2fa'
// import SettingsPage from "../../pages/SettingsPage";
import FirstInfoPage from "../../pages/FirstInfoPage";

export type User = {
  userName: string;
  avatar: string;
  intraId: string;
  status: string;
  userRole?: string;
  isLogged: boolean;
  TwoFactorAuth: boolean;
  twoFactorCorrect: boolean;
  score: number;
  totalWin: number;
  totalLoose: number;
  intraName:string;
};

export interface UserContextInterface {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

const defaultState = {
  user: {
    userName: '',
    intraId: '',
    avatar: '',
    status: '',
    userRole: '',
    isLogged: false,
    TwoFactorAuth: false,
    twoFactorCorrect: false,
    score: 1,
    totalWin: 2,
    totalLoose: 0,
    intraName: ''
  },
  setUser: (user: User) => { }
} as UserContextInterface;

export const UserContext = createContext<UserContextInterface>(defaultState);

export function useUser() {
  return useContext(UserContext);
}

type UserProviderProps = {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        return JSON.parse(storedUser);
    }
    return {
      userName: '',
      avatar: '',
      intraId: '',
      status: '',
      userRole: '',
      isLogged: false,
      TwoFactorAuth: false,
      twoFactorCorrect: false,
      score: 0,
      totalWin: 0,
      totalLoose: 0,
      intraName: ''
    };
  });



  useEffect(() => {
    if (user.isLogged) {
      return;
    }
    const fetchData = async () => {
      if (!window.location.pathname.match('/login') ) {
      try {
        const response = await axios.get('http://f1r1s3.codam.nl:3001/auth/status', { withCredentials: true });
        const updatedUser = { ...response.data, twoFactorCorrect: false };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // console.log("user name" + user.userName)
     
      } catch (error) {
          window.location.href = '/login';
          localStorage.clear();
      }
    }};
    fetchData();
  }, );
  if(!user.isLogged){
    return (
      <Routes>
      <Route path='/login' element={<Login />} />
    </Routes>
    );
  }

  else {

    if(user.userName === null){
      return(
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>
          <Route path='/info' element={<FirstInfoPage />} />
          <Route path='*' element={<FirstInfoPage/>} />
        </Routes>
        </UserContext.Provider>
      )
    }
     else if(user.TwoFactorAuth && user.twoFactorCorrect === false){
      return(
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>
          <Route path='/verify2fa' element={<Verify2fa />} />
          <Route path='*' element={<Verify2fa/>} />
        </Routes>
        </UserContext.Provider>
      )
    }
    else{
    return (
      <UserContext.Provider value={{ user, setUser}}>
        {children}
      </UserContext.Provider>
    );}
  }
}
