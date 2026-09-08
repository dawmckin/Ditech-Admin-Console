import { useState } from "react";
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
    onSubmit: () => void;
}

export default function DownloadReviews({frontlineEmployees, categories, onCancel, onSubmit}: DownloadReviewsProps) {
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');

    const {usersData: reviewsData} = useSelectUsers("single", selectedEmployee);
    const {showToast} = useToast();

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(selectedEmployee === '') {
            showToast('No Employee Selected', ['Please select an employee'], 'danger');
            return;
        }

        if(reviewsData[0]?.reviews?.length === 0) {
            showToast('Download Error', ['Selected employee has not reached any milestones yet'], 'danger');
            return;
        }

        try {
            const {reviews, ...user} = reviewsData[0];

            if(reviewsData[0]) generateReviewPdf({user, reviews, categoriesData: categories});
        
        } catch(err) {
            console.error("Failed to generate review PDF:", err);
        }

        onSubmit();
    }


    return (
        <Form 
            noValidate
            onSubmit={handleSubmit}
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
                        onChange={(e) => setSelectedEmployee(e.target.value)}
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
                    <div className="d-flex justify-content-end">
                        <Button variant="primary" type="submit" >
                            {/* {loading ? "Updating..." : "Update Employee"} */}
                            Download Reviews
                        </Button>
                    </div>
                </Col>
            </Row>
        </Form>
    );
}