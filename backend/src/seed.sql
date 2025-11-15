-- Seed de Cupcakes
INSERT INTO cupcakes (id, name, description, price, flavor, image, stock) VALUES
('1', 'Sonho de Chocolate', 'Delicioso cupcake de chocolate', 6.50, 'chocolate', '/images/choc.jpg', 20),
('2', 'Céu de Baunilha', 'Baunilha clássica com creme de manteiga', 5.50, 'vanilla', '/images/vanilla.jpg', 15),
('3', 'Delícia de Morango', 'Recheio e cobertura de morango', 6.00, 'strawberry', '/images/straw.jpg', 10),
('4', 'Raspas de Limão', 'Sabor fresco de limão', 5.75, 'lemon', '/images/lemon.jpg', 0);

-- Seed de Usuário Admin
INSERT INTO users (id, name, email, password, phone, address, isAdmin) VALUES
('1', 'Admin', 'admin@cupcake.com', '$2b$10$Q2wVXl8/72VjkHRJhdbXq.SLkDCpV.OjH6cO.V3PaWiR8p2cbHEum', '000000000', 'Loja Cupcake', 1); -- senha = 'admin123'

-- Seed de Carrinho (com um item de exemplo)
INSERT INTO cart_items (id, user_id, cupcake_id, quantity) VALUES
('1', '1', '1', 3); -- 3 unidades de Sonho de Chocolate

-- Seed de Pedido
INSERT INTO orders (id, user_id, total, shipping_address, shipping_method, status, created_at) VALUES
('1', '1', 19.50, 'Rua Exemplo, 123, Cidade, Estado', 'normal', 'In preparation', '2025-11-12T10:00:00');

-- Seed de Itens de Pedido
INSERT INTO order_items (id, order_id, cupcake_id, quantity, price) VALUES
('1', '1', '1', 3, 6.50); -- 3 Sonho de Chocolate
