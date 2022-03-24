const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("config");
const genreRouter = require("./routes/genreRoutes");
const customerRouter = require("./routes/customerRoutes");
const movieRouter = require("./routes/movieRoutes");
const rentalRouter = require("./routes/rentalRoutes");
const userRouter = require("./routes/userRoutes");
const port = process.env.PORT || 3000;

mongoose
  .connect(config.get("DB_Connection"))
  .then(() => {
    console.log("Connected to Movie_rental DB");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(express.json());
app.use("/api/genres", genreRouter);
app.use("/api/customers", customerRouter);
app.use("/api/movies", movieRouter);
app.use("/api/rentals", rentalRouter);
app.use("/api/users", userRouter);
app.listen(port, () => {
  console.log(`Server is up an running on ${port}`);
});
