-- Create Cart table
CREATE TABLE Cart (
    cart_id INT PRIMARY KEY,
    created_at TIMESTAMP,
    is_abandoned BOOLEAN,
    user_id INT
);

-- Create Item table
CREATE TABLE Item (
    item_id INT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10, 2)
);