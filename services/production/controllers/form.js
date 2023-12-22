const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  // GET
  async getForms(req, res) {
    try {
      const forms = await prisma.form.findMany({});
      res.status(200).json({
        data: forms,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({
          message: e.meta.cause,
        });
      }
    }
  },
// Get forms with users data
  async getFormsWithUsers(req, res) {
    try {
      const forms = await prisma.form.findMany({
        include: {
            adminuser_form_adminuserToadminuser: true,
        },
      });
      res.status(200).json({
        data: forms,
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
  async getSingleForm(req, res) {
    const { id } = req.query;
    if (id) {
      try {
        const form = await prisma.form.findUnique({
          where: {
            formid: Number(id),
          },
        });
        res.status(200).json({
          data: form,
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
  async addForm(req, res) {
    const { formname, formtimestamp, adminuser } = req.body;
    if (formname || formtimestamp || adminuser) { 
      try {
        await prisma.form.create({
          data: {
            formname,
            formtimestamp,
            adminuser,
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
  async updateForm(req, res) {
    const { formid, formname, adminuser } = req.body;
    if (formid) {
      try {
        const form = await prisma.form.update({
          where: {
            formid: formid,
          }, 
          data: {
            formname,
            adminuser,
          },
        });
        res.status(200).json({
          message: "Form Update Successfully",
          data: form,
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
    async deleteForm(req, res) {
      const { formid } = req.body;
      if (formid) {
        try {
          await prisma.form.delete({
            where: {
              formid: formid,
            },
          });
          res.status(200).json({
            message: "Form Delete Successfully",
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
