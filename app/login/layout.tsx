import { AuthProvider } from '@/lib/auth-context'
import { ModalProvider } from '@/lib/modal-context'

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthProvider>
            <ModalProvider>
                {children}
            </ModalProvider>
        </AuthProvider>
    )
}
