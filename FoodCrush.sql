create database login_crud;
use login_crud;

create table users(
ID int auto_increment primary key,
NAME varchar(100),
EMAIL varchar(100),
PASS varchar(200)
);

select * from users;

create table products(
pid int auto_increment primary key,
pname varchar(30),
price float,
rating int,
description varchar(100),
details varchar(400),
liked int,
category varchar(50)
);

drop table products;
update products set description='Red printed T-Shirt by HRX',details='The HRX Mens Active t-shirt is the perfect addition to your fall wardrobe. This basic T-shirt is easy to style for workouts as well as casual evenings.' where pid>=1 and pid<=8; 

select * from products;
truncate products;

INSERT INTO products (pid, pname, price, rating, description, details, liked, category)
VALUES (1, 'Dosa', 50.0, 4, 'Delicious Dosa', 'A classic South Indian dish made from fermented rice and lentil batter, cooked to perfection on a griddle. It is often served with sambar and chutney. Enjoy the crispy and flavorful experience of a well-made dosa.', 0, 'veg');

INSERT INTO products (pid, pname, price, rating, description, details, liked, category)
VALUES (2, 'Idly', 30.0, 4, 'Soft Idly', 'Steamed rice cakes made from fermented rice and lentil batter, a popular breakfast item in South India. Idlies are soft, fluffy, and usually served with chutney and sambar. They make for a healthy and filling meal.', 0, 'veg');

INSERT INTO products (pid, pname, price, rating, description, details, liked, category)
VALUES (3, 'Curd Rice', 40.0, 4, 'Creamy Curd Rice', 'Curd rice, also known as thayir sadam, is a comforting dish made with cooked rice mixed with yogurt, tempered with spices, and garnished with herbs. It is a popular dish in South Indian cuisine, known for its cooling and soothing properties.', 0, 'veg');

INSERT INTO products (pid, pname, price, rating, description, details, liked, category)
VALUES (4, 'Chappathi', 40.0, 3, 'Thin Chappathi', 'Chappathi is a thin and soft whole wheat flatbread cooked on a griddle. It is a staple in Indian cuisine and is often enjoyed with curries, gravies, or as a wrap with various fillings. Chappathis are versatile and make for a satisfying meal.', 0, 'veg');

INSERT INTO products (pid, pname, price, rating, description, details, liked, category)
VALUES (5, 'Chicken Biryani', 150.0, 5, 'Flavorful Chicken Biryani', 'Chicken Biryani is a classic Indian rice dish cooked with basmati rice, aromatic spices, and succulent chicken. Each grain of rice is infused with the rich flavors of spices, creating a fragrant and mouthwatering dish. It is a favorite among biryani lovers.', 0, 'non veg');

INSERT INTO products (pid, pname, price, rating, description, details, liked, category)
VALUES (6, 'Mutton Biryani', 180.0, 4, 'Rich Mutton Biryani', 'Mutton Biryani is a luxurious and flavorful rice dish prepared with basmati rice, aromatic spices, and tender mutton. The slow cooking process allows the meat to become tender and juicy, while the spices infuse the rice with exquisite flavors.', 0, 'non veg');

INSERT INTO products (pid, pname, price, rating, description, details, liked, category)
VALUES (7, 'Parotta', 60.0, 4, 'Layered Parotta', 'Parotta is a multi-layered flatbread made with all-purpose flour. It is flaky, soft, and has a distinct texture. Parottas are usually served with curry or side dishes, and they make for a satisfying and delicious meal.', 0, 'veg');

INSERT INTO products (pid, pname, price, rating, description, details, liked, category)
VALUES (8, 'Chicken Burger', 80.0, 4, 'Juicy Chicken Burger', 'Chicken Burger is a delicious burger made with a tender chicken patty, topped with fresh veggies and sauces, served in a bun. It is a popular fast food choice, known for its juicy flavors and satisfying taste.', 0, 'non veg');

INSERT INTO products (pid, pname, price, rating, description, details, liked, category)
VALUES (9, 'Pizza', 120.0, 5, 'Irresistible Pizza', "Pizza is a classic Italian dish consisting of a round, baked dough base topped with sauce, cheese, and various toppings. It is a universally loved food, known for its versatility and deliciousness. Whether you prefer a classic Margherita or a loaded Meat Lover's pizza, there's a pizza for everyone.", 0, 'non veg');

INSERT INTO products (pid, pname, price, rating, description, details, liked, category)
VALUES (10, 'Puri', 30.0, 4, 'Crispy Puri', 'Puri is a puffed, golden-brown bread made from whole wheat flour. It is deep-fried until it becomes light and airy. Puris are often served with flavorful curries or enjoyed on their own. They are a popular choice for breakfast or festive meals.', 0, 'veg');

INSERT INTO products (pid, pname, price, rating, description, details, liked, category)
VALUES (11, 'Chicken 65', 100.0, 4, 'Spicy Chicken 65', 'Chicken 65 is a spicy and flavorful dish made with bite-sized chicken pieces marinated with aromatic spices. The chicken is deep-fried until crispy and then garnished with herbs and curry leaves. It is a popular appetizer or side dish that packs a punch of flavors.', 0, 'non veg');



CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userid INT,
  pid INT,
  quantity INT,
  FOREIGN KEY (userid) REFERENCES users(ID),
  FOREIGN KEY (pid) REFERENCES products(pid)
);

drop table cart;
select * from cart;

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userid INT,
  pid INT,
  quantity INT,
  orderdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userid) REFERENCES users(ID),
  FOREIGN KEY (pid) REFERENCES products(pid)
);

select * from orders;
drop table orders;
delete from orders where userid = 1;

CREATE TABLE IF NOT EXISTS wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userid INT,
  pid INT,
  liked INT,
  FOREIGN KEY (userid) REFERENCES users(ID),
  FOREIGN KEY (pid) REFERENCES products(pid)
);
drop table wishlist;
select * from wishlist;