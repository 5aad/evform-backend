const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = require("../utilities/generateToken");
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");
const crypto = require("crypto");

module.exports = {
  // GET
  async getForms(req, res) {
    try {
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        const forms = await prisma.form.findMany({
          select: {
            id: true,
            title: true,
            user_id: true,
            responses: {
              select:{
                id: true,
                answer: true,
                question_id: true
              }
            }
          }
        });
        return res.status(200).json({
          data: forms,
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
  // Get forms with users data
  async getFormsWithUsers(req, res) {
    try {
      let token = req.headers["authorization"];
      if (token) {
        const forms = await prisma.form.findMany({
          include: {
            user: {
              select: {
                id: true,
                username: true,
                role_id: true,
              },
            },
          },
        });
        return res.status(200).json({
          data: forms,
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

  // GET SINGLE FORM
  async getSingleForm(req, res) {
    try {
      const { id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        if (validator.isEmpty(id.toString()))
          return res.status(400).send({ data: "Please provide id " });
        const form = await prisma.form.findUnique({
          where: {
            id: Number(id),
          },
          select: {
            id: true,
            title: true,
            user_id: true,
            questions: {
              select: {
                id: true,
                question: true,
                required: true,
                error: true,
                placeholder: true,
                options: {
                  select: {
                    label: true,
                    value: true,
                  },
                },
              },
            },
          },
        });
        return res.status(200).json({
          data: form,
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
  async addForm(req, res) {
    try {
      const { title, user_id, questions } = req.body;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);

        if (validator.isEmpty(title) || validator.isEmpty(user_id.toString()))
          return res.status(400).send({ data: "Please provide all fields" });

        const form = await prisma.form.create({
          data: {
            title,
            user_id,
            questions: {
              create: questions.map((q) => ({
                // question_type: q.question_type,
                question: q.question,
                required: q.required,
                error: q.error_msg,
                placeholder: q.placeholder,
                options: q.options
                  ? {
                      create: q.options.map((opt) => ({
                        label: opt.label,
                        value: opt.value,
                      })),
                    }
                  : undefined,
              })),
            },
          },
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        });

        return res.status(200).json({
          status: 200,
          message: "Data added successfully",
          data: form,
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // PUT
  async updateForm(req, res) {
    try {
      const { id, title, user_id } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (
          !id ||
          validator.isEmpty(id.toString()) ||
          !title ||
          validator.isEmpty(title) ||
          !user_id ||
          validator.isEmpty(user_id.toString())
        )
          return res.status(400).send({ data: "Please provide all fields " });
        try {
          const form = await prisma.form.update({
            where: {
              id: Number(id),
            },
            data: {
              title,
              user_id,
            },
          });
          return res.status(200).json({
            status: 200,
            message: "Form Update Successfully",
            data: form,
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
  async deleteForm(req, res) {
    try {
      const { id } = req.query;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);

        if (!id || validator.isEmpty(id.toString())) {
          return res.status(400).send({ data: "Please provide all fields" });
        }

        try {
          await prisma.form.delete({
            where: {
              id: Number(id),
            },
          });
          return res.status(200).json({
            message: "Form Delete Successfully",
          });
        } catch (error) {
          if (error.code === "P2025") {
            return res.status(400).send({ data: "Form does not exist!" });
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
