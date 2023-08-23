const express = require("express");
const express_fileUpload = require("express-fileupload");
const cloudinary = require("./config/cloudinary");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(
  express_fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Route
const blogroute = require("./routes/blogroute");
app.use("/api/v1", blogroute);

//database
const dbconnect = require("./config/database");
dbconnect();

//cloudinary;
cloudinary.cloudinaryConnect();

app.listen(PORT, () => {
  console.log(`Server has started at ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("<h1>This is the HomePage</h1>");
});
