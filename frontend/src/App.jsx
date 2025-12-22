
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './Home';
import Login from './pages/admin/Login';
import Signup from './pages/admin/Signup';
import ForgotPassword from './pages/admin/ForgotPassword';
import Dashboard from './pages/admin/Dashboard';
import Profile from './pages/admin/Profile';
import ToolForm from './pages/admin/ToolForm';
import LearningHub from './pages/learning/LearningHub';
import ModuleDetail from './pages/learning/ModuleDetail';
import Quiz from './pages/learning/Quiz';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/admin/login" element={<Login />} />
                    <Route path="/admin/signup" element={<Signup />} />
                    <Route path="/admin/forgot-password" element={<ForgotPassword />} /> {/* Added Signup Route */}

                    {/* Protected Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['owner', 'admin']}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/profile"
                        element={
                            <ProtectedRoute allowedRoles={['owner', 'admin']}>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/tool/new"
                        element={
                            <ProtectedRoute>
                                <ToolForm isEditing={false} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/tool/:id"
                        element={
                            <ProtectedRoute>
                                <ToolForm isEditing={true} />
                            </ProtectedRoute>
                        }
                    />

                    {/* Learning Platform Routes */}
                    <Route path="/learning" element={<LearningHub />} />
                    <Route
                        path="/learning/module/:moduleId"
                        element={
                            <ProtectedRoute>
                                <ModuleDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/learning/quiz/:moduleId"
                        element={
                            <ProtectedRoute>
                                <Quiz />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
