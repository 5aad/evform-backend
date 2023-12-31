const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");

module.exports = {
  // GET
  async getResponses(req, res) {
    try {
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        const resData = await prisma.response.findMany({});
        return res.status(200).json({
          data: resData,
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
  // Get reponses with question & form tables data
  async getResponseWithQueAndForm(req, res) {
    try {
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        const ans = await prisma.response.findMany({
          include: {
            form: {
              select: {
                id: true,
                name: true,
                user_id: true,
              },
            },
            question: {
              select: {
                id: true,
                question: true,
                error: true,
                placeholder: true,
              },
            },
          },
        });
        res.status(200).json({
          data: ans,
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // GET SINGLE Response
  async getSingleResponse(req, res) {
    try {
      const { id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        if (validator.isEmpty(id.toString()))
          return res.status(400).send({ data: "Please provide id" });
        const ans = await prisma.response.findUnique({
          where: {
            id: Number(id),
          },
        });
        return res.status(200).json({
          data: ans,
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
  // POST
  async addResponse(req, res) {
    try {
      const { answer, question_id, form_id } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (
          validator.isEmpty(answer) ||
          validator.isEmpty(question_id.toString()) ||
          validator.isEmpty(form_id.toString())
        )
          return res.status(400).send({ data: "Please provide all fields " });
        const reponse = await prisma.response.create({
          data: {
            answer,
            question_id,
            form_id,
          },
        });
        return res.status(200).json({
          message: "Data add successfully",
          data: reponse,
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // PUT
  async updateResponse(req, res) {
    try {
      const { id, answer, question_id, form_id } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (
          validator.isEmpty(id.toString()) ||
          validator.isEmpty(answer) ||
          validator.isEmpty(question_id.toString()) ||
          validator.isEmpty(form_id.toString())
        )
          return res.status(400).send({ data: "Please provide all fields " });
        try {
          const ans = await prisma.response.update({
            where: {
              id: id,
            },
            data: {
              answer,
              question_id,
              form_id,
            },
          });
          return res.status(200).json({
            status: 200,
            message: "Data Update Successfully",
            data: ans,
          });
        } catch (error) {
          if (error.code === "P2025") {
            return res.status(400).send({ data: "Form data does not exist!" });
          }
          throw error;
        }
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // DELETE
  async deleteResponse(req, res) {
    try {
      const { id } = req.query;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);

        if (!id || validator.isEmpty(id.toString())) {
          return res.status(400).send({ data: "Please provide all fields" });
        }
        try {
          await prisma.response.delete({
            where: {
              id: Number(id),
            },
          });
          return res.status(200).json({
            message: "Data Delete Successfully",
          });
        } catch (error) {
          if (error.code === "P2025") {
            return res
              .status(400)
              .send({ data: "Data does not exist! OR aLready deleted!" });
          }
          throw error;
        }
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
};
