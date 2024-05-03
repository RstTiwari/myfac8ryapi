const User = require("../modal/userModel");
const userService = require("../services/userServices");
const ProjectService = require("../services/projectService");
const bycrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const saltRounds = 10;

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
        const { companyName, name, email, number, password, industryType } =
            req.body;
        let response = {};
        try {
            if (
                !companyName ||
                !name ||
                !email ||
                !number ||
                !password ||
                !industryType
            ) {
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

            let today = parseInt(Date.now() / 1000);
            let user = {
                companyName: companyName,
                name: name,
                email: email,
                number: number,
                password: hashPassword,
                industryType: industryType,
                createdAt: today,
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
        console.log(email, password);
        let response = {};
        try {
            if (!email || !password) {
                throw new Error("Pls provide all details for login");
            }
            let filter = { email };
            let user = await userService.loginUser(filter);
            if (!user) {
                throw new Error(
                    "No user with this email , pls signup for login"
                );
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
        console.log(response);
        res.send(response);
    },

    userEqnquiry: async function (req, res) {
        try {
            const { userid } = req.headers;
            Number(userid);

            if (!req.file) {
                throw new Error("No attached File Find");
            }

            if (!userid || userid < -1) {
                throw new Error("please Provide valid useId");
            }

            let enquiryNo = parseInt(Date.now() / 1000);

            // getting the user Details;
            let userFilter = { number: userid };
            let user = await userService.checkUserExist(userFilter);
            const { companyName, email } = user;

            // sending us mail of enquiry
            let tranporter = await nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.GMID,
                    pass: process.env.GPASS,
                },
                from: "info.myfac8ry@gmail.com",
            });

            let info = await tranporter.sendMail({
                from: "info.myfac8ry@gmail.com",
                to: email,
                subject: "Verify your email | Myfac8ry ",
                text: `AI is on work For You,${companyName} your quotation for ${enquiryNo} is on way pls be pateints `,
                attachments: [
                    {
                        path: req.file.path,
                    },
                ],
            });

            if (
                (info.response =
                    "250 2.0.0 OK  1671384732 c12-20020a170903234c00b0017ec1b1bf9fsm5325160plh.217 - gsmtp")
            ) {
                let Obj = {
                    enquiryNo: enquiryNo,
                    companyName: companyName,
                };
                await userService.createEnquiry(Obj);

                res.send({
                    success: 1,
                    message: "Enquiry created Succesfull !!",
                });
            }

            fs.unlinkSync(req.file.path);
        } catch (error) {
            console.error(error);
            res.send({
                success: 0,
                message: error.message,
            });
            fs.unlinkSync(req.file.path);
        }
    },
    getProjectList: async function (req, res) {
        try {
            const { projectType, price } = req.body;
            console.log(projectType, price);
            if (!projectType) {
                throw new Error("please provide valid Project Type");
            }
            let projectFilter = { projectType: projectType };
            if (price) {
                projectFilter["price"] = { $lte: price };
            }
            console.log(projectFilter);
            let projectData = await ProjectService.getProject(projectFilter);
            if (projectData.length < 1) {
                throw new Error("no projects Found");
            }
            let response = {
                success: 1,
                data: projectData,
            };
            res.send(response);
        } catch (error) {
            console.error(error);
            let response = {
                success: 0,
                data: [],
                message: error.message,
            };
            res.send(response);
        }
    },
    addProject: async function (req, res) {
        try {
            const {
                projectType,
                title,
                description,
                price,
                images,
                components,
                advantages,
            } = req.body;
            if (
                !projectType ||
                !title ||
                !description ||
                !price ||
                !components ||
                !advantages
            ) {
                throw new Error("please provide all Data");
            }

            let newObj = {
                projectId: parseInt(Date.now() / 1000),
                title: title,
                description: description,
                projectType: projectType,
                price: price,
                images: images,
                components: components,
                advantages: advantages,
            };
            let projectData = await ProjectService.addProject(newObj);
            if (!projectData) {
                throw new Error("failed to add Project");
            }
            let response = {
                success: 1,
                data: projectData,
            };
            res.send(response);
        } catch (error) {
            console.error(error);
            let response = {
                success: 0,
                data: [],
                message: error.message,
            };
            res.send(response);
        }
    },
    getSingleProject: async function (req, res) {
        try {
            const { projectId } = req.body;
            let filter = { projectId: Number(projectId) };
            let data = await ProjectService.getSingleProject(filter);
            if (!data) {
                throw new Error("failed to find Project");
            }

            let response = {
                success: 1,
                data: data,
            };
            res.send(response);
        } catch (error) {
            console.error(error);
            let response = {
                success: 0,
                data: [],
                message: error.message,
            };
            res.send(response);
        }
    },

    bestSellingProject: async function (req, res) {
        try {
            let filter = { bestSelling: 1 };
            let bestSellingData = await ProjectService.getProject(filter);
            let response = {
                success: 1,
                data: bestSellingData,
            };
            res.send(response);
        } catch {
            console.error(error);
        }
    },
};

module.exports = userController;
