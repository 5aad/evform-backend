const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  // GET
  async getQuestions(req, res) {
    try {
      const questions = await prisma.question.findMany({});
      res.status(200).json({
        data: questions,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
    }
  },
//   get question table with form data
  async getQuestionWithForm(req, res) {
    try {
      const que = await prisma.question.findMany({
        include: {
            form_question_formToform: true,
        },
      });
      res.status(200).json({
        data: que,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
    }
  },

//   Get the questions with anwers
  async getQuestionWithAns(req, res) {
    try {
      const que = await prisma.question.findMany({
        include: {
            response_response_questionToquestion: true,
        },
      });
      res.status(200).json({
        data: que,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
    }
  },

  // GET SINGLE FORM
  async getSingleQuestion(req, res) {
    const { id } = req.query;
    if (id) {
      try {
        const que = await prisma.question.findUnique({
          where: {
            id: Number(id),
          },
        });
        res.status(200).json({
          data: que,
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          res.status(500).json({
            message: e.meta.cause,
          });
        }
      }
    } else {
      res.status(400).json({ message: "Invalid Request" });
    }
  },
  // POST
  async addQuestion(req, res) {
    const {
      question,
      questimestamp,
      msgrequired,
      msgerror,
      placeholder,
      form,
    } = req.body;
    if (
      question ||
      questimestamp ||
      msgrequired ||
      msgerror ||
      placeholder ||
      form
    ) {
      try {
        await prisma.question.create({
          data: {
            question,
            questimestamp,
            msgrequired,
            msgerror,
            placeholder,
            form,
          },
        });
        res.status(200).json({ message: "Data add successfully" });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          res.status(500).json({
            message: e.meta.cause,
          });
        }
      }
    } else {
      res.status(400).json({ message: "Invalid Request" });
    }
  },

  // PUT
  async updateQuestion(req, res) {
    const { id, question, msgrequired, msgerror, placeholder } = req.body;
    if (id) {
      try {
        const que = await prisma.question.update({
          where: {
            id: id,
          },
          data: {
            question,
            msgrequired,
            msgerror,
            placeholder,
          },
        });
        res.status(200).json({
          message: "Data Update Successfully",
          data: que,
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          res.status(500).json({
            message: e.meta.cause,
          });
        }
      }
    } else res.status(400).json({ message: "Invalid Request" });
  },
  // DELETE
  async deleteQuestion(req, res) {
    const { id } = req.body;
    if (id) {
      try {
        await prisma.question.delete({
          where: {
            id: id,
          },
        });
        res.status(200).json({
          message: "Data Delete Successfully",
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          res.status(500).json({
            message: e.meta.cause,
          });
        }
      }
    } else res.status(400).json({ message: "Invalid Request" });
  },
};
