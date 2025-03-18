import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';
import html2canvas from 'html2canvas';

// Register all Chart.js components (required for Chart.js v3+)
Chart.register(...registerables);

export const exportPettyCashToPDF = async (entries, monthlyBudget, totalExpense, remainingBudget) => {
    console.log("Export function triggered", { entries, monthlyBudget, totalExpense, remainingBudget });

    try {
        // Basic validation to help with debugging
        if (!entries || !Array.isArray(entries) || entries.length === 0) {
            console.error("No entries to export or entries is not an array");
            alert("No data to export");
            return;
        }

        // -------------------- CHART SETUP --------------------
        console.log("Creating chart containers");

        // Create container for line chart (expenses over time)
        // We create this off-screen to render it without affecting the UI
        const lineChartContainer = document.createElement('div');
        lineChartContainer.id = 'line-chart-container';
        lineChartContainer.style.width = '800px'; // Increased from 600px for better resolution
        lineChartContainer.style.height = '400px'; // Increased from 300px for better resolution
        lineChartContainer.style.position = 'absolute';
        lineChartContainer.style.left = '-9999px'; // Off-screen positioning
        lineChartContainer.style.backgroundColor = 'white'; // Ensure white background for better quality

        // Create container for pie chart (expense categories)
        const pieChartContainer = document.createElement('div');
        pieChartContainer.id = 'pie-chart-container';
        pieChartContainer.style.width = '600px'; // Increased from 400px for better resolution
        pieChartContainer.style.height = '400px'; // Increased from 300px for better resolution
        pieChartContainer.style.position = 'absolute';
        pieChartContainer.style.left = '-9999px'; // Off-screen positioning
        pieChartContainer.style.backgroundColor = 'white'; // Ensure white background for better quality

        // Create canvas elements with high DPI settings for sharper rendering
        const lineCanvas = document.createElement('canvas');
        lineCanvas.id = 'line-chart';
        // Set higher pixel ratio for sharper rendering
        lineCanvas.width = 800 * 2; // Doubled for higher resolution
        lineCanvas.height = 400 * 2; // Doubled for higher resolution
        lineCanvas.style.width = '800px';
        lineCanvas.style.height = '400px';
        lineChartContainer.appendChild(lineCanvas);

        const pieCanvas = document.createElement('canvas');
        pieCanvas.id = 'pie-chart';
        // Set higher pixel ratio for sharper rendering
        pieCanvas.width = 600 * 2; // Doubled for higher resolution
        pieCanvas.height = 400 * 2; // Doubled for higher resolution
        pieCanvas.style.width = '600px';
        pieCanvas.style.height = '400px';
        pieChartContainer.appendChild(pieCanvas);

        // Add containers to the DOM to render charts
        document.body.appendChild(lineChartContainer);
        document.body.appendChild(pieChartContainer);

        // -------------------- LINE CHART CREATION --------------------


        // Process data for line chart - extract dates and expense amounts
        // Filter out any budget entries as they're not expenses
        const dates = entries
            .filter(entry => entry.category !== 'Budget')
            .map(entry => new Date(entry.date).toLocaleDateString());

        const amounts = entries
            .filter(entry => entry.category !== 'Budget')
            .map(entry => parseFloat(entry.amount || 0));

        console.log("Line chart data:", { dates, amounts });

        // Create line chart with enhanced settings for better clarity
        const lineCtx = lineCanvas.getContext('2d');
        // Set scale factor for high DPI rendering
        lineCtx.scale(2, 2); // Scaling for higher resolution

        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Expenses Over Time',
                    data: amounts,
                    borderColor: 'rgba(0, 123, 255, 1)',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    borderWidth: 3, // Increased from default for better visibility
                    pointRadius: 5, // Increased for better visibility
                    pointHoverRadius: 7,
                    fill: true,
                    tension: 0.2 // Slightly curved lines for better visualization
                }]
            },
            options: {
                responsive: false, // Disable responsiveness since we're controlling the size
                maintainAspectRatio: false,
                animation: false, // Disable animation for PDF export
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 30, // Increased font size for better readability
                                weight: 'bold'
                            },
                            padding: 20
                        }
                    },
                    tooltip: {
                        enabled: false // Disable tooltips for PDF export
                    },
                    title: {
                        display: true,
                        text: 'Expense Trend Analysis',
                        font: {
                            size: 30,
                            weight: 'bold'
                        },
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount (Rs.)',
                            font: {
                                size: 30,
                                weight: 'bold'
                            },
                            padding: {
                                bottom: 10
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)', // Subtle grid lines
                            lineWidth: 1
                        },
                        ticks: {
                            font: {
                                size: 30 // Larger tick labels
                            },
                            padding: 10
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date',
                            font: {
                                size: 30,
                                weight: 'bold'
                            },
                            padding: {
                                top: 10
                            }
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 30 // Increased font size for dates
                            },
                            padding: 8
                        },
                        grid: {
                            display: false // Remove vertical grid lines for cleaner look
                        }
                    }
                }
            }
        });

        // -------------------- PIE CHART CREATION --------------------


        // Calculate category totals for pie chart
        // Initialize all categories to zero
        const categoryTotals = {
            'Meals&Entertainment': 0,
            'Transport': 0,
            'Utilities': 0,
            'Office': 0,
            'Postage': 0,
            'Maintenance': 0,
            'Miscellaneous': 0
        };

        // Sum up expenses by category
        entries.filter(entry => entry.category !== 'Budget').forEach(entry => {
            if (categoryTotals.hasOwnProperty(entry.category)) {
                categoryTotals[entry.category] += parseFloat(entry.amount || 0);
            }
        });

        // Extract category names and their total values
        const categoryLabels = Object.keys(categoryTotals);
        const categoryValues = Object.values(categoryTotals);

        // Create more readable labels for the pie chart
        const readableLabels = [
            'Meals & Entertainment',
            'Transport',
            'Utilities',
            'Office',
            'Postage',
            'Maintenance',
            'Miscellaneous'
        ];

        console.log("Pie chart data:", { categoryLabels, categoryValues });

        // Create pie chart with enhanced settings for better clarity
        const pieCtx = pieCanvas.getContext('2d');
        // Set scale factor for high DPI rendering
        pieCtx.scale(2, 2); // Scaling for higher resolution

        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: readableLabels,
                datasets: [{
                    data: categoryValues,
                    backgroundColor: [
                        'rgba(255, 87, 51, 0.8)',    // Bright red-orange
                        'rgba(255, 189, 51, 0.8)',   // Amber
                        'rgba(51, 255, 87, 0.8)',    // Bright green
                        'rgba(51, 181, 255, 0.8)',   // Sky blue
                        'rgba(255, 51, 181, 0.8)',   // Pink
                        'rgba(181, 51, 255, 0.8)',   // Purple
                        'rgba(255, 215, 51, 0.8)'    // Gold
                    ],
                    borderColor: [
                        'rgba(255, 87, 51, 1)',
                        'rgba(255, 189, 51, 1)',
                        'rgba(51, 255, 87, 1)',
                        'rgba(51, 181, 255, 1)',
                        'rgba(255, 51, 181, 1)',
                        'rgba(181, 51, 255, 1)',
                        'rgba(255, 215, 51, 1)'
                    ],
                    borderWidth: 2, // Thicker borders for better definition
                    hoverOffset: 15 // Larger slice separation on hover
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                animation: false, // Disable animation for PDF export
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            font: {
                                size: 30, // Larger font for better readability
                                weight: 'bold'
                            },
                            padding: 20,
                            usePointStyle: true, // Use point style for cleaner legend
                            pointStyle: 'circle'
                        },
                        title: {
                            display: true,
                            text: 'Categories',
                            font: {
                                size: 30,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        enabled: false // Disable tooltips for PDF export
                    },
                    title: {
                        display: true,
                        text: 'Expense Distribution by Category',
                        font: {
                            size: 30,
                            weight: 'bold'
                        },
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    },
                    // Add percentage labels to pie slices
                    datalabels: {
                        display: true,
                        formatter: (value, ctx) => {
                            const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = (value * 100 / sum).toFixed(1) + '%';
                            return percentage;
                        },
                        color: '#000',
                        font: {
                            weight: 'bold',
                            size: 30 // Larger font size for better visibility
                        }
                    }
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                }
            }
        });

        // -------------------- PDF GENERATION --------------------
        // Wait for charts to render then create the PDF
        // The timeout ensures charts are fully rendered before capturing
        setTimeout(async () => {
            try {
                console.log("Capturing charts");

                // Capture the chart images with high quality settings
                const lineChartImg = await html2canvas(lineCanvas, {
                    scale: 1, // We're already using a 2x scale in the canvas
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                }).then(canvas => {
                    return canvas.toDataURL('image/png', 1.0); // 1.0 is highest quality
                });

                const pieChartImg = await html2canvas(pieCanvas, {
                    scale: 1, // We're already using a 2x scale in the canvas
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                }).then(canvas => {
                    return canvas.toDataURL('image/png', 1.0); // 1.0 is highest quality
                });

                // -------------------- CREATE PDF DOCUMENT --------------------
                console.log("Creating PDF document");
                // Create landscape A4 PDF
                const doc = new jsPDF('l', 'mm', 'a4');

                // Add header and summary information
                doc.setFontSize(18);
                doc.setTextColor(0, 51, 102); // Dark blue for header
                doc.text('FixMate Petty Cash Management Report', 14, 15);

                doc.setFontSize(11);
                doc.setTextColor(0, 0, 0);
                doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

                // Add color-coded budget summary box
                doc.setFillColor(240, 240, 240); // Light gray background
                doc.rect(14, 26, 270, 14, 'F');
                doc.setFont(undefined, 'bold');
                doc.text('Budget Summary', 16, 33);
                doc.setFont(undefined, 'normal');
                doc.text(`Monthly Budget: Rs. ${monthlyBudget.toFixed(2)}`, 70, 33);
                doc.text(`Total Expenses: Rs. ${totalExpense.toFixed(2)}`, 150, 33);

                // Highlight remaining budget with color based on status
                const budgetStatus = remainingBudget >= 0 ? [0, 128, 0] : [255, 0, 0]; // Green if positive, red if negative
                doc.setTextColor(...budgetStatus);
                doc.text(`Remaining Budget: Rs. ${remainingBudget.toFixed(2)}`, 225, 33);
                doc.setTextColor(0, 0, 0); // Reset text color

                // -------------------- CREATE EXPENSE TABLE --------------------
                console.log("Creating table data");
                // Define table headers
                const tableHeader = [
                    'Date',
                    'Received',
                    'Description',
                    'Total Payment',
                    'M&E',
                    'Transport',
                    'Utilities',
                    'Office',
                    'Postage',
                    'Maintenance',
                    'Miscellaneous'
                ];

                // Format table rows
                const tableRows = [];

                // Add initial budget row to the table
                tableRows.push([
                    new Date().toLocaleDateString(),
                    'Budget Set',
                    'Monthly Budget',
                    `Rs. ${monthlyBudget.toFixed(2)}`,
                    '-',
                    '-',
                    '-',
                    '-',
                    '-',
                    '-',
                    '-'
                ]);

                // Add each expense entry to the table
                // Each category column will only show the amount if it belongs to that category
                entries.filter(entry => entry.category !== 'Budget').forEach(entry => {
                    tableRows.push([
                        new Date(entry.date).toLocaleDateString(),
                        entry.paymentMethod,
                        entry.description,
                        `Rs. ${parseFloat(entry.amount).toFixed(2)}`,
                        entry.category === 'Meals&Entertainment' ? `Rs. ${parseFloat(entry.amount).toFixed(2)}` : '-',
                        entry.category === 'Transport' ? `Rs. ${parseFloat(entry.amount).toFixed(2)}` : '-',
                        entry.category === 'Utilities' ? `Rs. ${parseFloat(entry.amount).toFixed(2)}` : '-',
                        entry.category === 'Office' ? `Rs. ${parseFloat(entry.amount).toFixed(2)}` : '-',
                        entry.category === 'Postage' ? `Rs. ${parseFloat(entry.amount).toFixed(2)}` : '-',
                        entry.category === 'Maintenance' ? `Rs. ${parseFloat(entry.amount).toFixed(2)}` : '-',
                        entry.category === 'Miscellaneous' ? `Rs. ${parseFloat(entry.amount).toFixed(2)}` : '-'
                    ]);
                });

                // -------------------- ADD TABLE TO PDF --------------------
                console.log("Adding table to PDF");
                autoTable(doc, {
                    head: [tableHeader],
                    body: tableRows,
                    startY: 45,
                    theme: 'grid',
                    headStyles: {
                        fillColor: [51, 102, 153], // Professional blue header
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        halign: 'center' // Center align headers
                    },
                    alternateRowStyles: {
                        fillColor: [245, 245, 245] // Light gray for alternate rows
                    },
                    styles: {
                        fontSize: 8,
                        cellPadding: 2,
                        lineColor: [200, 200, 200], // Lighter grid lines
                        lineWidth: 0.1 // Thinner grid lines for cleaner look
                    },
                    // Define specific column widths for better readability
                    columnStyles: {
                        0: { cellWidth: 25 }, // Date column
                        1: { cellWidth: 20 }, // Payment method
                        2: { cellWidth: 40 }, // Description - wider for longer text
                        3: { cellWidth: 20, halign: 'right' }, // Total payment - right aligned
                        4: { cellWidth: 20, halign: 'right' }, // M&E
                        5: { cellWidth: 20, halign: 'right' }, // Transport
                        6: { cellWidth: 20, halign: 'right' }, // Utilities
                        7: { cellWidth: 20, halign: 'right' }, // Office
                        8: { cellWidth: 20, halign: 'right' }, // Postage
                        9: { cellWidth: 25, halign: 'right' }, // Maintenance
                        10: { cellWidth: 25, halign: 'right' } // Miscellaneous
                    },
                    // Format cells with values
                    didParseCell: function (data) {
                        // Make negative values red
                        if (data.cell.text[0] && typeof data.cell.text[0] === 'string' &&
                            data.cell.text[0].includes('Rs.') && data.cell.text[0].includes('-')) {
                            data.cell.styles.textColor = [255, 0, 0]; // Red color for negative values
                        }
                    },
                    // Add table summary footer
                    didDrawPage: function (data) {
                        // Add page numbers
                        const pageCount = doc.internal.getNumberOfPages();
                        for (let i = 1; i <= pageCount; i++) {
                            doc.setPage(i);
                            doc.setFontSize(8);
                            doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30,
                                doc.internal.pageSize.height - 10);
                        }
                    }
                });

                // Get the final Y position after the table to add the total
                const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 200;

                // Add total expenses summary after the table
                doc.setFont(undefined, 'bold');
                doc.setFontSize(12);
                doc.text(`Total Expenses: Rs. ${totalExpense.toFixed(2)}`, 14, finalY);

                // Add budget utilization percentage
                const utilizationPercentage = (totalExpense / monthlyBudget * 100).toFixed(1);
                doc.text(`Budget Utilization: ${utilizationPercentage}%`, 14, finalY + 8);

                // -------------------- ADD CHARTS TO NEW PAGES --------------------
                // Add line chart to a new page
                doc.addPage();
                doc.setFontSize(30);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(0, 51, 102); // Dark blue for headers
                doc.text('Expense Trend Over Time', 14, 20);

                // Add explanatory note for the line chart
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(0, 0, 0);
                doc.text('This chart shows your expense pattern over the selected period.', 14, 28);
                

                // Add the line chart image
                // Position and size are adjusted for better visibility
                doc.addImage(lineChartImg, 'PNG', 14, 43, 270, 140);

                // Add pie chart to a new page
                doc.addPage();
                doc.setFontSize(30);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(0, 51, 102); // Dark blue for headers
                doc.text('Expense Distribution by Category', 14, 20);

                // Add explanatory note for the pie chart
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(0, 0, 0);
                doc.text('This chart shows how your expenses are distributed across different categories.', 14, 28);
           

                // Add the pie chart image
                // Centered on the page for better presentation
                doc.addImage(pieChartImg, 'PNG', 50, 40, 180, 130);

                // -------------------- SUMMARY STATISTICS PAGE --------------------
                // Add an additional page with summary statistics
                doc.addPage();
                doc.setFontSize(16);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(0, 51, 102);
                doc.text('Petty Cash Analysis Summary', 14, 20);

                // Calculate category percentages for summary
                const totalExpenseValue = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
                const categoryPercentages = {};

                for (const [category, amount] of Object.entries(categoryTotals)) {
                    categoryPercentages[category] = ((amount / totalExpenseValue) * 100).toFixed(1);
                }

                // Find highest expense category
                const highestCategory = Object.entries(categoryTotals)
                    .sort((a, b) => b[1] - a[1])[0];

                // Find lowest expense category with spending > 0
                const lowestCategoryWithSpending = Object.entries(categoryTotals)
                    .filter(([_, value]) => value > 0)
                    .sort((a, b) => a[1] - b[1])[0];

                // Create readable category names for display
                const readableCategoryNames = {
                    'Meals&Entertainment': 'Meals & Entertainment',
                    'Transport': 'Transport',
                    'Utilities': 'Utilities',
                    'Office': 'Office',
                    'Postage': 'Postage',
                    'Maintenance': 'Maintenance',
                    'Miscellaneous': 'Miscellaneous'
                };

                // Add summary statistics section
                doc.setFontSize(12);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(0, 0, 0);

                // Summary statistics table
                const summaryData = [
                    ['Budget Summary', ''],
                    ['Monthly Budget', `Rs. ${monthlyBudget.toFixed(2)}`],
                    ['Total Expenses', `Rs. ${totalExpense.toFixed(2)}`],
                    ['Remaining Budget', `Rs. ${remainingBudget.toFixed(2)}`],
                    ['Budget Utilization', `${utilizationPercentage}%`],
                    ['', ''],
                    ['Category Analysis', ''],
                    ['Highest Expense Category', `${readableCategoryNames[highestCategory[0]]} (${categoryPercentages[highestCategory[0]]}%)`],
                    highestCategory ? ['Highest Category Amount', `Rs. ${highestCategory[1].toFixed(2)}`] : ['', ''],
                    lowestCategoryWithSpending ? ['Lowest Expense Category (with spending)',
                        `${readableCategoryNames[lowestCategoryWithSpending[0]]} (${categoryPercentages[lowestCategoryWithSpending[0]]}%)`] : ['', ''],
                    lowestCategoryWithSpending ? ['Lowest Category Amount', `Rs. ${lowestCategoryWithSpending[1].toFixed(2)}`] : ['', '']

                ];

                // Add summary data table
                autoTable(doc, {
                    body: summaryData,
                    startY: 30,
                    theme: 'plain',
                    styles: {
                        fontSize: 10,
                        cellPadding: 4
                    },
                    columnStyles: {
                        0: { fontStyle: 'bold', cellWidth: 120 },
                        1: { cellWidth: 150 }
                    },
                    alternateRowStyles: {
                        fillColor: [245, 245, 245]
                    },
                    // Style header rows in the summary
                    didParseCell: function (data) {
                        if (data.row.cells[0] &&
                            (data.row.cells[0].text[0] === 'Budget Summary' ||
                                data.row.cells[0].text[0] === 'Category Analysis')) {
                            data.cell.styles.fontStyle = 'bold';
                            data.cell.styles.fillColor = [220, 230, 240];
                        }
                    }
                });
                // Add simple signature line
                const pageWidth = doc.internal.pageSize.getWidth();
                const signatureY = doc.lastAutoTable.finalY + 30;
                doc.setDrawColor(0);
                doc.line(pageWidth - 70, signatureY, pageWidth - 20, signatureY);
                doc.setFontSize(8);
                doc.text('Authorized Signature', pageWidth - 70, signatureY + 5);


                // -------------------- SAVE PDF FILE --------------------
                // Format date for filename
                const today = new Date();
                const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

                // Save the complete PDF with date in filename
                console.log("Saving PDF report");
                doc.save(`petty-cash-report-${dateStr}.pdf`);

                console.log("PDF export completed successfully");
            } catch (error) {
                console.error("Error processing charts:", error);
                alert("Error creating PDF report. Check console for details.");
            } finally {
                // Clean up DOM elements to prevent memory leaks
                console.log("Cleaning up DOM elements");
                if (document.body.contains(lineChartContainer)) {
                    document.body.removeChild(lineChartContainer);
                }
                if (document.body.contains(pieChartContainer)) {
                    document.body.removeChild(pieChartContainer);
                }
            }
        }, 1500); // Increased from 1000ms to 1500ms to ensure charts are fully rendered

    } catch (error) {
        console.error("Error in PDF export:", error);
        alert("Error exporting to PDF. Check console for details.");
    }

};
