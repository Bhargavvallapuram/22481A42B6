const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const urlRoutes = require("./routes/urlRoutes");


const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use("/shorturls", urlRoutes);

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));