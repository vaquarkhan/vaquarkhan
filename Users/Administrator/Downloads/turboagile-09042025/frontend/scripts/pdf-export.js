// PDF Export functionality for research report
function exportResearchToPDF() {
    console.log('📄 Starting PDF export...');
    
    // Show progress
    const btn = document.getElementById('export-pdf-button');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '📄 Generating PDF...';
        btn.disabled = true;
        
        setTimeout(() => {
            try {
                generatePDF();
                btn.innerHTML = originalText;
                btn.disabled = false;
            } catch (error) {
                console.error('PDF generation failed:', error);
                alert('PDF generation failed. Please try again.');
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        }, 1000);
    }
}

function generatePDF() {
    // Check if jsPDF is available
    if (typeof window.jspdf === 'undefined') {
        alert('PDF library not loaded. Please refresh the page and try again.');
        return;
    }
    
    const doc = new window.jspdf.jsPDF();
    
    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 6;
    const sectionSpacing = 15;
    
    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('AI Research Report', margin, yPosition);
    yPosition += 15;
    
    // Date
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 15;
    
    // Get all sections
    const sections = [
        { id: 'executive-summary', title: 'Executive Summary' },
        { id: 'project-objectives', title: 'Project Objectives' },
        { id: 'stakeholders', title: 'Stakeholders' },
        { id: 'business-requirements', title: 'Business Requirements' },
        { id: 'functional-requirements', title: 'Functional Requirements' },
        { id: 'assumptions-constraints', title: 'Assumptions & Constraints' },
        { id: 'risks-mitigation', title: 'Risks & Mitigation' },
        { id: 'competitor-analysis', title: 'Competitor Analysis' },
        { id: 'feature-comparison', title: 'Feature Comparison' },
        { id: 'ai-features', title: 'AI Game-Changing Features' },
        { id: 'detailed-specifications', title: 'Technical Specifications' },
        { id: 'software-requirements', title: 'Software Requirements' },
        { id: 'user-stories-detailed', title: 'User Stories' },
        { id: 'cost-benefit-analysis', title: 'Cost-Benefit Analysis' },
        { id: 'schedule-deliverables', title: 'Schedule & Deliverables' }
    ];
    
    sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
            // Check if we need a new page
            if (yPosition > pageHeight - 40) {
                doc.addPage();
                yPosition = 20;
            }
            
            // Section title
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(section.title, margin, yPosition);
            yPosition += 10;
            
            // Section content
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            
            const content = element.textContent || element.innerText || 'No content available';
            
            // Clean and format content with proper line breaks
            let cleanContent = content
                .replace(/\s+/g, ' ')
                .replace(/\. /g, '.\n\n') // New paragraph after sentences
                .replace(/: /g, ':\n') // New line after colons
                .replace(/• /g, '\n• ') // Bullet points on new lines
                .replace(/- /g, '\n- ') // Dash points on new lines
                .trim();
            
            // Split into paragraphs
            const paragraphs = cleanContent.split('\n\n');
            
            paragraphs.forEach(paragraph => {
                if (paragraph.trim()) {
                    // Check if we need a new page
                    if (yPosition > pageHeight - 30) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    
                    // Split paragraph into lines that fit the page width
                    const maxWidth = doc.internal.pageSize.width - (margin * 2);
                    const lines = doc.splitTextToSize(paragraph.trim(), maxWidth);
                    
                    lines.forEach(line => {
                        if (yPosition > pageHeight - 20) {
                            doc.addPage();
                            yPosition = 20;
                        }
                        doc.text(line, margin, yPosition);
                        yPosition += lineHeight;
                    });
                    
                    yPosition += 4; // Space between paragraphs
                }
            });
            
            yPosition += sectionSpacing; // Extra space between sections
        }
    });
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `AI_Research_Report_${timestamp}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    console.log('✅ PDF exported successfully:', filename);
    alert(`✅ Research report exported as ${filename}`);
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Export PDF button
    document.addEventListener('click', function(e) {
        if (e.target.id === 'export-pdf-button' || e.target.closest('#export-pdf-button')) {
            e.preventDefault();
            exportResearchToPDF();
        }
    });
});