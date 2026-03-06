import React from 'react'

export interface ETaxInvoice {
    id: string
    invoice_number: string
    invoice_date: string
    seller_name: string
    seller_tax_id?: string
    seller_address?: string
    seller_branch_code?: string
    buyer_name: string
    buyer_tax_id?: string
    buyer_address?: string
    buyer_email?: string
    buyer_branch_code?: string
    description: string
    amount: number
    vat_rate: number
    vat_amount: number
    total_amount: number
    status: 'draft' | 'issued' | 'cancelled' | 'void'
    notes?: string
}

interface ETaxInvoiceTemplateProps {
    invoice: ETaxInvoice
}

export function ETaxInvoiceTemplate({ invoice }: ETaxInvoiceTemplateProps) {
    if (!invoice) return null;

    return (
        <div
            id={`etax-pdf-${invoice.id}`}
            style={{ display: 'none' }}
            className="bg-white"
        >
            <div
                className="bg-white mx-auto relative printable-pdf"
                style={{
                    width: '210mm',
                    minHeight: '297mm',
                    padding: '20mm 15mm',
                    margin: '0 auto',
                    boxSizing: 'border-box',
                    backgroundColor: 'white',
                    fontFamily: '"Sarabun", "Sarabun", sans-serif',
                    color: '#000'
                }}
            >
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', borderBottom: '2px solid #000', paddingBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                            <h1 style={{ fontSize: '30px', fontWeight: 'bold', margin: 0, color: '#000' }}>
                                ใบกำกับภาษี
                            </h1>
                        </div>
                        <p style={{ fontSize: '14px', margin: 0, color: '#4b5563', letterSpacing: '2px' }}>TAX INVOICE</p>
                    </div>

                    <div style={{ flex: 1, textAlign: 'right' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#000' }}>
                            {invoice.seller_name}
                        </h2>
                        {invoice.seller_address && (
                            <p style={{ fontSize: '13px', margin: '0 0 5px 0', color: '#374151', whiteSpace: 'pre-line', lineHeight: '1.4' }}>
                                {invoice.seller_address}
                            </p>
                        )}
                        <div style={{ fontSize: '13px', color: '#374151', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                            {invoice.seller_tax_id && (
                                <div>เลขประจำตัวผู้เสียภาษี: <span style={{ fontWeight: 500 }}>{invoice.seller_tax_id}</span></div>
                            )}
                            {invoice.seller_branch_code && invoice.seller_branch_code !== '00000' && (
                                <div>สาขา: <span style={{ fontWeight: 500 }}>{invoice.seller_branch_code}</span></div>
                            )}
                            {(!invoice.seller_branch_code || invoice.seller_branch_code === '00000') && invoice.seller_tax_id && (
                                <div><span style={{ fontWeight: 500 }}>สำนักงานใหญ่</span></div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Meta Information */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                    <div style={{
                        border: '1px solid #d1d5db',
                        padding: '12px 15px',
                        borderRadius: '4px',
                        flex: 1,
                        backgroundColor: '#f9fafb'
                    }}>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>ลูกค้า / ผู้ซื้อ (Buyer)</p>
                        <p style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#000' }}>
                            {invoice.buyer_name}
                        </p>
                        {invoice.buyer_address && (
                            <p style={{ fontSize: '13px', margin: '0 0 5px 0', color: '#374151', whiteSpace: 'pre-line', lineHeight: '1.4' }}>
                                {invoice.buyer_address}
                            </p>
                        )}
                        <div style={{ fontSize: '13px', color: '#374151', marginTop: '8px' }}>
                            {invoice.buyer_tax_id && (
                                <div style={{ marginBottom: '3px' }}>เลขประจำตัวผู้เสียภาษี: <span style={{ fontWeight: 500 }}>{invoice.buyer_tax_id}</span></div>
                            )}
                            {invoice.buyer_branch_code && invoice.buyer_branch_code !== '00000' ? (
                                <div style={{ marginBottom: '3px' }}>สาขา: <span style={{ fontWeight: 500 }}>{invoice.buyer_branch_code}</span></div>
                            ) : invoice.buyer_tax_id ? (
                                <div style={{ marginBottom: '3px' }}><span style={{ fontWeight: 500 }}>สำนักงานใหญ่</span></div>
                            ) : null}
                            {invoice.buyer_email && (
                                <div>อีเมล: {invoice.buyer_email}</div>
                            )}
                        </div>
                    </div>

                    <div style={{
                        border: '1px solid #d1d5db',
                        padding: '12px 15px',
                        borderRadius: '4px',
                        width: '35%',
                        backgroundColor: '#f9fafb',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>เลขที่เอกสาร (No.):</span>
                            <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#000' }}>{invoice.invoice_number}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>วันที่ (Date):</span>
                            <span style={{ fontSize: '14px', fontWeight: 500, color: '#000' }}>
                                {new Date(invoice.invoice_date).toLocaleDateString('th-TH', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #9ca3af', backgroundColor: '#f3f4f6', padding: '10px', fontSize: '13px', textAlign: 'center', width: '10%' }}>ลำดับ<br />(Item)</th>
                            <th style={{ border: '1px solid #9ca3af', backgroundColor: '#f3f4f6', padding: '10px', fontSize: '13px', textAlign: 'left', width: '50%' }}>รายการค้า<br />(Description)</th>
                            <th style={{ border: '1px solid #9ca3af', backgroundColor: '#f3f4f6', padding: '10px', fontSize: '13px', textAlign: 'center', width: '10%' }}>จำนวน<br />(Qty)</th>
                            <th style={{ border: '1px solid #9ca3af', backgroundColor: '#f3f4f6', padding: '10px', fontSize: '13px', textAlign: 'right', width: '15%' }}>หน่วยละ<br />(Unit Price)</th>
                            <th style={{ border: '1px solid #9ca3af', backgroundColor: '#f3f4f6', padding: '10px', fontSize: '13px', textAlign: 'right', width: '15%' }}>จำนวนเงิน<br />(Amount)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb', padding: '15px 10px', textAlign: 'center', fontSize: '14px', verticalAlign: 'top' }}>
                                1
                            </td>
                            <td style={{ borderRight: '1px solid #e5e7eb', padding: '15px 10px', fontSize: '14px', verticalAlign: 'top' }}>
                                <div style={{ fontWeight: 500 }}>{invoice.description}</div>
                            </td>
                            <td style={{ borderRight: '1px solid #e5e7eb', padding: '15px 10px', textAlign: 'center', fontSize: '14px', verticalAlign: 'top' }}>
                                1
                            </td>
                            <td style={{ borderRight: '1px solid #e5e7eb', padding: '15px 10px', textAlign: 'right', fontSize: '14px', verticalAlign: 'top' }}>
                                {invoice.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ borderRight: '1px solid #e5e7eb', padding: '15px 10px', textAlign: 'right', fontSize: '14px', verticalAlign: 'top', fontWeight: 500 }}>
                                {invoice.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                            </td>
                        </tr>
                        {/* Empty spacer row for visual height */}
                        <tr>
                            <td style={{ borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '15px 10px', height: '100px' }}></td>
                            <td style={{ borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '15px 10px' }}></td>
                            <td style={{ borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '15px 10px' }}></td>
                            <td style={{ borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '15px 10px' }}></td>
                            <td style={{ borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '15px 10px' }}></td>
                        </tr>
                    </tbody>
                </table>

                {/* Footer Totals */}
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        {invoice.notes && (
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#f9fafb',
                                border: '1px dashed #d1d5db',
                                borderRadius: '4px'
                            }}>
                                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', fontWeight: 500 }}>หมายเหตุ (Remarks):</p>
                                <p style={{ fontSize: '13px', margin: 0, color: '#374151', whiteSpace: 'pre-wrap' }}>{invoice.notes}</p>
                            </div>
                        )}

                        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '4px', textAlign: 'center' }}>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 10px 0' }}>ลายมือชื่อผู้ออกเอกสาร (Authorized Signature)</p>
                            <div style={{ borderBottom: '1px solid #9ca3af', width: '200px', margin: '30px auto 10px auto' }}></div>
                            <p style={{ fontSize: '13px', margin: 0 }}>วันที่ _______________</p>
                        </div>
                    </div>

                    <div style={{ width: '40%' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '8px 10px', border: '1px solid #e5e7eb', fontSize: '13px', color: '#4b5563' }}>รวมเป็นเงิน<br /><span style={{ fontSize: '11px', color: '#9ca3af' }}>Sub Total</span></td>
                                    <td style={{ padding: '8px 10px', border: '1px solid #e5e7eb', textAlign: 'right', fontSize: '14px', fontWeight: 500 }}>
                                        {invoice.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px 10px', border: '1px solid #e5e7eb', fontSize: '13px', color: '#4b5563' }}>ภาษีมูลค่าเพิ่ม {invoice.vat_rate}%<br /><span style={{ fontSize: '11px', color: '#9ca3af' }}>VAT</span></td>
                                    <td style={{ padding: '8px 10px', border: '1px solid #e5e7eb', textAlign: 'right', fontSize: '14px', fontWeight: 500 }}>
                                        {invoice.vat_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '12px 10px', border: '1px solid #4b5563', backgroundColor: '#f9fafb', fontSize: '14px', fontWeight: 'bold' }}>จำนวนเงินสุทธิ<br /><span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'normal' }}>Grand Total</span></td>
                                    <td style={{ padding: '12px 10px', border: '1px solid #4b5563', textAlign: 'right', fontSize: '18px', fontWeight: 'bold' }}>
                                        {invoice.total_amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
