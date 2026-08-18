import { useEffect, useState, type ChangeEvent } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

import ReviewCategoryInputCard from "../common/ReviewCategoryInputCard";

import useAuth from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";

import { useSelectUsers } from "../../hooks/useSelectUsers";
import { useSelectReviewCategories } from "../../hooks/useSelectReviewCategories";
import { useInsertReview } from "../../hooks/useInsertReview";

import type { ReviewCategory, Prompt } from "../../types/Review";
import type { ReviewCategoryKeyType } from "../../types/reviewCategoryKey";

import mapReviewCategory from "../../utils/map-review-category";
import groupPromptsByCategory from "../../utils/group-prompts-by-category";
import type { ImpersonationForm } from "../admin/ImpersonationCard";

export interface EmployeeReviewForm {
    employee_id: string,
    supervisor_id: string | null,
    review_date: string,
    milestone: string,
    categories: Record<string, ReviewCategory>;
    total_score: number,
    final_feedback: string,
    review_status: string
}

interface NewReviewProps {
    supervisor?: ImpersonationForm | null;
}

export default function NewReview({supervisor}: NewReviewProps) {
    const {user} = useAuth();

    const [supervisorId, setSupervisorId] = useState(supervisor ? supervisor.user_id : user?.user_id);

    useEffect(() => {
        setSupervisorId(supervisor?.user_id);
    }, [supervisor]);

    const getInitialReviewForm = (): EmployeeReviewForm => ({
        employee_id: '',
        supervisor_id: user?.user_id ?? '',
        review_date: new Date().toISOString().split("T")[0],
        milestone: '',
        categories: {},
        total_score: 0,
        final_feedback: '',
        review_status: 'does_not_comply'
    });

    const [reviewForm, setReviewForm] = useState<EmployeeReviewForm>(getInitialReviewForm);

    const reviewStatusMappings: Record<string, string> = {
        complies: 'Complies',
        needs_improving: 'Needs Improving',
        does_not_comply: 'Does Not Comply'
    }

    const {showToast} = useToast();

    const {usersData} = useSelectUsers('all');
    const {categoriesData} = useSelectReviewCategories();
    const {submitReview} = useInsertReview();
    
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
    }, [categoriesData, reviewForm.employee_id]);

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
                status = 'complies';
            } else if(totalScore >= 57) {
                status = 'needs_improving';
            } else {
                status = 'does_not_comply';
            }

            return {
                ...prev,
                categories: updatedCategories,
                total_score: totalScore,
                review_status: status
            };
        });
    };

    const handleSubmit = async () => {
        const missingScores = Object.values(reviewForm.categories)
            .flatMap((category) => 
                category.prompts.filter((prompt) => prompt.score === 0)
            );
        
        const categoryCounts = missingScores.reduce<Record<string, number>>(
            (counts, prompt) => {
                counts[prompt.category] = (counts[prompt.category] || 0) + 1;

                return counts;
            }, {}
        );

        const formattedCounts = Object.entries(categoryCounts)
            .map(([category, count]) => 
                `${mapReviewCategory(category as ReviewCategoryKeyType)}: ${count}`
            );
        
        if(missingScores.length > 0) {
            showToast('Missing Scores', formattedCounts, 'warning');
            return;
        }
        
        if(reviewForm.final_feedback === '') {
            showToast('Final Feedback Required', ['Please enter your final feedback'], 'warning');
            return;
        }

        try {
            const response = await submitReview(reviewForm);
            showToast('Success', ['Review Submitted'], 'success');
            setReviewForm(getInitialReviewForm);
            console.log('Review Submitted', response);
        } catch(err) {
            showToast('Error', ['Unable to submit review'], 'danger');
            console.log('Failed to submit review', err);
        }
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
                            <small>
                                Select Team Member
                                {
                                    (reviewForm.employee_id === '') &&
                                    <span className="required-input"> *</span>
                                }  
                            </small>
                        </Form.Label>
                        <Form.Select 
                            name="employee_id"
                            value={reviewForm.employee_id}
                            onChange={(e) => handleChange(e)}
                        >
                            <option value='' hidden>Choose a frontline team member</option>
                            {
                                usersData.filter(user => user.user_role === 'frontline' && user.supervisor_id === supervisorId).map(user => (
                                    <option value={user.user_id}>
                                        {`${user.first_name} ${user.last_name}`}
                                    </option>
                                ))
                            }
                        </Form.Select>
                    </Form.Group>                   
                </Col>
                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="fw-semibold">
                            <small>
                                Review Date
                                {
                                    (reviewForm.review_date === '') &&
                                    <span className="required-input"> *</span>
                                }  
                            </small>
                        </Form.Label>
                        <Form.Control 
                            type="date" 
                            name="review_date"
                            value={reviewForm.review_date}
                            onChange={(e) => handleChange(e)} 
                            placeholder="Select a date"
                        />
                    </Form.Group>
                </Col>
                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="fw-semibold">
                            <small>
                                Milestone
                                {
                                    (reviewForm.milestone === '') &&
                                    <span className="required-input"> *</span>
                                }  
                            </small>
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
                    reviewForm.employee_id && 
                    reviewForm.review_date &&
                    reviewForm.milestone
                ) && 
                <div className="d-flex flex-column gap-4 mt-3">
                    {renderReviewCategoryInputCards()}
                    <Card className="border shadow-sm rounded-4 p-2 border-primary">
                        <Card.Body>
                            <h5 className="mb-0">
                                Final Feedback
                                {
                                    (reviewForm.final_feedback === '') &&
                                    <span className="required-input"> *</span>
                                }    
                            </h5>
                            <small className="text-muted">Provide overall thoughts and summary for this review</small>

                            <Form.Group className="mt-2">
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="final_feedback"
                                    placeholder="Enter your final feedback and overall assessment..."
                                    value={reviewForm.final_feedback}
                                    onChange={(e) => handleChange(e)}
                                />

                            </Form.Group>
                            <Row className="mt-4">
                                <Col md={8}>
                                    <p className="total-score mb-0">Total Score: {reviewForm.total_score} / 75</p>
                                    <p className={`review-status mb-0`}>
                                        Status: 
                                        <span className={reviewForm.review_status}> {reviewStatusMappings[reviewForm.review_status]}</span>
                                    </p>
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