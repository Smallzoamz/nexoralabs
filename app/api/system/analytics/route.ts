import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 60

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'Configuration Missing' }, { status: 500 })
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        const token = authHeader.replace('Bearer ', '')

        const { data: { user }, error: authError } = await supabase.auth.getUser(token)
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch data
        const [
            { data: contacts },
            { data: clients },
            { data: invoices },
            { data: analytics }
        ] = await Promise.all([
            supabase.from('contact_submissions').select('package_interest, message, company, created_at'),
            supabase.from('clients').select('package_type, is_active, created_at'),
            supabase.from('invoices').select('setup_fee, monthly_fee, status, created_at').eq('status', 'paid'),
            supabase.from('site_analytics').select('user_agent, visited_at, path')
                .not('path', 'like', '/admin%')
                .not('path', 'like', '/api%')
                .not('path', 'like', '/_next%')
                .not('path', 'like', '/payment%')
        ])

        // 1. Popular Packages
        const packageCounts: Record<string, number> = {}
        clients?.forEach(c => {
            const type = (c.package_type || 'Unknown').toLowerCase()
            packageCounts[type] = (packageCounts[type] || 0) + 1
        })
        contacts?.forEach(c => {
            const type = (c.package_interest || 'Unknown').toLowerCase()
            packageCounts[type] = (packageCounts[type] || 0) + 1
        })
        const popularPackages = Object.entries(packageCounts).map(([name, count]) => ({ name, count }))

        // 2 & 4. Common Issues & Business Types
        const issuesCounts: Record<string, number> = {
            'สร้างเว็บใหม่': 0, 'ปรับปรุงเว็บเดิม': 0, 'ทำ SEO': 0, 'ระบบจัดการ': 0, 'อื่นๆ': 0
        }
        const businessCounts: Record<string, number> = {
            'บริษัท/นิติบุคคล': 0, 'ร้านอาหาร/คาเฟ่': 0, 'คลินิก/สุขภาพ': 0, 'อสังหาฯ/รับเหมา': 0, 'บุคคลทั่วไป/อื่นๆ': 0
        }

        contacts?.forEach(c => {
            const msg = (c.message || '').toLowerCase()
            const comp = (c.company || '').toLowerCase()

            // Analyze Business
            if (comp.includes('บริษัท') || comp.includes('จำกัด') || comp.includes('หจก')) businessCounts['บริษัท/นิติบุคคล']++
            else if (comp.includes('ร้าน') || comp.includes('คาเฟ่')) businessCounts['ร้านอาหาร/คาเฟ่']++
            else if (comp.includes('คลินิก') || comp.includes('แพทย์') || comp.includes('พยาบาล')) businessCounts['คลินิก/สุขภาพ']++
            else if (comp.includes('อสังหา') || comp.includes('รับเหมา') || comp.includes('ก่อสร้าง')) businessCounts['อสังหาฯ/รับเหมา']++
            else businessCounts['บุคคลทั่วไป/อื่นๆ']++

            // Analyze Issue
            if (msg.includes('ใหม่') || msg.includes('เริ่มต้น')) issuesCounts['สร้างเว็บใหม่']++
            else if (msg.includes('ปรับปรุง') || msg.includes('แก้') || msg.includes('ดีไซน์')) issuesCounts['ปรับปรุงเว็บเดิม']++
            else if (msg.includes('seo') || msg.includes('กูเกิล') || msg.includes('google')) issuesCounts['ทำ SEO']++
            else if (msg.includes('ระบบ') || msg.includes('แอดมิน') || msg.includes('สมาชิก')) issuesCounts['ระบบจัดการ']++
            else issuesCounts['อื่นๆ']++
        })

        const commonIssues = Object.entries(issuesCounts)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count)

        const businessTypes = Object.entries(businessCounts)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count)

        // 3. Monthly Renewals (Active Clients grouped by month)
        const renewalMap: Record<string, number> = {}
        let totalActive = 0;
        clients?.forEach(c => {
            if (c.is_active) {
                totalActive++;
                const date = new Date(c.created_at)
                const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                renewalMap[monthYear] = (renewalMap[monthYear] || 0) + 1
            }
        })
        const monthlyRenewals = Object.entries(renewalMap)
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => a.month.localeCompare(b.month))

        // 5. Site Traffic
        const now = new Date()
        let totalVisits = 0
        let thisMonthVisits = 0
        let todayVisits = 0
        const recentDaysMap: Record<string, number> = {}

        analytics?.forEach(a => {
            totalVisits++
            const date = new Date(a.visited_at)

            // Generate last 7 days keys even if empty
            for (let i = 0; i < 7; i++) {
                const d = new Date()
                d.setDate(now.getDate() - i)
                const ds = d.toISOString().split('T')[0]
                if (!recentDaysMap[ds]) recentDaysMap[ds] = 0
            }

            if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
                thisMonthVisits++
            }
            if (date.toDateString() === now.toDateString()) {
                todayVisits++
            }
            // Add to recent map if within 7 days
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 7) {
                const dateString = date.toISOString().split('T')[0]
                recentDaysMap[dateString] = (recentDaysMap[dateString] || 0) + 1
            }
        })

        const recentTraffic = Object.entries(recentDaysMap)
            .map(([date, visits]) => ({ date, visits }))
            .sort((a, b) => a.date.localeCompare(b.date))

        // 6. Revenue
        let totalRev = 0
        let thisMonthRev = 0
        let thisYearRev = 0
        const revenueMap: Record<string, number> = {}

        invoices?.forEach(inv => {
            const amount = Number(inv.setup_fee || 0) + Number(inv.monthly_fee || 0)
            totalRev += amount

            const date = new Date(inv.created_at)
            if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
                thisMonthRev += amount
            }
            if (date.getFullYear() === now.getFullYear()) {
                thisYearRev += amount
            }

            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            revenueMap[monthYear] = (revenueMap[monthYear] || 0) + amount
        })

        const monthlyRevenue = Object.entries(revenueMap).map(([month, amount]) => ({ month, amount })).sort((a, b) => a.month.localeCompare(b.month))

        return NextResponse.json({
            popularPackages,
            commonIssues,
            businessTypes,
            monthlyRenewals,
            totalActiveClients: totalActive,
            siteTraffic: {
                total: totalVisits,
                thisMonth: thisMonthVisits,
                today: todayVisits,
                recent: recentTraffic
            },
            revenue: {
                total: totalRev,
                thisMonth: thisMonthRev,
                thisYear: thisYearRev,
                monthlyData: monthlyRevenue
            }
        })

    } catch (error) {
        console.error('Analytics aggregation error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
