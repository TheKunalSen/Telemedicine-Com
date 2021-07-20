const mongoose = require("mongoose");
const UserSchemafordoctors = new mongoose.Schema(
	{
		username: { type: "string", required: true, unique: true },
		password: { type: "string", required: true },
		firstname: { type: "string", required: true },
		lastname: { type: "string", required: true },
		number: { type: "string", required: true, unique: true},
		UserType: { type: "string", required: true}
	},
	{ collection: "doctors" }
);

const model = mongoose.model("UserSchemafordoctors", UserSchemafordoctors);
module.exports = model;
