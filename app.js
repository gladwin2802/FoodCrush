const express = require("express");
const mysql = require("mysql");
const app = express();
const path = require("path");
const hbs = require("hbs");
const helpers = require("./helpers.js");
const { groupOrdersByDate } = require('./helpers');

require("dotenv").config();

// my sql connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
});

db.connect((err) => {
    if (err) console.log(err);
    else console.log("My SQL connection success!!");
});

app.use(express.static(path.join(__dirname, "./public")));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));

hbs.registerHelper(helpers);
hbs.registerPartials(path.join(__dirname, "views/partials"));

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.get("/home/:userid", (req, res) => {
    const userid = req.params.userid;
    db.query("select * from users where id=?", [userid], async (error, result) => {
        if (error) {
            return res.status(500).send("Internal Server Error");
        }
        return res.render("home", { userdetails: result[0] });
    });
});

app.get("/products/:userid", (req, res) => {
    const userid = req.params.userid;
    db.query("SELECT * FROM users where ID = ?", [userid], (error, userdetails) => {
        if (error) {
            return res.status(500).send("Internal Server Error");
        }
        db.query("SELECT * FROM products ORDER BY rand()", (error, rows) => {
            if (error) {
                return res.status(500).send("Internal Server Error");
            }
            return res.render("products", { products: rows, userdetails: userdetails[0] });
        });
    });
});

app.get("/productdetails/:userid/:id", (req, res) => {
    const productId = req.params.id;
    const userid = req.params.userid;
    db.query("SELECT * FROM users where ID = ?", [userid], (error, userdetails) => {
        if (error) {
            return res.status(500).send("Internal Server Error");
        }
        db.query("SELECT * FROM products where pid=?", [productId], (error, results) => {
            if (error) {
                return res.status(500).send("Internal Server Error");
            }
            if (results.length === 0)
                return res.status(404).send("Product not found");
            res.render("productdetails", {
                product: results[0],
                userdetails: userdetails[0],
            });
        });
    });
});

app.get("/cartInsert/:userid/:pid", (req, res) => {
    const productId = req.params.pid;
    const userid = req.params.userid;
    const quantity = req.query.quantity;
    const successMessage = "Added to cart successfully!"
    db.query("select * from cart where userid = ? and pid = ?", [userid, productId], (error, results) => {
        if (error) {
            return res.status(500).send("Internal Server Error");
        }
        if (results.length === 0) {
            db.query("insert into cart (userid, pid, quantity) values(?,?,?)", [userid, productId, quantity], (error, results) => {
                if (error) {
                    return res.status(500).send("Internal Server Error");
                }
            });
        }
        else {
            db.query("delete from cart where userid = ? and pid = ?", [userid, productId], (error) => {
                if (error) {
                    return res.status(500).send("Internal Server Error");
                }
                else {
                    db.query("insert into cart (userid, pid, quantity) values(?,?,?)", [userid, productId, quantity], (error, results) => {
                        if (error) {
                            return res.status(500).send("Internal Server Error");
                        }
                    });
                }
            });
        }
        db.query("SELECT * FROM users where ID = ?", [userid], (error, userdetails) => {
            if (error) {
                return res.status(500).send("Internal Server Error");
            }
            db.query("SELECT * FROM products where pid=?", [productId], (error, results) => {
                if (error) {
                    return res.status(500).send("Internal Server Error");
                }
                if (results.length === 0)
                    return res.status(404).send("Product not found");
                return res.render("productdetails", {
                    product: results[0],
                    userdetails: userdetails[0],
                    successMessage: successMessage
                })
            });
        });
    });
});

app.get("/cartDelete/:userid/:pid", (req, res) => {
    const userid = req.params.userid;
    const productId = req.params.pid;
    db.query("delete from cart where userid = ? and pid = ?", [userid, productId], (error) => {
        if (error) {
            return res.status(500).send("Internal Server Error");
        }
        res.redirect(`/cart/${userid}`);
    });
});

app.get("/cart/:userid", (req, res) => {
    const userid = req.params.userid;
    db.query("SELECT * FROM users where ID = ?", [userid], (error, userdetails) => {
        if (error) {
            return res.status(500).send("Internal Server Error");
        }
        db.query(
            "SELECT id, userid, pid, quantity, pname, price\
                FROM cart\
                NATURAL JOIN products\
                WHERE userid = ?; ", [userid], (error, results) => {
            if (error) {
                return res.status(500).send("Internal Server Error");
            }
            return res.render("cart", {
                products: results,
                userdetails: userdetails[0]
            });
        });
    }
    );
});

