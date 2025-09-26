-- Insert default categories
INSERT INTO public.categories (name, icon, color, type) VALUES
-- Income categories
('Salary', '💼', '#10B981', 'income'),
('Freelance', '💻', '#059669', 'income'),
('Investment', '📈', '#047857', 'income'),
('Gift', '🎁', '#065F46', 'income'),
('Other Income', '💰', '#064E3B', 'income'),

-- Expense categories
('Food & Dining', '🍔', '#EF4444', 'expense'),
('Transportation', '🚗', '#F97316', 'expense'),
('Shopping', '🛍️', '#8B5CF6', 'expense'),
('Entertainment', '🎬', '#EC4899', 'expense'),
('Bills & Utilities', '⚡', '#3B82F6', 'expense'),
('Healthcare', '🏥', '#06B6D4', 'expense'),
('Education', '📚', '#84CC16', 'expense'),
('Travel', '✈️', '#F59E0B', 'expense'),
('Rent', '🏠', '#DC2626', 'expense'),
('Other Expense', '💸', '#6B7280', 'expense')
ON CONFLICT DO NOTHING;
