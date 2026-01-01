import { app } from 'electron'
import { readJSON } from "@_utilities/file";
import http from "http";
import { basename, join, parse } from "path";
import url from "url";
import { setFullHeaders } from "./headers";
import fs from "fs";

const cacheDir = join(app.getPath("userData"), "proxy_service", "cache");
export const cachePath = (instanceKey: string, url: string, method: string) => {
  let parts = url
    .split("/")
    .filter(x => !!x)
    .map(x => encodeURIComponent(x));

  parts.push(method);

  return join(
    cacheDir,
    instanceKey,
    parts.join("/") + ".json"
  );
};

export const handleCacheRead = async (instance: { key: string}, config: { transformer?: string, cache: { read: boolean | string } }, req: http.IncomingMessage, res: http.ServerResponse): Promise<boolean> => {
  if (!config.cache.read)
    return false;  

  const requestUrl = url.parse(req.url || "", true).pathname;
  const method = String(req.method || "").toUpperCase();
  
  const data = await readJSON(cachePath(instance.key, requestUrl!, method));
  if (!data) 
    return false;

  setFullHeaders(req, res);
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(JSON.stringify(data));

  return true;
};

type CacheTreeNode = {
  name: string,
  path: string,
  type: "file" | "directory",
  children?: CacheTreeNode[],
};

export const getCacheTtree = (): CacheTreeNode =>
  getCacheSubtree(cacheDir);

const getCacheSubtree = (dirPath: string): CacheTreeNode => {
  const stats = fs.statSync(dirPath);

  const isFile = stats.isFile();
  const name = isFile
    ? parse(dirPath).name   // ← filename without extension
    : basename(dirPath);

  const node: CacheTreeNode = {
    name,
    path: dirPath,
    type: isFile ? "file" : "directory",
  };

  if (isFile)
    return node;

  node.children = fs.readdirSync(dirPath).map((child) =>
    getCacheSubtree(join(dirPath, child))
  );

  return node;
};
