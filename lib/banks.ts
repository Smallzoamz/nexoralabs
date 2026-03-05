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
        logo: ''
    };
};
