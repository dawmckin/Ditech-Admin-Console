import { useEffect, useState, type ChangeEvent } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

import ReviewCategoryInputCard from "../common/ReviewCategoryInputCard";
import { useReviewCategories } from "../../hooks/useReviewCategories";
import { groupPromptsByCategory } from "../../services/reviewPromptService";
import type { ReviewCategory, Prompt } from "../../types/reviewPrompt";

export interface EmployeeReviewForm {
    teamMember: string,
    reviewDate: string,
    milestone: string,
    categories: Record<string, ReviewCategory>;
    totalScore: number,
    finalFeedback: string,
    status: string
}

export default function NewReview() {
    const [reviewForm, setReviewForm] = useState<EmployeeReviewForm>({
        teamMember: '',
        // reviewDate: new Date().toISOString().split("T")[0],
        reviewDate: '',
        milestone: '',
        categories: {},
        totalScore: 0,
        finalFeedback: '',
        status: ''
    });

    const {categoriesData} = useReviewCategories();
    
    useEffect(() => {
        const groupedCategories = groupPromptsByCategory(categoriesData);

        const initializedCategories = Object.fromEntries(
            Object.entries(groupedCategories).map(([key, category]) => [
                key,
                {
                    ...category,
                    prompts: category.prompts.map((prompt) => ({
                        ...prompt,
                        score: 0,
                        feedback: ''
                    }))
                }
            ])
        );

        setReviewForm(prev => ({
            ...prev,
            categories: initializedCategories
        }));
    }, [categoriesData]);

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;

        setReviewForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCardChange = (cardChange: Prompt[]) => {
        const category = cardChange[0].category;

        setReviewForm((prev) => {
            const updatedCategories = {
                ...prev.categories,
                [category]: {
                    ...prev.categories[category],
                    prompts: cardChange,
                },
            };

            const totalScore = Object.values(updatedCategories)
                .flatMap((category) => category.prompts)
                .reduce((sum, prompt) => sum + prompt.score, 0);

            let status = '';
            if(totalScore >= 67) {
                status = 'Complies';
            } else if(totalScore >= 57) {
                status = 'Needs Improving';
            } else {
                status = 'Does Not Comply';
            }

            return {
                ...prev,
                categories: updatedCategories,
                totalScore,
                status
            };
        });
    };

    const handleSubmit = () => {
        console.log(reviewForm);
    }
    
    const renderReviewCategoryInputCards = () => {
        return Object.entries(reviewForm.categories ?? {}).map(cat => 
            <ReviewCategoryInputCard 
                category={cat[0]} 
                categoryTitle={cat[1].category_title} 
                prompts={cat[1].prompts} 
                onCardChange={(reviewPrompt) => handleCardChange(reviewPrompt)}
            />
        )
    }

    return (
        <div className="p-4">
            <h4>Team Member 9 Box Review</h4>
            <small className="text-muted">This assessment evaluates team member performance across 9 key areas.</small>
            
            <hr />
            
            <small className="text-muted fw-semibold">
                Each question is scored from 1-3:
            </small>
            <small className="text-muted">
                <ul>
                    <li><span className="fw-semibold">1</span> - Does Not Comply</li>    
                    <li><span className="fw-semibold">2</span> - Needs Improving</li>    
                    <li><span className="fw-semibold">3</span> - Complies</li>    
                </ul>            
            </small>    

            <small className="text-muted fw-semibold">
                Scoring Guide (Total possible: 75 points):
            </small>
            <small className="text-muted">
                <ul>
                    <li><span className="fw-semibold">Complies:</span> 67-75 points</li>    
                    <li><span className="fw-semibold">Needs Improving:</span> 57-66 points</li>    
                    <li><span className="fw-semibold">Does Not Comply:</span> Less than 56 points</li>    
                </ul>            
            </small> 

            <hr />

            <Row className="g-3">
                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="fw-semibold">
                            <small>Select Team Member</small>
                        </Form.Label>
                        <Form.Select 
                            name="teamMember"
                            value={reviewForm.teamMember}
                            onChange={(e) => handleChange(e)}
                        >
                            <option value='' hidden>Choose a frontline team member</option>
                            <option value='Dalton McKinney'>Dalton McKinney</option>
                            <option value='Jhonny Test'>Jhonney Test</option>
                        </Form.Select>
                    </Form.Group>                   
                </Col>
                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="fw-semibold">
                            <small>Review Date</small>
                        </Form.Label>
                        <Form.Control 
                            type="date" 
                            name="reviewDate"
                            value={reviewForm.reviewDate}
                            onChange={(e) => handleChange(e)} 
                            placeholder="Select a date"
                        />
                    </Form.Group>
                </Col>
                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="fw-semibold">
                            <small>Milestone</small>
                        </Form.Label>
                        <Form.Select 
                            name="milestone"
                            value={reviewForm.milestone}
                            onChange={(e) => handleChange(e)}
                        >
                            <option value='' hidden>Choose a milestone</option>
                            <option value='15'>15 Day</option>
                            <option value='30'>30 Day</option>
                            <option value='45'>45 Day</option>
                            <option value='60'>60 Day</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            {
                (
                    reviewForm.teamMember && 
                    reviewForm.reviewDate &&
                    reviewForm.milestone
                ) && 
                <div className="d-flex flex-column gap-4 mt-3">
                    {renderReviewCategoryInputCards()}
                    <Card className="border shadow-sm rounded-4 p-2 border-primary">
                        <Card.Body>
                            <h5 className="mb-0">Final Feedback</h5>
                            <small className="text-muted">Provide overall thoughts and summary for this review</small>

                            <Form.Group className="mt-2">
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="finalFeedback"
                                    placeholder="Enter your final feedback and overall assessment..."
                                    value={reviewForm.finalFeedback}
                                    onChange={(e) => handleChange(e)}
                                />

                            </Form.Group>
                            <Row className="mt-4">
                                <Col md={8}>
                                    <p className="total-score mb-0">Total Score: {reviewForm.totalScore} / 75</p>
                                    <p className="review-status mb-0">Status: {reviewForm.status}</p>
                                </Col>
                                <Col md={4} className="d-flex justify-content-end">
                                    <Button variant="primary" className="fw-semibold" onClick={handleSubmit}>Submit Review</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </div>
            }
        </div>
    )
}