app.get("/ordersInsert/:userid", (req, res) => {
    const userid = req.params.userid;
    db.query(
        "SELECT id, userid, pid, quantity, pname, price \
        FROM cart \
        NATURAL JOIN products \
        WHERE userid = ?;", [userid], (error, results) => {
        if (error) {
            return res.status(500).send("Internal Server Error");
        }
        const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
        const orderItems = results.map((item) => {
            return [userid, item.pid, item.quantity, currentDate];
        });
        db.query("INSERT INTO orders (userid, pid, quantity, orderdate) VALUES ?", [orderItems], (error) => {
            if (error) {
                return res.status(500).send("Internal Server Error");
            }
        });
        db.query("DELETE FROM cart WHERE userid = ?", [userid], (error) => {
            if (error) {
                return res.status(500).send("Internal Server Error");
            }
        });
        return res.redirect(`/orders/${userid}`);
    });
});

app.get("/orders/:userid", (req, res) => {
    const userid = req.params.userid;
    db.query("SELECT * FROM users WHERE ID = ?", [userid], (error, userdetails) => {
        if (error) {
            return res.status(500).send("Internal Server Error");
        }
        db.query(
            "SELECT id, userid, pid, quantity, category, pname, price, orderdate \
            FROM orders \
            NATURAL JOIN products \
            WHERE userid = ? \
            ORDER BY orderdate DESC", [userid], (error, rows) => {
            if (error) {
                return res.status(500).send("Internal Server Error");
            }
            if (rows.length === 0) {
                return res.render("orders", {
                    products: [],
                    userdetails: userdetails[0]
                });
            }
            // Group the rows by orderdate
            const groupedOrders = groupOrdersByDate(rows);
            return res.render("orders", {
                products: groupedOrders,
                userdetails: userdetails[0]
            });
        });
    });
});

app.get("/addToWishlist/:userid/:pid", (req, res) => {
    const productId = req.params.pid;
    const userid = req.params.userid;
    var successMessage = "Error connecting... Retry !!!";
    db.query("select * from wishlist where userid = ? and pid = ?", [userid, productId], (error, results) => {
        if (error) {
            return res.status(500).send("Internal Server Error");
        }
        if (results.length === 0) {
            db.query("insert into wishlist (userid, pid, liked) values(?,?,1)", [userid, productId], (error) => {
                if (error) {
                    return res.status(500).send("Internal Server Error");
                }
                successMessage = "Added to wishlist successfully!"
                db.query("update products set liked = 1 where pid = ?", [productId], (error) => {
                    if (error) {
                        return res.status(500).send("Internal Server Error");
                    }
                });
            });
        }
        else {
            db.query("delete from wishlist where userid = ? and pid = ?", [userid, productId], (error) => {
                if (error) {
                    return res.status(500).send("Internal Server Error");
                }
                successMessage = "Removed from wishlist successfully !!!"
                db.query("update products set liked = 0 where pid = ?", [productId], (error) => {
                    if (error) {
                        return res.status(500).send("Internal Server Error");
                    }
                });
            });
        }
        db.query("SELECT * FROM users where ID = ?", [userid], (error, userdetails) => {
            if (error) {
                return res.status(500).send("Internal Server Error");
            }
            db.query("SELECT * FROM products where pid=?", [productId], (error, results) => {
                if (error) {
                    return res.status(500).send("Internal Server Error");
                }
                if (results.length === 0) {
                    return res.status(404).send("Product not found");
                }
                return res.render("productdetails", {
                    product: results[0],
                    userdetails: userdetails[0],
                    successMessage: successMessage
                });
            });
        });

    });
});

app.get("/wishlist/:userid", (req, res) => {
    const userid = req.params.userid
    db.query("SELECT * FROM users where ID = ?", [userid], (error, userdetails) => {
        if (error) {
            return res.status(500).send("Internal Server Error");
        }
        db.query(
            "SELECT w.pid, p.pname, p.price, p.rating, w.liked, p.category FROM \
            (select * from wishlist where userid = ?) as w inner join products as p \
            on w.pid = p.pid;", [userid], (error, results) => {
            if (error) {
                return res.status(500).send("Internal Server Error");
            }
            return res.render("wishlist", { products: results, userdetails: userdetails[0] });
        });
    });
});

app.listen(5000, () => {
    console.log("Server started at port 5000");
});