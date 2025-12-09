import { safeParse } from "@s_utilities/file";
import http from "http";
import { setFullHeaders } from "./headers";

export const collectResponse = (proxyRes: http.IncomingMessage, req: http.IncomingMessage, res: http.ServerResponse, callback: (data: any) => Promise<void>) => {
  const status = proxyRes.statusCode ?? 200;
  
  // redirect
  if ([ 301, 302, 307, 308 ].includes(status)) {
    setFullHeaders(req, res);
    res.writeHead(status, proxyRes.headers);
    res.end();
    return;
  }
  
  const chunks: Buffer[] = [];
  proxyRes.on("data", (chunk: Buffer) => chunks.push(chunk));
  proxyRes.on("end", async () => {
    // handle non-json
    const contentType = proxyRes.headers["content-type"] || "";
    if (!contentType.includes("application/json")) {
      setFullHeaders(req, res);
      res.writeHead(proxyRes.statusCode ?? 200, proxyRes.headers);
      res.end(Buffer.concat(chunks));
      return;
    }

    const content = Buffer.concat(chunks).toString("utf8");
    callback(safeParse(content));
  });
};
