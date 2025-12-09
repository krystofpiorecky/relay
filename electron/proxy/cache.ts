import { readJSON } from "@_utilities/file";
import http from "http";
import { join } from "path";
import url from "url";
import { setFullHeaders } from "./headers";

const cacheDir = join(process.cwd(), "remote", "proxy", "cache");
const cachePath = (instanceKey: string, url: string) => {
  let parts = url
    .split("/")
    .filter(x => !!x)
    .map(x => encodeURIComponent(x));

  if (parts.length === 0)
    parts = [ "__index" ];

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
  
  const data = await readJSON(cachePath(instance.key, requestUrl!));
  if (!data) 
    return false;

  setFullHeaders(req, res);
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(data));

  return true;
};
