// database: LaundryKu
// Dikerjakan oleh: Ananda Wirajaya
// NIM: 2410501111
// Tanggal: 16 Juni 2026

-- Jalankan di phpMyAdmin tab SQL
CREATE DATABASE IF NOT EXISTS laundry_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE laundry_db;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','customer') DEFAULT 'customer',
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  customer_code VARCHAR(20) UNIQUE,
  total_orders INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price_per_kg DECIMAL(10,2),
  price_per_item DECIMAL(10,2),
  unit ENUM('kg','item','set') DEFAULT 'kg',
  estimated_days INT DEFAULT 2,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  position VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_code VARCHAR(30) UNIQUE NOT NULL,
  customer_id INT NOT NULL,
  employee_id INT,
  order_date DATE NOT NULL,
  pickup_date DATE,
  estimated_done DATE,
  done_date DATE,
  status ENUM('pending','processing','washing','drying','ironing','done','delivered','cancelled') DEFAULT 'pending',
  notes TEXT,
  total_amount DECIMAL(10,2) DEFAULT 0,
  payment_status ENUM('unpaid','paid') DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  service_id INT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id)
);

CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('cash','transfer','qris') DEFAULT 'cash',
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE expenses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(50),
  expense_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key_name VARCHAR(100) UNIQUE NOT NULL,
  value TEXT
);

-- Admin default (password: admin123)
INSERT INTO users (name, email, password, role, phone) VALUES
('Admin LaundryKu', 'admin@laundry.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lihO', 'admin', '081234567890');

-- Services default
INSERT INTO services (name, description, price_per_kg, price_per_item, unit, estimated_days) VALUES
('Cuci Reguler', 'Cuci + pengeringan standar', 7000, NULL, 'kg', 3),
('Cuci Ekspres', 'Selesai dalam 1 hari', 12000, NULL, 'kg', 1),
('Cuci + Setrika', 'Cuci bersih dan disetrika rapi', 10000, NULL, 'kg', 3),
('Setrika Saja', 'Hanya setrika pakaian', NULL, 3000, 'item', 1),
('Dry Cleaning', 'Pencucian khusus bahan halus', NULL, 25000, 'item', 4),
('Cuci Sepatu', 'Cuci sepatu bersih dan wangi', NULL, 35000, 'item', 3),
('Cuci Selimut', 'Cuci selimut/bed cover', NULL, 20000, 'item', 3),
('Cuci Jas/Blazer', 'Cuci pakaian formal', NULL, 30000, 'item', 4);

-- Employees default
INSERT INTO employees (name, phone, position) VALUES
('Budi Santoso', '081111111111', 'Operator'),
('Siti Rahayu', '082222222222', 'Kasir'),
('Ahmad Fauzi', '083333333333', 'Kurir');

-- Settings default
INSERT INTO settings (key_name, value) VALUES
('shop_name', 'LaundryKu'),
('shop_address', 'Jl. Raya No. 1, Jakarta'),
('shop_phone', '021-1234567'),
('min_weight_kg', '1'),
('whatsapp_number', '6281234567890');
