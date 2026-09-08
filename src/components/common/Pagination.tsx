import { Pagination as BootstrapPagination } from "react-bootstrap";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({currentPage, totalPages, onPageChange}: PaginationProps) {
    if(totalPages <= 1) {
        return null;
    }

    const pages = Array.from(
        {length: totalPages},
        (_, index) => index + 1
    );

    return (
        <div className="d-flex justify-content-end">
            <BootstrapPagination className="mb-0">
                <BootstrapPagination.First
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                />

                <BootstrapPagination.Prev
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />

                {pages.map(page => (
                    <BootstrapPagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </BootstrapPagination.Item>
                ))}

                <BootstrapPagination.Next
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />

                <BootstrapPagination.Last
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                />
            </BootstrapPagination>
        </div>
    );
}