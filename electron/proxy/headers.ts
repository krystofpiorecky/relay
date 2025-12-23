import http from "http";

const ALL_HTTP_METHODS = "GET, POST, PUT, DELETE, OPTIONS, HEAD";

export const setFullHeaders = (req: http.IncomingMessage, res: http.ServerResponse) => {
  res.setHeader("Access-Control-Expose-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "3600");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", req.headers["access-control-request-method"] || "GET");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Request-Method", "POST");
  res.setHeader("Allow", ALL_HTTP_METHODS);
  res.setHeader("Allowed", ALL_HTTP_METHODS);
  
  if (req.headers.origin) 
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
};

export const setCookieHeaders = (cookies: any[], proxyRes: http.IncomingMessage, res: http.ServerResponse) => {
  console.log(proxyRes.headers["set-cookie"]);
  const headers = cookies.map(cookie => {
    const parts = [
      `${cookie.name}=${cookie.value}`,
      `Path=/`,
      cookie.httpOnly ? 'HttpOnly' : null,
      'Secure',
      cookie.expires ? `Expires=${new Date(cookie.expires * 1000).toUTCString()}` : null,
      'SameSite=None'
    ].filter(Boolean);

    return parts.join('; ');
  });

  res.setHeader("Set-Cookie", headers);
};

export const setResponseHeaders = (proxyRes: http.IncomingMessage, req: http.IncomingMessage, res: http.ServerResponse) => {
  delete proxyRes.headers["access-control-allow-origin"];
  delete proxyRes.headers["access-control-allow-credentials"];
  delete proxyRes.headers["access-control-allow-methods"];
  delete proxyRes.headers["access-control-allow-headers"];
  
  if (req.headers["access-control-request-method"])
    res.setHeader("access-control-allow-methods", req.headers["access-control-request-method"]);

  if (req.headers["access-control-request-headers"])
    res.setHeader("access-control-allow-headers", req.headers["access-control-request-headers"]);

  if (req.headers.origin) {
    res.setHeader("access-control-allow-origin", req.headers.origin);
    res.setHeader("access-control-allow-credentials", "true");
  }
};

export const copyHeaders = (proxyRes: http.IncomingMessage, res: http.ServerResponse) => {
  Object.entries(proxyRes.headers).forEach(([key, value]) => {
    if (key.toLowerCase() === "content-length") return;
    res.setHeader(key, value as any);
  });
};
