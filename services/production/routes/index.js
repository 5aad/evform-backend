var express = require("express");
const { json } = require("express/lib/response");
const users = require("../controllers/users");
const form = require("../controllers/form");
const question = require("../controllers/question");
const response = require("../controllers/response");
var router = express.Router();

/* GET home page. */
// Admin User Table
router.get("/users", (req, res) => users.getUsers(req, res));
router.get("/user", (req, res) => users.getSingleUser(req, res));
router.post("/user", (req, res) => users.addUser(req, res));
router.post("/super", (req, res) => users.createSuperAdmin(req, res));
router.post("/login", (req, res) => users.login(req, res));
router.put("/user", (req, res) => users.updateUser(req, res));
router.delete("/user", (req, res) => users.deleteUser(req, res));

// Form Table
router.get("/forms", (req, res) => form.getForms(req, res));
router.get("/formsUser", (req, res) => form.getFormsWithUsers(req, res));
router.get("/form", (req, res) => form.getSingleForm(req, res));
router.post("/form", (req, res) => form.addForm(req, res));
router.put("/live", (req, res) => form.updateLive(req, res));
router.put("/form", (req, res) => form.updateForm(req, res));
router.delete("/form", (req, res) => form.deleteForm(req, res));

// Question Table
router.get("/questions", (req, res) => question.getQuestions(req, res));
router.get("/questionsForm", (req, res) =>
  question.getQuestionWithForm(req, res)
);
router.get("/quesAns", (req, res) => question.getQuestionWithAns(req, res));
router.get("/question", (req, res) => question.getSingleQuestion(req, res));
router.post("/question", (req, res) => question.addQuestion(req, res));
router.put("/question", (req, res) => question.updateQuestion(req, res));
router.delete("/question", (req, res) => question.deleteQuestion(req, res));

// Response Table
router.get("/responses", (req, res) => response.getResponses(req, res));
router.get("/responsesQueAndForm", (req, res) =>
  response.getResponseWithQueAndForm(req, res)
);
router.get("/response", (req, res) => response.getSingleFormWithResponse(req, res));
router.post("/response", (req, res) => response.addResponse(req, res));
router.put("/response", (req, res) => response.updateResponse(req, res));
router.delete("/response", (req, res) => response.deleteResponse(req, res));

//Test
router.get("/test", (req, res) => res.status(200).json("I dont saad "));
module.exports = router;
