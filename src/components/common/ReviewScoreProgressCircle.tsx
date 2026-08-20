type ReviewStatusType = 'complies' | 'needs_improving' | 'does_not_comply' | 'incomplete';

interface ReviewStatusConfig {
    icon: string,
    variant: string
}

interface ReviewScoreProgressCircleProps {
    totalScore: number;
    reviewStatus: ReviewStatusType;
    maxScore?: number;
    size?: number;
}

export default function ReviewScoreProgressCircle({totalScore, reviewStatus, maxScore = 75, size = 50}: ReviewScoreProgressCircleProps) {
    const reviewStatusConfig: Record<ReviewStatusType, ReviewStatusConfig> = {
        complies: {
            icon: 'check-circle',
            variant: 'success'
        },
        needs_improving: {
            icon: 'exclamation-circle',
            variant: 'warning'
        },
        does_not_comply: {
            icon: 'x-circle',
            variant: 'danger'
        },
        incomplete: {
            icon: 'hourglass-split',
            variant: 'secondary'
        }
    }

    const progress = Math.min(totalScore / maxScore, 1);

    const radius = 48;
    const circumference = 2 * Math.PI * radius;

    const strokeOffset = circumference * (1 - progress);

    return (
        <>
            <div
                className="position-relative d-flex justify-content-center align-items-center mx-2 mb-2"
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
                        className={`text-${reviewStatusConfig[reviewStatus].variant}`}
                    />
                </svg>
                <div className="text-center" style={{lineHeight: '.75em'}}>
                    {/* <div className="fw-semibold" style={{fontSize: '.8em'}}>{daysRemaining}</div>

                    <small className="text-muted" style={{fontSize: '.8em'}}>{(daysRemaining === 1) ? 'day': 'days'}</small> */}
                    {/* <i className="bi bi-check-circle fs-5 text-danger"></i> */}
                    <i className={`bi bi-${reviewStatusConfig[reviewStatus].icon} text-${reviewStatusConfig[reviewStatus].variant} fs-5`}></i>
                </div>
            </div> 
        </>
    );
}