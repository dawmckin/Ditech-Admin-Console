import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import Toast from "../components/common/Toast";
import type { ToastType } from "../types/toast";
import { ToastContainer } from "react-bootstrap";

import '../components/common/Toast.css';

interface ToastData {
    id: string,
    header: string,
    message: string[],
    type: ToastType
}

interface ToastContextType {
    showToast: (
        header: string,
        message: string[],
        type: ToastType
    ) => void
}

interface ToastContextProps {
    children: ReactNode
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({children}: ToastContextProps) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = useCallback((header: string, message: string[], type: ToastType = "success") => {
        const id = crypto.randomUUID();

        setToasts((prev) => [...prev, { id, header, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{showToast}}>
            {children}

            <ToastContainer
                className="p-3 toast-container"
                position="top-end"
            >
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}   
                        onClose={removeToast}
                    />
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    )
}

export function useToast(): ToastContextType {
    const context = useContext(ToastContext);

    if(!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }

    return context;
}