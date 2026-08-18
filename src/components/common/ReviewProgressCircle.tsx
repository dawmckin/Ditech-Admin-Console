import Badge from "./Badge";

interface ReviewProgressCircleProps {
    lastReviewDate: string;
    reviewIntervalDays: number;
    size?: number;
}

export default function ReviewProgressCircle({lastReviewDate, reviewIntervalDays, size = 50}: ReviewProgressCircleProps) {
    const today = new Date();
    const lastReview = new Date(lastReviewDate);

    const elapsedMs = today.getTime() - lastReview.getTime();

    const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));

    const daysRemaining = Math.max(reviewIntervalDays - elapsedDays, 0);

    const daysOverdue = elapsedDays - reviewIntervalDays;

    const progress = Math.min(elapsedDays / reviewIntervalDays, 1);

    const radius = 48;
    const circumference = 2 * Math.PI * radius;

    const strokeOffset = circumference * (1 - progress);

    return (
        <>
            {
                (elapsedDays > 15) ? 
                    <>
                        <div className="mx-3">
                            <Badge type="overdue" text={`${daysOverdue} Days Overdue`} />
                        </div>                        
                    </> : 
                    <>
                        <div
                            className="position-relative d-flex justify-content-center align-items-center"
                            style={{width: size, height: size}}
                        >
                            <svg
                                width={size}
                                height={size}
                                viewBox="0 0 120 120"
                                className="position-absolute"
                            >
                                {/* Background */}
                                <circle
                                    cx="60"
                                    cy="60"
                                    r={radius}
                                    fill="none"
                                    stroke="#e9ecef"
                                    strokeWidth="10"
                                />

                                {/* Progress */}
                                <circle
                                    cx="60"
                                    cy="60"
                                    r={radius}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeOffset}
                                    transform="rotate(-90 60 60)"
                                    className="text-primary"
                                />
                            </svg>
                            {
                                (daysRemaining <= 15) && (
                                    <div className="text-center" style={{lineHeight: '.75em'}}>
                                        <div className="fw-semibold" style={{fontSize: '.8em'}}>{daysRemaining}</div>

                                        <small className="text-muted" style={{fontSize: '.8em'}}>days</small>
                                    </div>
                                )
                            }
                        </div>                    
                    </>
            }
        </>

    );
}