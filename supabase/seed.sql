-- Seed data for testing

-- Insert sample members (you'll need to replace user_id with actual auth.users ids after signup)
INSERT INTO members (name, email, phone, course, role_id, status) VALUES
  ('João Silva', 'joao@example.com', '11999999999', 'Engenharia', (SELECT id FROM roles WHERE name = 'admin'), 'active'),
  ('Maria Santos', 'maria@example.com', '11988888888', 'Medicina', (SELECT id FROM roles WHERE name = 'diretor'), 'active'),
  ('Pedro Costa', 'pedro@example.com', '11977777777', 'Direito', (SELECT id FROM roles WHERE name = 'membro'), 'active'),
  ('Ana Paula', 'ana@example.com', '11966666666', 'Administração', (SELECT id FROM roles WHERE name = 'membro'), 'active');

-- Insert sample finances
INSERT INTO finances (type, category, description, amount, date) VALUES
  ('receita', 'Mensalidade', 'Mensalidade de membros - Janeiro', 5000.00, '2026-01-15'),
  ('receita', 'Evento', 'Venda de ingressos - Festa Junina', 3500.00, '2026-02-20'),
  ('despesa', 'Material', 'Compra de uniformes', 2000.00, '2026-01-10'),
  ('despesa', 'Infraestrutura', 'Aluguel de espaço', 1500.00, '2026-02-05'),
  ('receita', 'Loja', 'Venda de produtos', 800.00, '2026-03-01'),
  ('despesa', 'Marketing', 'Divulgação de eventos', 500.00, '2026-03-10');

-- Insert sample events
INSERT INTO events (name, description, date, location, max_participants, current_participants) VALUES
  ('Torneio de Futebol', 'Campeonato inter-atléticas de futebol', '2026-06-15 14:00:00', 'Campo da Universidade', 100, 45),
  ('Festa de Integração', 'Festa de boas-vindas aos calouros', '2026-07-20 20:00:00', 'Salão de Eventos', 200, 120),
  ('Corrida Beneficente', 'Corrida de 5km para arrecadação de fundos', '2026-08-10 08:00:00', 'Parque Municipal', 150, 80),
  ('Workshop de Liderança', 'Capacitação para membros da diretoria', '2026-09-05 19:00:00', 'Auditório Central', 50, 30);

-- Insert sample products
INSERT INTO products (name, description, price, stock, image_url) VALUES
  ('Camiseta Oficial', 'Camiseta da atlética - Tamanho M', 45.00, 50, '/products/camiseta.jpg'),
  ('Moletom', 'Moletom com capuz - Tamanho G', 120.00, 30, '/products/moletom.jpg'),
  ('Boné', 'Boné bordado com logo', 35.00, 100, '/products/bone.jpg'),
  ('Squeeze', 'Garrafa de água 500ml', 25.00, 75, '/products/squeeze.jpg'),
  ('Mochila', 'Mochila esportiva', 80.00, 20, '/products/mochila.jpg');
