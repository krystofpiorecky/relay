import { promises as fs } from "fs";
import path from "path";

export const readJSON = async <T = any>(filepath: string): Promise<T | null> => {
  try {
    const data = await fs.readFile(filepath, "utf-8");
    return safeParse<T>(data);
  }
  catch (e) {
    return null;
  }
};

export const writeJSON = async (filepath: string, data: object) => 
  writePlain(filepath, JSON.stringify(data, null, 2))

export const writePlain = async (filepath: string, data: string) => {
  const dir = path.dirname(filepath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filepath, data, "utf-8");
};

export const safeParse = <T>(text: string): T | null => {
  try {
    return JSON.parse(text);
  }
  catch (e) {
    return null;
  }
};
