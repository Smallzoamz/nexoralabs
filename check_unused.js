const fs = require('fs');
const path = require('path');

const files = [
    'components/admin/IntegratedDashboard.tsx',
    'components/admin/InvoiceManager.tsx',
    'components/admin/ContractManager.tsx',
    'components/admin/SupportTicketManager.tsx',
    'components/admin/ChatbotFAQManager.tsx',
    'components/admin/ArticleManager.tsx',
    'components/admin/PortfolioManager.tsx',
    'components/admin/SEOSettings.tsx',
    'components/admin/ChatbotSettings.tsx',
    'components/admin/ContactManager.tsx',
    'components/admin/FAQManager.tsx',
    'components/admin/TrustBadgeManager.tsx',
    'components/admin/EmailTemplateManager.tsx',
    'components/admin/PaymentSettings.tsx',
    'components/admin/AccountSettingsModal.tsx',
    'components/admin/ContractGeneratorModal.tsx'
];

files.forEach(file => {
    const fullPath = path.join('f:/SellingSite', file);
    if (!fs.existsSync(fullPath)) return;
    const content = fs.readFileSync(fullPath, 'utf8');

    // Simple heuristic for unused variables in common patterns I added
    const vars = ['isReadOnly', 'isSaving', 'isLoading', 'user', 'showAlert', 'showConfirm'];
    vars.forEach(v => {
        const regex = new RegExp(`\\b${v}\\b`, 'g');
        const matches = content.match(regex);
        if (matches && matches.length === 1) {
            // Check if it's in a destructuring assignment
            if (content.includes(`{ ${v} }`) || content.includes(`, ${v} }`) || content.includes(`{ ${v},`)) {
                console.log(`Unused variable: ${v} in ${file}`);
            }
        }
    });
});
