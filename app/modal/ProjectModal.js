const mongoose = require("mongoose")

const ProjectSchema = mongoose.Schema({
  projectId: { type: "Number", required: true },
  title: { type: "String", required: true },
  description: { type: "String", required: true },
  images: [{ type: "String", required: true }],
  components: [{ type: "String", required: true }],
  advantages: [{ type: "String", required: true }],
  price: { type: "Number", required: true },
  projectType: { type: "String", required: true },
});

module.exports = mongoose.model("projects",ProjectSchema)