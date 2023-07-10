import { Prisma, PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

async function getFilesLists(folderPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

async function readFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

async function processJsonFiles() {
  const folderPath = __dirname + '/../migrations';

  const fileList = await getFilesLists(folderPath);

  console.log('Number of files', fileList.length);

  for (const fileName of fileList) {
    console.log('Seeding filename', fileName);

    const filePath = `${folderPath}/${fileName}`;
    const fileContent = await readFile(filePath);
    const jsonData = JSON.parse(fileContent);

    await prisma.word.create({
      data: {
        word: jsonData?.word,
        VocabularyEntry: {
          create: {
            meaning: jsonData?.meaning,
            sentences: jsonData?.sentences,
            synonyms: jsonData?.synonyms,
            antonyms: jsonData?.antonyms,
          },
        },
      },
    });
  }
}

processJsonFiles();
