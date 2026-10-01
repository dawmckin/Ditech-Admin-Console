import { useEffect, useState } from "react";
import { Toast as BootstrapToast } from "react-bootstrap";
import type { ToastType } from "../../types/toast";
import mapToastIcon from "../../utils/map-toast-icon";

interface ToastProps {
    id: string,
    header: string,
    message: string[],
    type: ToastType,
    duration?: number,
    onClose: (id: string) => void
}

export default function Toast({id, header, message, type = 'success', duration = 5000, onClose}: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const enterTimer = setTimeout(() => {
            setVisible(true);
        }, 10);

        const exitTimer = setTimeout(() => {
            setVisible(false);
        }, duration + 500);

        const removeTimer = setTimeout(() => {
            onClose(id);
        }, duration + 550);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(exitTimer);
            clearTimeout(removeTimer);
        }
    }, [onClose]);

    return (
        <div className={`toast-wrapper ${visible ? 'toast-enter': 'toast-exit'}`}>
            <BootstrapToast show={true} onClose={() => onClose(id)} bg={type}>
                <BootstrapToast.Header>
                    {mapToastIcon(type)}
                    <div className="px-1"></div>
                    <strong className="me-auto">{header}</strong>
                    {/* <small>11 mins ago</small> */}
                </BootstrapToast.Header>
                <BootstrapToast.Body className={`${type !== 'light' && 'text-white'}`}>
                    {
                        (message.length > 1) ? (
                            <ul className="mb-0">
                                {message.map(m => (
                                    <li>{m}</li>
                                ))}
                            </ul>
                        ) : (
                            message
                        )
                    }
                </BootstrapToast.Body>
            </BootstrapToast>
        </div>

    );
}