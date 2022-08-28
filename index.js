const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const { notFoundError } = require("./middlewares/notFoundError");
const { errorHandler } = require("./middlewares/errorHandler");
const http = require("http");

/*** config dotenv  ***/
dotenv.config();

/*** config mongoose ***/
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on("connected", () => {
  console.log("Database connected");
});
mongoose.connection.on("error", () => {
  console.log("Database is not connected");
});
const app = express();

//add socket.io
const server = http.createServer(app);
const io = require("socket.io")(server);

/*** middlewares ***/
app.use(cors());
app.use(express.json());
app.use(
  "/images",
  express.static(path.join(__dirname, "client/public/images"))
);

/*** routes ***/
//import
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

if (process.env_NODE_ENV === "production") {
  app.use(express.static("client/build"));
  //front quest, take a look inside client/build
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
  //serve index.html
}

/*** NOT FOUND ERROR  ***/
app.use(notFoundError);

/*** ERROR HANDLER ***/
app.use(errorHandler);

//webSocket connection
var adminSocketid = false;
io.on("connection", (socket) => {
  socket.on("adminSocket", () => {
    adminSocketid = socket.id;
    socket.emit("displayCounter", io.engine.clientsCount);
  });
  if (adminSocketid && socket.id !== adminSocketid)
    io.to(adminSocketid).emit("displayCounter", io.engine.clientsCount);

  socket.on("disconnect", () =>
    socket.id === adminSocketid
      ? (adminSocketid = false)
      : io.to(adminSocketid).emit("displayCounter", io.engine.clientsCount)
  );
});

/*** PORT ***/
const PORT = process.env.PORT || 5000;
server.listen(PORT, console.log(`app running port ${PORT}`));
