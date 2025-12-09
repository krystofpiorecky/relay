import http from "http";
import url from "url";

export const handleRedirect = (instance: { key: string}, req: http.IncomingMessage, res: http.ServerResponse): boolean => {
  if (instance.key !== "main")
    return false;

  const requestUrl = url.parse(req.url || "", true).pathname;
  if (requestUrl === "/api/r") {
    const targetUrl = url.parse(req.url || "", true).query.url;
    res.writeHead(302, { Location: targetUrl });
    res.end();
    return true;
  }

  return  false;
};
