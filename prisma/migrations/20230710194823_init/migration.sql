-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "words" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary_entry" (
    "id" SERIAL NOT NULL,
    "word_id" INTEGER NOT NULL,
    "meaning" JSONB NOT NULL,
    "sentences" JSONB NOT NULL,
    "synonyms" JSONB NOT NULL,
    "antonyms" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vocabulary_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary_entry_user" (
    "user_id" INTEGER NOT NULL,
    "word_id" INTEGER NOT NULL,
    "context" JSONB NOT NULL,
    "media" JSONB NOT NULL,

    CONSTRAINT "vocabulary_entry_user_pkey" PRIMARY KEY ("user_id","word_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "words_word_key" ON "words"("word");

-- CreateIndex
CREATE UNIQUE INDEX "vocabulary_entry_word_id_key" ON "vocabulary_entry"("word_id");

-- AddForeignKey
ALTER TABLE "vocabulary_entry" ADD CONSTRAINT "vocabulary_entry_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;
