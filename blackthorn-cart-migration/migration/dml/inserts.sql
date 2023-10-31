-- Insert a new item
INSERT INTO item (name, price, stock_amount) VALUES ('Item 1', 9.99, 10);

-- Insert a new cart
INSERT INTO cart (subtotal, discounts, taxes, total) VALUES (90, 10, 10, 90);

-- Insert a new cart item
INSERT INTO cart_item (cart_id, item_id, price, quantity) VALUES (1, 1, 9.99, 1);