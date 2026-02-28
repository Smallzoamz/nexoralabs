import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import PaymentPageClient from './PaymentPageClient'

// We need server-side data fetch for invoice details
interface PageProps {
    params: Promise<{ invoiceId: string }>
}

export default async function PaymentPage({ params }: PageProps) {
    const { invoiceId } = await params

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Fetch invoice details by ID
    const { data: invoice, error } = await supabase
        .from('invoices')
        .select('id, client_name, client_email, package_details, setup_fee, monthly_fee, due_date, status')
        .eq('id', invoiceId)
        .single()

    if (error || !invoice) {
        notFound()
    }

    // Fetch payment configuration (bank / promptpay details)
    const { data: paymentConfig } = await supabase
        .from('payment_settings')
        .select('*')
        .limit(1)
        .maybeSingle()

    return (
        <PaymentPageClient invoice={invoice} paymentConfig={paymentConfig} />
    )
}

export async function generateMetadata({ params }: PageProps) {
    const { invoiceId } = await params
    return {
        title: `ชำระเงิน | VELOZI | Dev`,
        description: `หน้าชำระเงินสำหรับใบแจ้งหนี้ #${invoiceId.substring(0, 8).toUpperCase()}`,
    }
}
