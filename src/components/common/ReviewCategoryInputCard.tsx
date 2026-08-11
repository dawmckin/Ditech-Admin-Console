import { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";

import type { Prompt } from "../../types/ReviewPrompt";

import './ReviewCategoryInputCard.css';

interface ReviewCategoryInputCardProps {
    category: string,
    categoryTitle: string,
    prompts: Prompt[],
    onCardChange: (reviewPrompt: Prompt[]) => void
}

export default function ReviewCategoryInputCard({category, categoryTitle, prompts, onCardChange}: ReviewCategoryInputCardProps) {
    const [reviewPrompts, setReviewPrompts] = useState<Prompt[]>(prompts);

    const categoryNotes = reviewPrompts.filter(prompt => prompt.prompt_note).map(prompt => prompt.prompt_note);

    const handleUpdatePrompt = (
        id: string,
        field: keyof Prompt,
        value: string | number
    ) => {
        setReviewPrompts((prev) =>
            prev.map((prompt) =>
                prompt.id === Number.parseInt(id)
                    ? {
                        ...prompt,
                        [field]: value,
                        'category': category
                    }
                    : prompt
            )
        );
    }

    useEffect(() => {
        onCardChange(reviewPrompts);
    }, [reviewPrompts]);

    return (
        <Card className="border-0 shadow-sm rounded-4 p-2">
            <Card.Body>
                <h5 className="mb-4">{categoryTitle}</h5>

                {reviewPrompts?.map((prompt) => (
                    <div key={prompt.id} className="mb-2">
                        <small>
                            <Form.Label className="fw-semibold">
                                {`${prompt.prompt_text}${categoryNotes.includes(prompt.prompt_note) ? '*'.repeat(categoryNotes.indexOf(prompt.prompt_note) + 1) : ''}`}
                            </Form.Label>
                        </small>
                      

                        <div className="d-flex align-items-center mb-1">

                            {[1, 2, 3].map((score) => (
                                <div
                                    className="review-score"
                                    key={score}
                                >
                                    <Form.Check
                                        key={score}
                                        inline
                                        type="radio"
                                        id={`${prompt.id}-${score}`}
                                        name={String(prompt.id)}
                                        label={score}
                                        checked={
                                            prompt.score === score
                                        }
                                        onChange={() =>
                                            handleUpdatePrompt(
                                                String(prompt.id),
                                                "score",
                                                score
                                            )
                                        }
                                    />
                                </div>

                            ))}

                        </div>

                        <Form.Group>
                            <small>
                                <Form.Label className="text-muted fw-semibold">
                                    Feedback (optional)
                                </Form.Label>
                            </small>
                            
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Provide qualitative feedback for this rating..."
                                value={prompt.feedback}
                                onChange={(e) =>
                                    handleUpdatePrompt(
                                        String(prompt.id),
                                        "feedback",
                                        e.target.value
                                    )
                                }
                            />

                        </Form.Group>

                    </div>
                ))}
                {
                    (categoryNotes.length > 0) && 
                    <div>
                        <hr/>
                        <div className="d-flex flex-column">
                            {categoryNotes.map((note, index) => (
                                <small className="text-muted">{`${'*'.repeat(index + 1)}${note}`}</small>
                            ))}
                        </div>
                    </div>
                }
            </Card.Body>
        </Card>
    );
}