require("dotenv").config();
require("./db");

const express = require("express");

const app = express();
app.use(express.json())

const PORT = process.env.PORT | 3000;

app.use("/users", require("./routes/user"));

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
