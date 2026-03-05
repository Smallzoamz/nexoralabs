export interface Bank {
    code: string;
    name: string;
    color: string;
    logo: string; // SVG string
}

export const THAI_BANKS: Bank[] = [
    {
        code: 'KBANK',
        name: 'ธนาคารกสิกรไทย (KBANK)',
        color: '#008545',
        logo: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="kb1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#00a854"/>
                    <stop offset="100%" style="stop-color:#006633"/>
                </linearGradient>
            </defs>
            <rect width="128" height="128" rx="28" fill="url(#kb1)"/>
            <path d="M36 90V50l14-14h28l14 14v40h-14V60H72v30H58V90H36z" fill="white"/>
        </svg>`
    },
    {
        code: 'SCB',
        name: 'ธนาคารไทยพาณิชย์ (SCB)',
        color: '#5D3A8C',
        logo: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="scb1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#7B52AB"/>
                    <stop offset="100%" style="stop-color:#4A2D7A"/>
                </linearGradient>
            </defs>
            <rect width="128" height="128" rx="28" fill="url(#scb1)"/>
            <circle cx="64" cy="64" r="38" fill="none" stroke="white" stroke-width="9"/>
            <circle cx="64" cy="64" r="20" fill="white"/>
        </svg>`
    },
    {
        code: 'BBL',
        name: 'ธนาคารกรุงเทพ (BBL)',
        color: '#1E3A8A',
        logo: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bbl1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#2563EB"/>
                    <stop offset="100%" style="stop-color:#1E3A8A"/>
                </linearGradient>
            </defs>
            <rect width="128" height="128" rx="28" fill="url(#bbl1)"/>
            <rect x="30" y="32" width="28" height="64" fill="white" rx="6"/>
            <rect x="70" y="32" width="28" height="28" fill="white" rx="6"/>
            <rect x="70" y="70" width="28" height="26" fill="white" rx="6"/>
        </svg>`
    },
    {
        code: 'KTB',
        name: 'ธนาคารกรุงไทย (KTB)',
        color: '#00A8E1',
        logo: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="ktb1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#00C6FF"/>
                    <stop offset="100%" style="stop-color:#0088CC"/>
                </linearGradient>
            </defs>
            <rect width="128" height="128" rx="28" fill="url(#ktb1)"/>
            <path d="M64 24L24 100h20l5-18h30l5 18h20L64 24z" fill="white"/>
            <circle cx="64" cy="70" r="18" fill="#00A8E1"/>
            <circle cx="64" cy="70" r="8" fill="white"/>
        </svg>`
    },
    {
        code: 'BAY',
        name: 'ธนาคารกรุงศรีอยุธยา (BAY)',
        color: '#FFC107',
        logo: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bay1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#FFD54F"/>
                    <stop offset="100%" style="stop-color:#FFA000"/>
                </linearGradient>
            </defs>
            <rect width="128" height="128" rx="28" fill="url(#bay1)"/>
            <rect x="22" y="28" width="84" height="72" fill="none" stroke="#1E3A8A" stroke-width="8" rx="8"/>
            <path d="M22 28l84 72M22 100l84-72" stroke="#1E3A8A" stroke-width="8"/>
            <circle cx="64" cy="64" r="14" fill="#FFC107" stroke="#1E3A8A" stroke-width="5"/>
        </svg>`
    },
    {
        code: 'TTB',
        name: 'ทีเอ็มบีธนชาต (TTB)',
        color: '#0066CC',
        logo: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="ttb1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#2979FF"/>
                    <stop offset="100%" style="stop-color:#0044AA"/>
                </linearGradient>
            </defs>
            <rect width="128" height="128" rx="28" fill="url(#ttb1)"/>
            <rect x="26" y="44" width="36" height="10" fill="white" rx="3"/>
            <rect x="26" y="59" width="56" height="10" fill="white" rx="3"/>
            <rect x="26" y="74" width="24" height="10" fill="white" rx="3"/>
            <polygon points="86,50 100,50 93,66" fill="white"/>
        </svg>`
    },
    {
        code: 'GSB',
        name: 'ธนาคารออมสิน (GSB)',
        color: '#E91E63',
        logo: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="gsb1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#FF4081"/>
                    <stop offset="100%" style="stop-color:#C2185B"/>
                </linearGradient>
            </defs>
            <rect width="128" height="128" rx="28" fill="url(#gsb1)"/>
            <circle cx="64" cy="58" r="28" fill="white"/>
            <circle cx="64" cy="58" r="16" fill="#E91E63"/>
            <rect x="58" y="50" width="12" height="16" fill="white" rx="3"/>
            <rect x="50" y="58" width="28" height="10" fill="white" rx="3"/>
        </svg>`
    },
    {
        code: 'OTHER',
        name: 'ธนาคารอื่นๆ (พิมพ์ระบุ)',
        color: '#6B7280',
        logo: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="other1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#9CA3AF"/>
                    <stop offset="100%" style="stop-color:#4B5563"/>
                </linearGradient>
            </defs>
            <rect width="128" height="128" rx="28" fill="url(#other1)"/>
            <rect x="24" y="48" width="80" height="32" fill="white" rx="8"/>
            <circle cx="44" cy="40" r="6" fill="#9CA3AF"/>
            <circle cx="64" cy="40" r="6" fill="#9CA3AF"/>
            <circle cx="84" cy="40" r="6" fill="#9CA3AF"/>
        </svg>`
    }
];

// Helper to get bank info from name
export const getBankInfo = (nameToMatch: string): Bank | undefined => {
    if (!nameToMatch) return undefined;
    return THAI_BANKS.find(b =>
        b.name.toLowerCase() === nameToMatch.toLowerCase() ||
        b.code.toLowerCase() === nameToMatch.toLowerCase() ||
        nameToMatch.includes(b.code)
    ) || {
        code: 'CUSTOM',
        name: nameToMatch,
        color: '#64748b',
        logo: THAI_BANKS.find(b => b.code === 'OTHER')?.logo || ''
    };
};
