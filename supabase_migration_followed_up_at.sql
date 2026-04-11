-- Migración manual para Supabase Backend
-- Pega este script en el SQL Editor de tu Dashboard de Supabase y ejecútalo.

-- Si tu tabla se llama 'gtd_items' u otro nombre, asegúrate de ajustarlo:
ALTER TABLE gtd_items
ADD COLUMN IF NOT EXISTS followed_up_at timestamp with time zone;
