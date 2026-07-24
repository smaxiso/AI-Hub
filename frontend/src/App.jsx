
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Box, CircularProgress } from '@mui/material';

// Eagerly loaded (home page — first paint)
import Home from './Home';
import BottomNav from './components/BottomNav';

// Lazy loaded — only fetched when route is visited
const Login = lazy(() => import('./pages/admin/Login'));
const Signup = lazy(() => import('./pages/admin/Signup'));
const ForgotPassword = lazy(() => import('./pages/admin/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Profile = lazy(() => import('./pages/admin/Profile'));
const ToolForm = lazy(() => import('./pages/admin/ToolForm'));
const LearningHub = lazy(() => import('./pages/learning/LearningHub'));
const ModuleDetail = lazy(() => import('./pages/learning/ModuleDetail'));
const Quiz = lazy(() => import('./pages/learning/Quiz'));
const Certifications = lazy(() => import('./pages/learning/Certifications'));
const CertificateVerify = lazy(() => import('./pages/learning/CertificateVerify'));
const MagicPromptTool = lazy(() => import('./pages/tools/MagicPromptTool'));
const PublicLogin = lazy(() => import('./pages/auth/Login'));
const PublicSignup = lazy(() => import('./pages/auth/Signup'));
const PublicProfile = lazy(() => import('./pages/auth/Profile'));
const PublicForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

// Minimal loading fallback
const PageLoader = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={32} />
    </Box>
);

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Home />} />

                        {/* Public Auth Routes */}
                        <Route path="/login" element={<PublicLogin />} />
                        <Route path="/signup" element={<PublicSignup />} />
                        <Route path="/forgot-password" element={<PublicForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
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
                        <Route path="/learning/certifications" element={<Certifications />} />
                        <Route path="/certificate/verify/:certNumber" element={<CertificateVerify />} />
                        {/* Catch all - redirect to home */}
                        <Route path="*" element={<Home />} />
                    </Routes>
                    </Suspense>
                    <BottomNav />
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
