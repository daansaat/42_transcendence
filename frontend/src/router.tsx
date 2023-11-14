import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider, GameProvider, UserContext, ChatProvider } from './contexts';
import { GameMode, gameModes } from './pages/Game/logic/types';
import { Game, Lobby, Home, Chat, Login } from './pages';
import { SocketProvider } from './contexts/SocketContext/provider';
import SettingsPage from './pages/SettingsPage';
import Create2fa from './pages/Create2fa';
import Navbar from './components/Nav/NavBar/navBar';
import SideBar from './components/Nav/SideBar/sideBar';
import NotFound from './pages/NotFound';
import React, { useContext } from 'react';
import './components/Nav/main.css';
import Profile from './pages/Profile';
import { Random } from './pages/Game/components/Online/index';
import { WaitingPage1, WaitingPage2, WaitingPage3 } from './pages/Lobby/components/WaitingPage';


export function Router() {
  const { user } = useContext(UserContext)

  return (
    <React.Fragment>
      <BrowserRouter>
        <UserProvider>
          <section>
            <Routes>
              <Route path='/home' element={<div className='NavContent'><Navbar /></div>} />
              <Route path='/lobby' element={<div className='NavContent'><Navbar /></div>} />
              <Route path='/chat' element={<div className='NavContent'><Navbar /></div>} />
              <Route path='/settings' element={<div className='NavContent'><Navbar /></div>} />
              <Route path='/' element={<div className='NavContent'><Navbar /></div>} />
              <Route path='/profile/:id' element={<div className='NavContent'><Navbar /></div>} />
              <Route path='/create2fa' element={<div className='NavContent'><Navbar /></div>} />
              <Route path='/profile' element={<div className='NavContent'><Navbar /></div>} />
              <Route path='/friendgame' element={<div className='NavContent'><Navbar /></div>} />
              <Route path='/findingopponentClassic' element={<div className='NavContent'><Navbar /></div> } />
              <Route path='/findingopponentCustom' element={<div className='NavContent'><Navbar /></div>} />
              {/* <Route path='/findingopponentCustom2' element={<div className='NavContent'><Navbar /></div>} /> */}
              <Route path='/waitingreply' element={<div className='NavContent'><Navbar /></div>} />
            </Routes>
          </section>
          <section>
            <div className='FullPage'>
              <div className='SideContent'>
                <Routes>
                  <Route path='/home' element={<SideBar />} />
                  <Route path='/lobby' element={<SideBar />} />
                  <Route path='/chat' element={<SideBar />} />
                  <Route path='/' element={<SideBar />} />
                  <Route path='/settings' element={<SideBar />} />
                  <Route path='/profile/:id' element={<SideBar />} />
                  <Route path='/create2fa' element={<SideBar />} />
                  <Route path='/profile' element={<SideBar />} />
                  <Route path='/friendgame' element={<SideBar />} />
                  <Route path='/findingopponentClassic' element={<SideBar />} />
                  <Route path='/findingopponentCustom' element={<SideBar />} />
                  {/* <Route path='/findingopponentCustom2' element={<SideBar />} /> */}
                  <Route path='/waitingreply' element={<SideBar />} />
                </Routes>
              </div>
              <div className='MainContent'>
                <SocketProvider>
                  <Routes>
                    <Route path='/home' element={<Home />} />
                    <Route path='/' element={<Home />} />
                    <Route path='/lobby' element={<Lobby />} />
                    <Route path='/chat' element={<ChatProvider><Chat /></ChatProvider>} />
                    <Route path='/settings' element={<SettingsPage />} />
                    <Route path='/create2fa' element={<Create2fa />} />
                    <Route path='/profile/:id' element={<Profile />} />
                    <Route path='/random' element={<Random />} />
                    <Route path='/friendgame' element={<Random />} />
                    <Route path='/findingopponentClassic' element={<WaitingPage1 />} />
                    <Route path='/findingopponentCustom' element={<WaitingPage3 />} />
                    {/* <Route path='/findingopponentCustom2' element={<WaitingPage4 />} /> */}
                    <Route path='/waitingreply' element={<WaitingPage2 />} />
                    <Route path='/login' element={(user.isLogged) ? (<Home />) : (<Login />)} />

                    {gameModes.map((mode: GameMode) => (
                      <Route
                        key={mode}
                        path={`/${mode}`}
                        element={
                          <GameProvider>
                            <Game gameMode={mode} />
                          </GameProvider>
                        }
                      />
                    ))}
                    <Route path='*' element={<NotFound />} />
                  </Routes>
                </SocketProvider>
              </div>
            </div>
          </section>
        </UserProvider>
      </BrowserRouter>
    </React.Fragment>
  )

}
