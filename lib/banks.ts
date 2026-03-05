export interface Bank {
    code: string;
    name: string;
    color: string;
    logo: string; // Path to logo image in /public
}

export const THAI_BANKS: Bank[] = [
    {
        code: 'KBANK',
        name: 'ธนาคารกสิกรไทย (KBANK)',
        color: '#008545',
        logo: '/images/banks/kbank.png'
    },
    {
        code: 'SCB',
        name: 'ธนาคารไทยพาณิชย์ (SCB)',
        color: '#5D3A8C',
        logo: '/images/banks/scb.png'
    },
    {
        code: 'BBL',
        name: 'ธนาคารกรุงเทพ (BBL)',
        color: '#1E3A8A',
        logo: '/images/banks/bbl.png'
    },
    {
        code: 'KTB',
        name: 'ธนาคารกรุงไทย (KTB)',
        color: '#00A8E1',
        logo: '/images/banks/ktb.png'
    },
    {
        code: 'BAY',
        name: 'ธนาคารกรุงศรีอยุธยา (BAY)',
        color: '#FFC107',
        logo: '/images/banks/bay.png'
    },
    {
        code: 'TTB',
        name: 'ทีเอ็มบีธนชาต (TTB)',
        color: '#0066CC',
        logo: '/images/banks/ttb.png'
    },
    {
        code: 'GSB',
        name: 'ธนาคารออมสิน (GSB)',
        color: '#E91E63',
        logo: '/images/banks/gsb.png'
    },
    {
        code: 'OTHER',
        name: 'ธนาคารอื่นๆ (พิมพ์ระบุ)',
        color: '#6B7280',
        logo: ''
    }
];

// Keyword aliases for fuzzy matching bank names
const BANK_ALIASES: Record<string, string[]> = {
    KBANK: ['kasikorn', 'กสิกร', 'kbank'],
    SCB: ['siam commercial', 'ไทยพาณิชย์', 'scb'],
    BBL: ['bangkok bank', 'กรุงเทพ', 'bbl'],
    KTB: ['krungthai', 'กรุงไทย', 'ktb'],
    BAY: ['krungsri', 'กรุงศรี', 'ayudhya', 'bay'],
    TTB: ['tmb', 'thanachart', 'ธนชาต', 'ttb', 'ทีเอ็มบี'],
    GSB: ['government savings', 'ออมสิน', 'gsb'],
};

// Helper to get bank info from name
export const getBankInfo = (nameToMatch: string): Bank | undefined => {
    if (!nameToMatch) return undefined;
    const lower = nameToMatch.toLowerCase();

    // Exact match by name or code
    const exact = THAI_BANKS.find(b =>
        b.name.toLowerCase() === lower ||
        b.code.toLowerCase() === lower
    );
    if (exact) return exact;

    // Fuzzy match by aliases
    for (const [code, aliases] of Object.entries(BANK_ALIASES)) {
        if (aliases.some(alias => lower.includes(alias))) {
            return THAI_BANKS.find(b => b.code === code);
        }
    }

    // Fallback: check if name contains bank code
    const codeMatch = THAI_BANKS.find(b => lower.includes(b.code.toLowerCase()));
    if (codeMatch) return codeMatch;

    return {
        code: 'CUSTOM',
        name: nameToMatch,
        color: '#64748b',
        logo: ''
    };
};
