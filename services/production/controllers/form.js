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
        const forms = await prisma.form.findMany({});
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
      const { name, user_id } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(name) || validator.isEmpty(user_id.toString()))
          return res.status(400).send({ data: "Please provide all fields " });
        const form = await prisma.form.create({
          data: {
            name,
            user_id,
          },
        });
        return res
          .status(200)
          .json({ message: "Data add successfully", data: form });
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
  async updateForm(req, res) {
    try {
      const { id, name, user_id } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if ( !id ||
          validator.isEmpty(id.toString()) ||
          !name ||
          validator.isEmpty(name) ||
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
              name,
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
