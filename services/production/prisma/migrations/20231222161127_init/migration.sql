-- CreateTable
CREATE TABLE "adminuser" (
    "userid" SERIAL NOT NULL,
    "username" VARCHAR,
    "userpassword" VARCHAR,
    "usertimestamp" TIMESTAMP(6),
    "userrole" INTEGER NOT NULL,

    CONSTRAINT "adminuser_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "form" (
    "formid" SERIAL NOT NULL,
    "formname" VARCHAR,
    "formtimestamp" TIMESTAMP(6),
    "adminuser" INTEGER NOT NULL,

    CONSTRAINT "form_pkey" PRIMARY KEY ("formid")
);

-- CreateTable
CREATE TABLE "question" (
    "id" SERIAL NOT NULL,
    "question" VARCHAR,
    "questimestamp" TIMESTAMP(6),
    "msgrequired" BOOLEAN,
    "msgerror" VARCHAR,
    "placeholder" VARCHAR,
    "form" INTEGER NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "response" (
    "id" SERIAL NOT NULL,
    "answer" VARCHAR,
    "anstimestamp" TIMESTAMP(6),
    "question" INTEGER NOT NULL,
    "form" INTEGER NOT NULL,

    CONSTRAINT "response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userrole" (
    "roleid" SERIAL NOT NULL,
    "rolename" VARCHAR,

    CONSTRAINT "userrole_pkey" PRIMARY KEY ("roleid")
);

-- AddForeignKey
ALTER TABLE "adminuser" ADD CONSTRAINT "adminuser_userrole_fkey" FOREIGN KEY ("userrole") REFERENCES "userrole"("roleid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form" ADD CONSTRAINT "form_adminuser_fkey" FOREIGN KEY ("adminuser") REFERENCES "adminuser"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_form_fkey" FOREIGN KEY ("form") REFERENCES "form"("formid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response" ADD CONSTRAINT "response_form_fkey" FOREIGN KEY ("form") REFERENCES "form"("formid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response" ADD CONSTRAINT "response_question_fkey" FOREIGN KEY ("question") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
