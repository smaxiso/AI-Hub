
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
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
import MagicPromptTool from './pages/tools/MagicPromptTool';

// Public Auth Pages
import PublicLogin from './pages/auth/Login';
import PublicSignup from './pages/auth/Signup';
import PublicProfile from './pages/auth/Profile';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />

                        {/* Public Auth Routes */}
                        <Route path="/login" element={<PublicLogin />} />
                        <Route path="/signup" element={<PublicSignup />} />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute requireAuth={true}>
                                    <PublicProfile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Auth Routes */}
                        <Route path="/admin/login" element={<Login />} />
                        <Route path="/admin/signup" element={<Signup />} />
                        <Route path="/admin/forgot-password" element={<ForgotPassword />} />

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
                                <ProtectedRoute allowedRoles={['owner', 'admin']}>
                                    <ToolForm isEditing={false} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/tool/:id"
                            element={
                                <ProtectedRoute allowedRoles={['owner', 'admin']}>
                                    <ToolForm isEditing={true} />
                                </ProtectedRoute>
                            }
                        />

                        {/* Tools Routes */}
                        <Route path="/tools/magic-prompt" element={<MagicPromptTool />} />

                        {/* Learning Platform Routes */}
                        <Route path="/learning" element={<LearningHub />} />
                        <Route
                            path="/learning/module/:moduleId"
                            element={
                                <ProtectedRoute requireAuth={true}>
                                    <ModuleDetail />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/learning/quiz/:moduleId"
                            element={
                                <ProtectedRoute requireAuth={true}>
                                    <Quiz />
                                </ProtectedRoute>
                            }
                        />
                        {/* Catch all - redirect to home */}
                        <Route path="*" element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
