import { Form } from "react-bootstrap";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({value, onChange, placeholder}: SearchBarProps) {
        return (
        <div className="position-relative">
            <i
                className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
            />

            <Form.Control
                type="search"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="ps-5"
            />
        </div>
    );
}