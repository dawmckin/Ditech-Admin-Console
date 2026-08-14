import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import type { AuthContextType } from "../types/Auth";

export default function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error("useAuth must be inside and AuthProvider")
    }

    return context;
}