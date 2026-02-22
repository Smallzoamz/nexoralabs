-- Add signature column to site_config table
ALTER TABLE public.site_config
ADD COLUMN IF NOT EXISTS owner_signature TEXT;

-- Set default empty value if null
UPDATE public.site_config
SET owner_signature = ''
WHERE owner_signature IS NULL;
