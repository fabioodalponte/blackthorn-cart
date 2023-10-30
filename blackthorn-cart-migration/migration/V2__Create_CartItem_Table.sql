CREATE TABLE cart_item (
  id SERIAL PRIMARY KEY,
  cart_id INT NOT NULL,
  item_id INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (cart_id) REFERENCES cart (id),
  FOREIGN KEY (item_id) REFERENCES item (id)
);