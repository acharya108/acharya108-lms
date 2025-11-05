/*
  Warnings:

  - A unique constraint covering the columns `[studentId,lessonId]` on the table `user_progress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subjectId` to the `lessons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `user_progress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "subjectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_progress" ADD COLUMN     "currentLevel" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "levelScores" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "studentId" TEXT NOT NULL,
ADD COLUMN     "unlockedLevels" JSONB NOT NULL DEFAULT '[1]';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'student';

-- CreateTable
CREATE TABLE "boards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grades" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,

    CONSTRAINT "grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gradeId" TEXT NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_contents" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "richTextNotes" TEXT NOT NULL,
    "videoUrls" JSONB NOT NULL DEFAULT '[]',
    "interactives" JSONB NOT NULL DEFAULT '{}',
    "definitions" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "options" JSONB,
    "correctAnswer" TEXT,
    "keyTerms" JSONB NOT NULL DEFAULT '[]',
    "position" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "descriptive_answers" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "answerText" TEXT NOT NULL,
    "expectedTerms" JSONB NOT NULL DEFAULT '[]',
    "rubric" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "descriptive_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_progress" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "currentLevel" INTEGER NOT NULL DEFAULT 1,
    "levelScores" JSONB NOT NULL DEFAULT '{}',
    "unlockedLevels" JSONB NOT NULL DEFAULT '[1]',
    "lastAccessed" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_attempts" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "attemptDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentAnswer" TEXT NOT NULL,
    "isVoiceInput" BOOLEAN NOT NULL DEFAULT false,
    "score" DOUBLE PRECISION NOT NULL,
    "semanticScore" DOUBLE PRECISION NOT NULL,
    "keyTermScore" DOUBLE PRECISION NOT NULL,
    "grammarScore" DOUBLE PRECISION NOT NULL,
    "feedback" TEXT NOT NULL,
    "missingTerms" JSONB NOT NULL DEFAULT '[]',
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "student_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_reports" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questionsAttempted" INTEGER NOT NULL,
    "averageScore" DOUBLE PRECISION NOT NULL,
    "levelDistribution" JSONB NOT NULL DEFAULT '{}',
    "timeSpent" INTEGER NOT NULL,
    "reportData" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "daily_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "boards_name_key" ON "boards"("name");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_contents_lessonId_level_key" ON "lesson_contents"("lessonId", "level");

-- CreateIndex
CREATE UNIQUE INDEX "descriptive_answers_questionId_level_key" ON "descriptive_answers"("questionId", "level");

-- CreateIndex
CREATE UNIQUE INDEX "student_progress_studentId_lessonId_key" ON "student_progress"("studentId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_reports_studentId_date_key" ON "daily_reports"("studentId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_studentId_lessonId_key" ON "user_progress"("studentId", "lessonId");

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "grades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_contents" ADD CONSTRAINT "lesson_contents_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "descriptive_answers" ADD CONSTRAINT "descriptive_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
