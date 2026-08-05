import type { ReactNode } from "react";

interface PageContainerProps {
	children: ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {

	return (
		<main className="container py-4">
			{children}
		</main>
	);
}