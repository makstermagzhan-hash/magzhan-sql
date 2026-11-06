CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE venues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL
);

CREATE TABLE concerts (
    id SERIAL PRIMARY KEY,
    artist_id INTEGER REFERENCES artists(id),
    venue_id INTEGER REFERENCES venues(id),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    concert_date TIMESTAMP NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    image TEXT,
    total_tickets INTEGER NOT NULL,
    available_tickets INTEGER NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    concert_id INTEGER REFERENCES concerts(id),
    quantity INTEGER NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    ticket_code VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(30) DEFAULT 'active'
);

INSERT INTO artists (name, description) VALUES
('RaiM', 'Қазақстандық әнші'),
('Moldanazar', 'Қазақстандық инди орындаушы'),
('Ninety One', 'Қазақстандық Q-pop тобы');

INSERT INTO venues (name, address) VALUES
('Алматы Арена', 'Алматы қаласы'),
('Орталық стадион', 'Алматы қаласы'),
('Балуан Шолақ сарайы', 'Алматы қаласы');

INSERT INTO concerts
(artist_id, venue_id, title, description, concert_date,
 price, image, total_tickets, available_tickets)
VALUES
(1, 1, 'RaiM Concert', 'RaiM концертіне қош келдіңіз!',
 '2026-12-20 19:00', 8000, '', 1000, 1000),

(2, 2, 'Moldanazar Live', 'Moldanazar жанды концерті',
 '2026-12-25 19:00', 10000, '', 1500, 1500),

(3, 3, 'Ninety One Show', 'Ninety One үлкен шоуы',
 '2027-01-10 18:00', 12000, '', 2000, 2000);