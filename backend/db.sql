-- Create and use database
CREATE DATABASE IF NOT EXISTS cafe_crema;
USE cafe_crema;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Menu items table
CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  type ENUM('veg', 'non-veg', 'beverages') NOT NULL,
  image_url VARCHAR(500),
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_spicy BOOLEAN DEFAULT FALSE,
  has_gluten BOOLEAN DEFAULT FALSE,
  is_hot BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_type (type),
  INDEX idx_bestseller (is_bestseller),
  INDEX idx_category_type (category, type),
  INDEX idx_name (name)
);

-- Specials table
CREATE TABLE specials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_item_name (item_name)
);

-- Staff table
CREATE TABLE staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(50) NOT NULL,
  photo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_position (position)
);

-- Orders table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  order_items JSON,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_order_date (order_date)
);

-- Insert menu items
INSERT INTO menu_items (name, description, price, category, type, image_url, is_bestseller, is_spicy, has_gluten, is_hot) VALUES
-- Vegetarian Items
('Margherita Pizza', 'Mozzarella, tomato & basil—classic & light', 400.00, 'Pizza', 'veg', '/src/assets/margherita_pizza.jpeg', FALSE, FALSE, TRUE, FALSE),
('Veg Burger', 'Crispy veggie patty with lettuce & signature sauce', 360.00, 'Burgers', 'veg', '/src/assets/veg_burger.jpeg', FALSE, FALSE, TRUE, FALSE),
('Veg Sandwich', 'Veggies & cheese with house dressing', 240.00, 'Sandwiches', 'veg', '/src/assets/veg_sandwich.webp', FALSE, FALSE, TRUE, FALSE),
('Veg Momo', 'Steamed vegetable dumplings with spicy chutney', 200.00, 'Appetizers', 'veg', '/src/assets/veg_momo.jpg', TRUE, TRUE, TRUE, FALSE),
('Veg Roll', 'Spiced veggies in a soft wrap', 300.00, 'Rolls', 'veg', '/src/assets/veg_roll.jpg', FALSE, FALSE, TRUE, FALSE),
('French Fries', 'Crispy fries served with dip', 145.00, 'Sides', 'veg', '/src/assets/fries.jpeg', FALSE, FALSE, FALSE, FALSE),
('Nachos', 'Cheese-loaded corn chips with jalapeño & salsa', 300.00, 'Appetizers', 'veg', '/src/assets/nacho.jpg', FALSE, TRUE, FALSE, FALSE),
('Napolitan Pizza', 'Thin crust pizza with fresh tomato and mozzarella', 600.00, 'Pizza', 'veg', '/src/assets/napolitan_pizza.jpg', FALSE, FALSE, TRUE, FALSE),

-- Non-Vegetarian Items
('Chicken Sandwich', 'Grilled/crispy chicken in bun with mayo & lettuce', 300.00, 'Sandwiches', 'non-veg', '/src/assets/chicken_sandiwch.jpeg', FALSE, FALSE, TRUE, FALSE),
('Chicken Burger', 'Juicy chicken patty, cheese & sauce', 350.00, 'Burgers', 'non-veg', '/src/assets/chicken_burger.jpeg', FALSE, FALSE, TRUE, FALSE),
('Chicken Roll', 'Paratha wrapped spicy shredded chicken', 250.00, 'Rolls', 'non-veg', '/src/assets/chicken_roll.jpg', FALSE, TRUE, TRUE, FALSE),
('Chicken Momo', 'Steamed chicken dumplings with sauce', 180.00, 'Appetizers', 'non-veg', '/src/assets/momo.jpg', TRUE, FALSE, TRUE, FALSE),
('American Pizza', 'Thick crust loaded with chicken & veggies', 600.00, 'Pizza', 'non-veg', '/src/assets/american_pizza.jpg', FALSE, FALSE, TRUE, FALSE),

-- Beverages
('Macchiato', 'Espresso with a dash of frothy milk, bold and smooth', 180.00, 'Beverages', 'beverages', '/src/assets/macchiato.webp', FALSE, FALSE, FALSE, TRUE),
('Espresso', 'Rich and intense single shot of coffee', 120.00, 'Beverages', 'beverages', '/src/assets/espresso.webp', FALSE, FALSE, FALSE, TRUE),
('Mocha', 'Chocolate-flavored coffee with steamed milk and whipped cream', 200.00, 'Beverages', 'beverages', '/src/assets/mocha.png', FALSE, FALSE, FALSE, TRUE),
('Cappuccino', 'Classic Italian coffee with equal parts espresso, steamed milk, and foam', 170.00, 'Beverages', 'beverages', '/src/assets/cappuccino.jpg', FALSE, FALSE, FALSE, TRUE),
('Americano', 'Espresso diluted with hot water for a lighter taste', 150.00, 'Beverages', 'beverages', '/src/assets/americano.jpeg', FALSE, FALSE, FALSE, TRUE),
('Latte', 'Smooth blend of espresso and steamed milk, topped with foam', 190.00, 'Beverages', 'beverages', '/src/assets/latte.jpg', FALSE, FALSE, FALSE, TRUE);

-- Insert specials
INSERT INTO specials (item_name, description, price, image_url) VALUES
('South Indian Idli Platter', 'Soft, fluffy idlis served with coconut chutney and sambar for an authentic South Indian breakfast experience', 350.00, '/src/assets/idli.webp'),
('Chicken Burrito Wrap', 'Juicy chicken, beans, veggies, and cheese wrapped in a warm tortilla, served with salsa. A fusion favorite!', 480.00, '/src/assets/chicken_burrito_wrap.jpg'),
('Thakali Khana Set', 'Traditional Nepali thali with rice, dal, vegetables, pickles, and your choice of curry. A wholesome, hearty meal', 600.00, '/src/assets/thakali_khana_set.jpg'),
('Chicken Matka Biriyani', 'Aromatic basmati rice and tender chicken slow-cooked in a clay pot, infused with rich spices and herbs', 550.00, '/src/assets/chicken_matka_biriyani.jpg');

-- Insert sample staff
INSERT INTO staff (name, position, photo_url) VALUES
('Sarah Johnson', 'Head Barista', '/src/assets/staff/sarah.jpg'),
('Mike Chen', 'Kitchen Manager', '/src/assets/staff/mike.jpg'),
('Emma Davis', 'Server', '/src/assets/staff/emma.jpg'),
('Alex Rodriguez', 'Cashier', '/src/assets/staff/alex.jpg'); 




