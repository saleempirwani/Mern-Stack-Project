const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,    
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((e) => {
    console.log("ERR ==============> ", e.message);
  });
