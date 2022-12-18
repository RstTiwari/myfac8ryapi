
const nodeMailer = require("nodemailer");
const jwt = require("jsonwebtoken")
const fs = require("fs");
const saltRounds = 10;

const User = require("../modal/userModel");
const userService = require("../services/userServices");
const bycrypt = require("bcrypt");
const  { google } = require("googleapis") 



const userController = {
  getUser: async function (req, res) {
    let data = await User.find();
    let response = {
      success: 1,
      message: data,
    };
    res.send(response);
  },
  signupUser: async function (req, res) {
    const { companyName, name, email, number, password } = req.body;
    let response = {};
    try {
      if (!companyName || !name || !email || !number || !password) {
        throw new Error("Please provide all details");
      }

      // checking if email alredy exist
      let emailExist = await userService.checkUserExist({ email });
      if (emailExist) throw new Error("Email alredy used");

      // checking if Phone alredy exist
      let numberExist = await userService.checkUserExist({ number });
      if (numberExist) throw new Error("Number alredy used");

      // bycrypting the password
      let hashPassword = bycrypt.hashSync(password, saltRounds);

      // creating userId

      // creating user Object
      let user = {
        companyName: companyName,
        name: name,
        email: email,
        number: number,
        password: hashPassword,
      };
      let newUser = await userService.signup(user);
      if (!newUser) {
        throw new Error("Couldn't signup pls try again");
      }
      response = {
        success: 1,
        message: "User created Succesfully",
      };
    } catch (error) {
      response = {
        success: 0,
        message: `${error.message}`,
      };
      console.log(error);
    }
    res.send(response);
  },
  loginUser: async function (req, res) {
    const { email, password } = req.body;
    let response = {};
    try {
      if (!email || !password) {
        throw new Error("Pls provide all details for login");
      }
      let filter = { email };
      let user = await userService.loginUser(filter);
      if (!user) {
        throw new Error("No user with this email , pls signup for login");
      }
      let savePassword = user.password;
      //comparing the password
      let isPasswordMatch = bycrypt.compareSync(password, savePassword);

      if (!isPasswordMatch) throw new Error("wrong email or password");
      
      // creating Token for the login
      let token = jwt.sign({ payload: user }, "meeraki", {
        expiresIn: "5h",
      });

      response = {
        success: 1,
        message: "logged in successfully",
        token: token,
        user: user,

      };
    } catch (error) {
      response = {
        success: 0,
        message: `${error.message}`,
      };
      console.log(error);
    }
    res.send(response);
  },
  sendFile: async function (req, res) {
       try {
        if (!req.file) {
          res.status(400).send("No file uploaded.");
          return;
        }

      // number defined for setting enquiryId
      let counterData = await userService.getCounter("enquiry")
      let fileName = `${counterData.counterSeq}/${req.file.originalname}`;

      // now saving the data on db

      let obj = {
        enquiryId: counterData.counterSeq,
        fileName: fileName,
      }

      const auth = userController.authenticateGoogle();
      const response = await userController.uploadToGoogleDrive(req.file,fileName, auth);
      if(response.success = 200){
        let enquiryData = await userService.enquiryFile(obj);
        if (enquiryData.length < 1) throw new Error("File could not be saved")
        // sending us mail of enquiry
        let tranporter = nodeMailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user:"info.myfac8ry@gmail.com",
            pass:"qanbmwhykokzjxut"
  
          },
        });
  
        let info = await tranporter.sendMail({
          from: "info.myfac8ry@gmail.com",
          to: "info.myfac8ry@gmail.com",
          subject: " myfac8ry enquiry  Mail",
          text: "Recived an enquiry mail",
          attachments: [
            {
              path:req.file.path, 
            },
          ],
        });
        if(info.response = "250 2.0.0 OK  1671384732 c12-20020a170903234c00b0017ec1b1bf9fsm5325160plh.217 - gsmtp"){
          res.send({
            success: 1,
            message: "Enquiry created Succesfull !!",
          });
        }
        

        userController.deleteFile(req.file.path);

      }else{
        throw "File could not be uploaded"
      }
    } catch (error) {
      console.log("Error in parsing file", error);
      return res.send({
        status: 0,
        message: "There was an error parsing the files",
      });
    }
  },
   authenticateGoogle :() => {
    const auth = new google.auth.GoogleAuth({
      keyFile: `/home/rstpersonal/myfac8ry/myfac8ryapi/myfac8ry.json`,
      scopes: "https://www.googleapis.com/auth/drive",
    });
    return auth;
  },
  uploadToGoogleDrive : async (file,fileName, auth) => {
    const fileMetadata = {
      name: fileName,
      parents: ["11TrC4SBNy62qxd0wTDGxHr8391e9isHU"], // Change it according to your desired parent folder id
    };
  
    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };
  
    const driveService = google.drive({ version: "v3", auth });
  
    const response = await driveService.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });
    return response;
  },
  deleteFile:(filePath) => {
    fs.unlink(filePath, () => {
      console.log("file deleted");
    });
  }

};
module.exports = userController;
