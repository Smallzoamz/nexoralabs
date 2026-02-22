import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CookieConsent } from '@/components/CookieConsent'
import { WelcomeModal } from '@/components/frontend/WelcomeModal'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieConsent />
            <WelcomeModal />
        </>
    )
}
