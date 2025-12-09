import { setFullHeaders } from "./headers";
import http from "http";

export const handleOptions = (req: http.IncomingMessage, res: http.ServerResponse): boolean => {
  const method = String(req.method || "").toUpperCase();
  if (method !== "OPTIONS")
    return false;

  setFullHeaders(req, res);
  res.setHeader("Content-Length", "0");
  
  res.writeHead(200);
  res.end();

  return true;
};
