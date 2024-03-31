const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const basicAuth = require('express-basic-auth');
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 8080;
const uri = process.env.MONGO_URI;
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

// Middleware
app.use(cors());
const auth = basicAuth({
	authorizer: (key, secret) => {
		return (key == apiKey) && secret == apiSecret;
	},
	unauthorizedResponse: () => {
		return 'Unauthorized';
	},
});
app.use(bodyParser.json());

// Routes
const UserRoutes = require("./routes/api/user.route");
const CartRoutes = require("./routes/api/cart.route");
const CollectionsRoutes = require("./routes/api/nftCollection.route");
app.use("/api/user", auth, UserRoutes);
app.use("/api/cart", auth, CartRoutes);
app.use("/api/collection", auth, CollectionsRoutes);

mongoose
	.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB database Connected..."))
	.catch((err) => console.log(err));

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
