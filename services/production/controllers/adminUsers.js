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
      const users = await prisma.users.findMany({});
      res.status(200).json({
        data: users,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
    }
  },
  // Get users by the Role.
  // async getUsersWithRole(req, res) {
  //   try {
  //     const users = await prisma.adminuser.findMany({
  //       include: {
  //         userrole_adminuser_userroleTouserrole: true,
  //       },
  //     });
  //     res.status(200).json({
  //       data: users,
  //     });
  //   } catch (e) {
  //     if (e instanceof Prisma.PrismaClientKnownRequestError) {
  //       res.status(500).json({
  //         message: e.meta.cause,
  //       });
  //     }
  //   }
  // },
  // Get Role by the Users array
  // async getRoleWithUsers(req, res) {
  //   try {
  //     const role = await prisma.userrole.findMany({
  //       include: {
  //         adminuser_adminuser_userroleTouserrole: true,
  //       },
  //     });
  //     res.status(200).json({
  //       data: role,
  //     });
  //   } catch (e) {
  //     if (e instanceof Prisma.PrismaClientKnownRequestError) {
  //       res.status(500).json({
  //         message: e.meta.cause,
  //       });
  //     }
  //   }
  // },

  // GET SINGLE USER
  async getSingleUser(req, res) {
    const { id } = req.query;
    if (id) {
      try {
        const user = await prisma.adminuser.findUnique({
          where: {
            userid: Number(id),
          },
        });
        res.status(200).json({
          data: user,
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
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
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
            return res.status(400).send({ data: "Please provide all fields " });
          const exists = await prisma.users.findUnique({
            where: { username: username },
          });
          if (exists)
            return res.status(400).send({ data: "user already exists!" });
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
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
    }
  },

  // LOGIN POST
  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (validator.isEmpty(username) || validator.isEmpty(password))
        return res.status(400).send({ data: "Please provide all fields " });
      const userFound = await prisma.users.findFirst({
        where: {
          username: username, // Replace with the actual email value
          password: crypto
            .createHmac("sha256", "secret")
            .update(password)
            .digest("hex"), // Replace with the actual hashed password value
        },
      });
      if (userFound) {
        return res
          .status(200)
          .send({ status: 200, data: generateToken(userFound) });
      }
      return res.status(404).send({ data: "No such user found!" });
    } catch (error) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
    }
  },

  // PUT
  async updateUser(req, res) {
    const { userid, username, userpassword, userrole } = req.body;
    if (userid) {
      try {
        const user = await prisma.adminuser.update({
          where: {
            userid: userid,
          },
          data: {
            username,
            userpassword,
            userrole,
          },
        });
        res.status(200).json({
          message: "User Update Successfully",
          data: user,
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
  async deleteUser(req, res) {
    const { userid } = req.body;
    if (userid) {
      try {
        await prisma.adminuser.delete({
          where: {
            userid: userid,
          },
        });
        res.status(200).json({
          message: "User Delete Successfully",
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
