const mongoose = require("mongoose");
const StaffSchema = new mongoose.Schema(
	{
		username: { type: "string", required: true, unique: true },
		password: { type: "string", required: true },
		firstname: { type: "string", required: true },
		lastname: { type: "string", required: true },
		number: { type: "string", required: true, unique: true},
		UserType: { type: "string", required: true}
	},
	{ collection: "staff" }
);

const model = mongoose.model("StaffSchema", StaffSchema);
module.exports = model;
