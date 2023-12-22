const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  // GET
  async getResponses(req, res) {
    try {
      const resData = await prisma.response.findMany({});
      res.status(200).json({
        data: resData,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
    }
  },
// Get reponses with question & form tables data
  async getResponseWithQueAndForm(req, res) {
    try {
      const ans = await prisma.response.findMany({
        include: {
            form_response_formToform: true,
            question_response_questionToquestion: true,
        },
      });
      res.status(200).json({
        data: ans,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
    }
  },

  // GET SINGLE Response
  async getSingleResponse(req, res) {
    const { id } = req.query;
    if (id) {
      try {
        const ans = await prisma.response.findUnique({
          where: {
            id: Number(id),
          },
        });
        res.status(200).json({
          data: ans,
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
  async addResponse(req, res) {
    const { answer, anstimestamp, question, form } = req.body;
    if (answer || anstimestamp || question || form) {
      try {
        await prisma.response.create({
          data: {
            answer,
            anstimestamp,
            question,
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
  async updateResponse(req, res) {
    const { id, answer, question } = req.body;
    if (id) {
      try {
        const ans = await prisma.response.update({
          where: {
            id: id,
          },
          data: {
            answer,
            question,
          },
        });
        res.status(200).json({
          message: "Data Update Successfully",
          data: ans,
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
  async deleteResponse(req, res) {
    const { id } = req.body;
    if (id) {
      try {
        await prisma.response.delete({
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
