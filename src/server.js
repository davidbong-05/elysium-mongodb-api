const express = require("express");
const dotenv = require("dotenv").config();

const app = express();

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
