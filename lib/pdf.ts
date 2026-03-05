// Shared PDF generation utilities using html2pdf.js
// Used by InvoiceManager, IntegratedDashboard, AnalyticsDashboard

export interface PDFOptions {
    margin?: [number, number, number, number]
    filename?: string
    image?: { type: 'jpeg' | 'png' | 'webp'; quality: number }
    html2canvas?: {
        scale?: number
        useCORS?: boolean
        letterRendering?: boolean
        windowWidth?: number
        width?: number
        scrollY?: number
    }
    jsPDF?: {
        unit: string
        format: string
        orientation: 'portrait' | 'landscape'
    }
}

// Default A4 options for invoice/receipt documents
export const invoicePDFOptions: PDFOptions = {
    margin: [10, 10, 10, 10],
    filename: 'document.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        windowWidth: 793,  // A4 width at 96dpi
        width: 793
    },
    jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
    }
}

// Default options for tax certificates
export const taxPDFOptions: PDFOptions = {
    margin: [0, 0, 0, 0],
    filename: 'tax-certificate.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
        scale: 2,
        useCORS: true,
        windowWidth: 793,
        width: 793,
        scrollY: 0
    },
    jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
    }
}

// Dynamic PDF generator function
export async function generatePDF(
    element: HTMLElement,
    options: PDFOptions = invoicePDFOptions
): Promise<void> {
    const html2pdf = (await import('html2pdf.js')).default

    await html2pdf()
        .set({
            margin: options.margin,
            filename: options.filename,
            image: options.image,
            html2canvas: options.html2canvas,
            jsPDF: options.jsPDF
        })
        .from(element)
        .save()
}

// Generate PDF as Base64 data URI (for email attachments)
export async function generatePDFAsDataURI(
    element: HTMLElement,
    options: PDFOptions = invoicePDFOptions
): Promise<string> {
    const html2pdf = (await import('html2pdf.js')).default

    return await html2pdf()
        .set({
            margin: options.margin,
            filename: options.filename,
            image: options.image,
            html2canvas: options.html2canvas,
            jsPDF: options.jsPDF
        })
        .from(element)
        .outputPdf('datauristring')
}
