import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { User } from "../types/User";
import type { Review, ReviewCategory } from "../types/Review";
import capitalizeString from "./capilatize-string";
import getMilestoneDate from "./get-milestone-date";
import daysSinceDate from "./days-since-date";

interface GenerateReviewPdfProps {
    user: Omit<User, 'reviews'>;
    reviews: Review[];
    categoriesData: ReviewCategory[];
}

export default function generateReviewPdf({user, reviews, categoriesData}: GenerateReviewPdfProps) {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const bottomMargin = 20;

    let currentY = 20;

    const checkPageBreak = (requiredHeight: number = 10) => {
        if (currentY + requiredHeight > pageHeight - bottomMargin) {
            doc.addPage();
            currentY = 20;
        }
    };

    const formatDate = (date: string | null | undefined) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-US");
    };

    const drawJustifiedLine = (leftText: string, rightText: string, spacing = 7) => {
        checkPageBreak(spacing);

        doc.text(leftText, margin, currentY);

        doc.text(rightText, pageWidth - margin, currentY, { align: "right" });

        currentY += spacing;
    };

    const drawParagraph = (text: string, fontSize = 10, lineHeight = 5) => {
        doc.setFontSize(fontSize);

        const lines = doc.splitTextToSize(text, pageWidth - margin * 2);

        checkPageBreak(lines.length * lineHeight);

        doc.text(lines, margin, currentY);

        currentY += lines.length * lineHeight;
    };

    const employeeName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

    // Title

    doc.setFontSize(20);
    doc.text("Ditech, Inc. Performance Review Report", margin, currentY);
    currentY += 8;

    doc.setFontSize(11);
    doc.text(`Generated On: ${formatDate(new Date().toISOString())}`, 14, currentY);
    currentY += 14;

    // Employee Information

    doc.setFontSize(14);
    doc.text("Employee Information", margin, currentY);
    currentY += 5;

    let infoBody = [
        ["Name", employeeName],
        ["Email", user.email ?? "N/A"],
        ["Phone", user.phone ?? "N/A"],      
        ["Role", capitalizeString(user.user_role) ?? "N/A"],
        ["Start Date", formatDate(user.start_date)],
        ["Employment Duration", `${daysSinceDate(user.start_date)} days`]
    ]

    if(user.end_date) infoBody.splice(5, 0, ["End Date", formatDate(user.end_date)])

    autoTable(doc, {
        startY: currentY,
            theme: "grid",
        styles: {
            fontSize: 10,
        },
        body: infoBody,
        columnStyles: {
            0: {
                fontStyle: "bold",
                cellWidth: 40,
            },
        },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    // Reviews

    reviews.forEach((review, reviewIndex) => {
        const reviewMilestones = ["15", "30", "45", "60"];

        doc.addPage();
        currentY = 20;

        // Review Header

        doc.setFontSize(16);

        drawJustifiedLine(
            `${reviewMilestones[reviewIndex]} Day Review`,
            `Score: ${review.total_score} / 75`,
            9
        );

        doc.setFontSize(10);

        drawJustifiedLine(
            `Milestone Achieved On: ${getMilestoneDate(
                reviewMilestones[reviewIndex],
                user.start_date
            )}`,
            `Reviewer: ${review.supervisor_data.first_name} ${review.supervisor_data.last_name}`,
            7
        );

        currentY += 3;

        // Overall Feedback

        drawParagraph(`Overall Feedback: ${review.final_feedback ?? "N/A"}`, 10, 5);

        currentY += 8;

        // Group prompts by category

        const categories = new Map<string, typeof review.prompts>();

        review.prompts?.forEach((prompt) => {
            const category = categoriesData.find(
                (cat) => cat.category === prompt.category
            );

            const categoryName =
                category?.category_title ?? "Other";

            if (!categories.has(categoryName)) {
                categories.set(categoryName, []);
            }

            categories.get(categoryName)!.push(prompt);
        });

        // Category tables

        categories.forEach((prompts, categoryName) => {

            // Give the category header and at least a little
            // room for the table header.
            checkPageBreak(35);

            doc.setFontSize(13);

            const categoryData = categoriesData.find(
                (cat) => cat.category_title === categoryName
            );

            const promptsData = categoryData?.prompts ?? [];

            const categoryScore = prompts?.reduce(
                (total, prompt) => total + (prompt.score ?? 0),
                0
            );

            const categoryMaxScore = prompts ? prompts.length * 3 : 0;

            drawJustifiedLine(
                categoryName,
                `${categoryScore} / ${categoryMaxScore}`,
                2
            );

            currentY += 2;

            autoTable(doc, {
                startY: currentY,
                theme: "striped",

                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                    valign: "middle",
                },

                head: [
                    ["Prompt", "Score", "Feedback"]
                ],

                body: prompts?.map((prompt) => [
                    promptsData.find((p) => p.id === prompt.prompt_id)?.prompt_text ?? "N/A",

                    prompt.score?.toString() ?? "N/A",

                    prompt.feedback ?? 
                        prompt.feedback !== '' ? 
                            prompt.feedback :
                            "N/A",
                ]),

                columnStyles: {
                    0: {
                        cellWidth: 65,
                    },
                    1: {
                        cellWidth: 22,
                        halign: "center",
                    },
                    2: {
                        cellWidth: 95,
                    },
                },

                margin: {
                    left: margin,
                    right: margin,
                    bottom: bottomMargin,
                },
                showHead: 'firstPage'
            });

            currentY =
                (doc as any).lastAutoTable.finalY + 8;
        });
    });

    // Page Footer

    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        doc.setFontSize(8);

        doc.text(`Ditech Performance Review Report`, margin, pageHeight - 10);

        doc.text(`${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: "right" });
    }


    // Download

    const safeName = employeeName.replace(/[^a-z0-9]/gi, "_");

    const pdfBlob = doc.output("blob");

    return {
        blob: pdfBlob,
        fileName: `${safeName}_Performance_Reviews.pdf`,
    };
}