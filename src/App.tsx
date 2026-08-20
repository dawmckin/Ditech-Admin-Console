import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./components/auth/Login";
import ResetPassword from "./components/auth/ResetPassword";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import AdminView from "./pages/AdminView";
import SupervisorView from "./pages/SupervisorView";
import FrontlineEmployeeView from "./pages/FrontlineEmployeeView";

// import Unauthorized from "./components/auth/Unauthorized";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                />

				<Route
					path="/reset-password"
					element={<ResetPassword />}
				/>

                <Route
                    path="/admin"
                    element={
						<ProtectedRoute allowedRoles={['admin']}>
							<AdminView />
						</ProtectedRoute>
					}
                />

                <Route
                    path="/supervisor"
                    element={
						<ProtectedRoute allowedRoles={['supervisor']}>
							<SupervisorView />
						</ProtectedRoute>
					}
                />                
				
				<Route
                    path="/frontline"
                    element={
						<ProtectedRoute allowedRoles={['frontline']}>
							<FrontlineEmployeeView />
						</ProtectedRoute>
					}
                />

                {/* <Route
                    path="/unauthorized"
                    element={<Unauthorized />}
                /> */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}