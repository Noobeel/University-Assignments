import React from 'react';
import { Box, Center, Heading, Text } from '@chakra-ui/react';
import { useFirebaseApp, AuthProvider } from 'reactfire';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { getAuth } from 'firebase/auth';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { LandingNav } from './components/header/Header';
import { Footer } from './components/footer/Footer';
import { Reports } from './pages/Reports';
import { WorkBoard } from './pages/Boardpage';
import { Dashboard } from './pages/Dashboard';
import { ProjectSettings } from './pages/ProjectSettings';
import { CreateProject } from './pages/CreateProject';
import { Backlog } from './pages/Backlog';

function App() {
    const app = useFirebaseApp();
    const auth = getAuth(app);

    return (
        <AuthProvider sdk={auth}>
            <LandingNav />
            <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/board' element={<WorkBoard />} />
                <Route path='/reports' element={<Reports />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/project-settings' element={<ProjectSettings />} />
                <Route
                    path='/create_project'
                    element={<CreateProject />}
                ></Route>
                <Route path='/backlog' element={<Backlog />} />
            </Routes>
            <Footer />
        </AuthProvider>
    );
}

export default App;
