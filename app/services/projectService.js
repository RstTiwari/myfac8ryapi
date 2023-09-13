const ProjectModal = require("../modal/ProjectModal.js")

const ProjectService = {
  addProject: async function (payload) {
    let data = null;
    try {
      data = new ProjectModal(payload);
      await data.save();
    } catch (error) {
      console.error(error);
    }
    return data;
  },
  getProject: async function (filter) {
    let data = null;
    try {
      data = await ProjectModal.find(filter).limit().lean();
    } catch (error) {
      console.error(error);
    }
    return data;
  },
  getSingleProject:async function (filter){
    let data = null
    try {
      data = await ProjectModal.findOne(filter).lean()
    } catch (error) {
      console.error(error)
    }
    return data
  }
};

module.exports = ProjectService;
