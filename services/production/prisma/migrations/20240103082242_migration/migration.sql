-- CreateTable
CREATE TABLE "_response_to_option" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_response_to_option_AB_unique" ON "_response_to_option"("A", "B");

-- CreateIndex
CREATE INDEX "_response_to_option_B_index" ON "_response_to_option"("B");

-- AddForeignKey
ALTER TABLE "_response_to_option" ADD CONSTRAINT "_response_to_option_A_fkey" FOREIGN KEY ("A") REFERENCES "option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_response_to_option" ADD CONSTRAINT "_response_to_option_B_fkey" FOREIGN KEY ("B") REFERENCES "response"("id") ON DELETE CASCADE ON UPDATE CASCADE;
