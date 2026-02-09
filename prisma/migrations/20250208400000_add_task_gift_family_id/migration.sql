-- AlterTable
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "familyId" TEXT;

-- AlterTable
ALTER TABLE "Gift" ADD COLUMN IF NOT EXISTS "familyId" TEXT;

-- AddForeignKey (Task)
ALTER TABLE "Task" ADD CONSTRAINT "Task_familyId_fkey" 
  FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey (Gift)
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_familyId_fkey" 
  FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;
