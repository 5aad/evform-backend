const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  // GET
  async getUsers(req, res) {
    try {
      const users = await prisma.adminuser.findMany({});
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
  async getUsersWithRole(req, res) {
    try {
      const users = await prisma.adminuser.findMany({
        include: {
          userrole_adminuser_userroleTouserrole: true,
        },
      });
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
  // Get Role by the Users array
  async getRoleWithUsers(req, res) {
    try {
      const role = await prisma.userrole.findMany({
        include: {
          adminuser_adminuser_userroleTouserrole: true,
        },
      });
      res.status(200).json({
        data: role,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
    }
  },

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
  // POST
  async addUser(req, res) {
    const { username, userpassword, usertimestamp, userrole } = req.body;
    if (username || userpassword || usertimestamp || userrole) { 
      try {
        await prisma.adminuser.create({
          data: {
            username,
            userpassword,
            usertimestamp,
            userrole,
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
