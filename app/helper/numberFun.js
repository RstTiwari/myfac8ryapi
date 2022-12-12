const helper = {
  getNumber: (type) => {
    let enquiry = 1000;
    if ((type = "enquiryId")) return enquiry + 1;
  },
};

module.exports = helper