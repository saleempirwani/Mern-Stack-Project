const express = require("express");
require("dotenv").config();
require("./src/db");

const PORT = process.env.PORT | 3000;

const app = express();

app.use(express.json());

app.use("/api/users", require("./src/routes/user"));
app.use("/api/products", require("./src/routes/products"));
app.use("/api/carts", require("./src/routes/cart"));
app.use("/api/orders", require("./src/routes/order"));
app.use("/api/stripe", require("./src/routes/stripe"));

app.listen(PORT, () => console.log(`Listening at: http://localhost:${PORT}`));
