import { useEffect, useState } from "react";
import { Toast as BootstrapToast } from "react-bootstrap";
import type { ToastType } from "../../types/toast";
import mapToastIcon from "../../utils/map-toast-icon";

interface ToastProps {
    id: string,
    header: string,
    message: string[],
    type: ToastType,
    onClose: (id: string) => void
}

export default function Toast({id, header, message, type = 'success', onClose}: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const enterTimer = setTimeout(() => {
            setVisible(true);
        }, 10);

        const exitTimer = setTimeout(() => {
            setVisible(false);
        }, 10500);

        const removeTimer = setTimeout(() => {
            onClose(id);
        }, 10550);

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