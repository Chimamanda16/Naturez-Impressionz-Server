import mongoose from "mongoose";

const userAgentSchema = new mongoose.Schema({
    name: String,
});

const Agent = mongoose.model("Agent", userAgentSchema);

export default Agent;