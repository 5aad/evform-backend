const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = require("../utilities/generateToken");
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");
const crypto = require("crypto");
module.exports = {
  // GET
  async getUsers(req, res) {
    try {
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        const users = await prisma.users.findMany({
          include: {
            role: {
              select: {
                role: true,
              },
            },
          },
        });
        return res.status(200).json({ status: 200, data: users });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // GET SINGLE USER
  async getSingleUser(req, res) {
    try {
      const { id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(id.toString()))
          return res.status(400).send({ data: "Please provide all fields " });

        const user = await prisma.users.findUnique({
          where: {
            id: Number(id),
          },
          include: {
            role: {
              select: {
                role: true,
              },
            },
          },
        });
        return res.status(200).json({
          status: 200,
          data: user,
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

  // Create Super Admin POST
  async createSuperAdmin(req, res) {
    try {
      const { username, password, role_id } = req.body;
      if (
        validator.isEmpty(username) ||
        validator.isEmpty(password) ||
        validator.isEmpty(role_id.toString())
      )
        return res.status(400).send({ data: "Please provide all fields " });
      const exists = await prisma.users.findUnique({
        where: { username: username },
      });
      if (exists) return res.status(400).send({ data: "user already exists!" });
      const existingRole = await prisma.roles.findUnique({
        where: { id: role_id },
      });
      if (!existingRole) {
        await prisma.roles.create({
          data: {
            role: getRoleName(role_id),
          },
        });
      }

      const user = await prisma.users.create({
        data: {
          username,
          password: crypto
            .createHmac("sha256", "secret")
            .update(password)
            .digest("hex"),
          role_id,
        },
      });

      return res.status(200).send({ status: 200, data: user });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // ADD USER POST

  async addUser(req, res) {
    try {
      const { username, password, role_id } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (token.user.role === 1 || token.user.role === 2) {
          if (
            validator.isEmpty(username) ||
            validator.isEmpty(password) ||
            validator.isEmpty(role_id.toString())
          )
            return res.status(400).send({ message: "Please provide all fields " });
          const exists = await prisma.users.findUnique({
            where: { username: username },
          });
          if (exists)
            return res.status(404).send({ message: "user already exists!" });
          const existingRole = await prisma.roles.findUnique({
            where: { id: role_id },
          });
          if (!existingRole) {
            await prisma.roles.create({
              data: {
                role: getRoleName(role_id),
              },
            });
          }

           await prisma.users.create({
            data: {
              username,
              password: crypto
                .createHmac("sha256", "secret")
                .update(password)
                .digest("hex"),
              role_id,
            },
          });

          return res.status(200).send({ status: 200, message: "User add successfully"  });
        } else
          return res
            .status(401)
            .send({ status: 401, data: "Please provide valid auth token" });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide valid auth token" });
      }
    } catch (error) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // LOGIN POST
  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (validator.isEmpty(username) || validator.isEmpty(password))
        return res.status(400).send({ message: "Please provide all fields " });
      const userFound = await prisma.users.findFirst({
        where: {
          username: username,
          password: crypto
            .createHmac("sha256", "secret")
            .update(password)
            .digest("hex"),
        },
      });
      if (userFound) {
        return res
          .status(200)
          .send({ status: 200, data: generateToken(userFound) });
      }
      return res.status(404).send({ message: "No such user found!" });
    } catch (error) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // PUT
  async updateUser(req, res) {
    try {
      const { id, username, password, role_id } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (
          validator.isEmpty(id.toString()) ||
          validator.isEmpty(username) ||
          validator.isEmpty(password) ||
          validator.isEmpty(role_id.toString())
        )
          return res.status(400).send({ data: "Please provide all fields " });
        try {
          const user = await prisma.users.update({
            where: {
              id: id,
            },
            data: {
              username,
              password: crypto
                .createHmac("sha256", "secret")
                .update(password)
                .digest("hex"),
              role_id,
            },
          });
          return res.status(200).json({
            status: 200,
            message: "User Update Successfully",
            data: user,
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
  // DELETE
  async deleteUser(req, res) {
    try {
      const { id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(id.toString()))
          return res.status(400).send({ data: "Please provide all fields " });
        try {
          await prisma.users.delete({
            where: {
              id: Number(id),
            },
          });
          return res.status(200).json({
            status: 200,
            message: "User Delete Successfully",
          });
        } catch (error) {
          if (error.code === "P2025") {
            return res.status(400).send({ data: "User does not exist!" });
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

function getRoleName(userrole) {
  switch (userrole) {
    case 1:
      return "Super Admin";
    case 2:
      return "Admin";
    default:
      return "Member";
  }
}
