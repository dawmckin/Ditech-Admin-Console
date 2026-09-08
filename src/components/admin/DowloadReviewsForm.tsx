import { useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useSelectUsers } from "../../hooks/useSelectUsers";
import generateReviewPdf from "../../utils/generate-reviews-pdf";
import type { ReviewCategory } from "../../types/Review";
import type { User } from "../../types/User";
import { useToast } from "../../context/ToastContext";

interface DownloadReviewsProps {
    frontlineEmployees: User[];
    categories: ReviewCategory[];
    onCancel: () => void;
}

export default function DownloadReviews({frontlineEmployees, categories, onCancel}: DownloadReviewsProps) {
    const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>('');

    const [showPreviewButton, setShowPreviewButton] = useState(true);

    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pdfFileName, setPdfFileName] = useState<string>("");
    const [generatingPdf, setGeneratingPdf] = useState(false);

    const [downloading, setDownloading] = useState(false);

    const {reload: getUserData} = useSelectUsers("single");
    const {showToast} = useToast();

    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    const handlePreview = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(selectedEmployee === '') {
            showToast('No Employee Selected', ['Please select an employee'], 'danger');
            return;
        }

        try {
            setGeneratingPdf(true);

            const employeeData = await getUserData(selectedEmployee);
            const employee = employeeData[0];

            if (!employee) {
                showToast("Download Error", ["Unable to find the selected employee."], "danger");
                return;
            }

            if (!employee.reviews?.length) {
                showToast("Download Error", ["Selected employee has not reached any milestones yet"], "danger");
                return;
            } else {
                setShowPreviewButton(false);
            }

            const { reviews, ...user } = employee;

            const { blob, fileName } = generateReviewPdf({
                user,
                reviews: reviews ?? [],
                categoriesData: categories,
            });

            // Clean up previous PDF URL
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }

            const url = URL.createObjectURL(blob);

            setPdfUrl(url);
            setPdfFileName(fileName);

        } catch (err) {
            console.error("Failed to generate review PDF:", err);
        } finally {
            setGeneratingPdf(false);
        }
    };

    const handleDownload = () => {
        setDownloading(true);
        try {
            const link = document.createElement("a");

            link.href = pdfUrl ?? '';
            link.download = pdfFileName;

            link.click();
        } catch (err) {
            console.error('Failed to download reviews', err);
            setDownloading(false);
        }

        setTimeout(() => {setDownloading(false)}, 1000);
    }

    return (
        <>
            <Form 
                noValidate
                onSubmit={(e) => {
                    handlePreview(e);
                }}
            >
                <hr />
                <div className="d-flex justify-content-between mb-2">
                    <h5>Download Performance Reviews</h5>

                    <Button variant="outline-danger" type="button" size="sm" onClick={onCancel}>
                        <i className="bi bi-x-lg"></i>
                    </Button>
                </div>

                <Row className="mt-5 ">

                    <Form.Group as={Col} md={3} className="mb-3" controlId="employee_id">
                        <Form.Select 
                            required
                            // isValid={validated && (employeeForm.user_role !== 'frontline' || employeeForm.supervisor_id !== null)}
                            name="employee_id"
                            value={selectedEmployee ?? ""}
                            onChange={(e) => {
                                setSelectedEmployee(e.target.value);
                                setPdfUrl(null);
                                setPdfFileName('');
                                setShowPreviewButton(true);
                            }}
                        >
                            <option value="" hidden>Select Frontline Employee</option>
                            {
                                frontlineEmployees.filter(emp => emp.user_role === 'frontline').map(user => (
                                    <option value={user.user_id}>{`${user.first_name} ${user.last_name}`}</option>
                                ))
                            }
                        </Form.Select>
                    </Form.Group>
                    <Col md={{span: 2, offset: 7}}>
                        {showPreviewButton &&
                            <div className="d-flex justify-content-end">
                                <Button 
                                    variant={generatingPdf ? 'secondary' : 'primary'} 
                                    type="submit" 
                                >
                                    {generatingPdf ? 'Generating...' : 'Preview Reviews'}
                                </Button>
                            </div>
                        }
                        {pdfUrl &&
                            <div className="d-flex justify-content-end">
                                <Button
                                    variant={downloading ? 'secondary' : 'primary'}
                                    onClick={handleDownload}
                                    disabled={downloading}
                                >
                                    <i className="bi bi-download me-2" />
                                    {downloading ? 'Downloading...' : 'Download'}
                                </Button>                            
                            </div>
                        }
                    </Col>
                </Row>
            </Form>
            
            {pdfUrl && (
                <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">
                            PDF Preview
                        </h6>
                    </div>

                    <iframe
                        src={pdfUrl}
                        title="PDF Preview"
                        width="100%"
                        style={{
                            height: "700px",
                            border: "1px solid #dee2e6",
                            borderRadius: "6px",
                        }}
                    />
                </div>
            )}
        </>

    );
}