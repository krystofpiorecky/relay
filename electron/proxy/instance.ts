import http from "http";
import https from "https";
import httpProxy from "http-proxy";
import url from "url";
import { getConfig, OutputSetupConfigSchema } from "./config";
import { EventHandler } from "@_utilities/event-handler";
import { copyHeaders, setCookieHeaders, setFullHeaders, setResponseHeaders } from "./headers";
import { handleRedirect } from "./redirect";
import { safeParse } from "@_utilities/file";
import { CookieSchema } from "./cookies";

type Events = {
  "request:received": { req: http.IncomingMessage, res: http.ServerResponse },
  "proxy:sent": { proxyReq: http.ClientRequest, req: http.IncomingMessage },
  "proxy:received": { proxyRes: http.IncomingMessage, req: http.IncomingMessage, res: http.ServerResponse },
  "request:responded": { proxyRes: http.IncomingMessage, req: http.IncomingMessage, res: http.ServerResponse },
};

export class ProxyInstance extends EventHandler<Events> {
  config!: OutputSetupConfigSchema["instances"][number];
  proxyServer!: httpProxy<http.IncomingMessage, http.ServerResponse<http.IncomingMessage>>;

  getCookies = (): CookieSchema[] => [];

  setConfig(config: OutputSetupConfigSchema["instances"][number]) {
    console.log(`Launching proxy ${config.target}::${config.port}`);
    this.config = config;

    this.proxyServer = httpProxy.createProxyServer({
      target: "https://" + this.config.target,
      agent: https.globalAgent,
      headers: {
        host: new URL("https://" + this.config.target).host
      }
    });

    http.createServer(async (req, res) => {
      if (this.maybeHandleOptions(req, res)) return;
      if (handleRedirect(this.config, req, res)) return;

      this.invoke("request:received", { req, res });
      const requestUrl = url.parse(req.url || "", true).pathname;

      const config = getConfig(this.config.key, requestUrl);
      if (config.delay > 0)
        await new Promise(r => setTimeout(r, config.delay));

      // if (await handleCacheRead(this.config, config, req, res)) {
      //   return;
      // }

      this.proxyServer.web(req, res, { selfHandleResponse: true });
    }).listen(this.config.port);

    this.proxyServer.on("proxyReq", this.handleProxyReq);
    this.proxyServer.on("proxyRes", this.handleProxyRes);
  }

  handleProxyReq = (proxyReq: http.ClientRequest, req: http.IncomingMessage) => {
    const target =  "https://" + this.config.target;
    proxyReq.setHeader("origin", target);
    proxyReq.setHeader("referer", target);
    proxyReq.removeHeader("accept-encoding");

    this.invoke("proxy:sent", { proxyReq, req });
  }

  handleProxyRes = (proxyRes: http.IncomingMessage, req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => {
    const status = proxyRes.statusCode ?? 200;
    this.invoke("proxy:received", { proxyRes, req, res });
      
    // redirect
    if ([ 301, 302, 307, 308 ].includes(status)) {
      setFullHeaders(req, res);
      res.writeHead(status, proxyRes.headers);
      res.end();
      this.invoke("request:responded", { proxyRes, req, res });
      return;
    }
    
    const chunks: Buffer[] = [];
    proxyRes.on("data", (chunk: Buffer) => chunks.push(chunk));
    proxyRes.on("end", async () => {
      // handle non-json
      const contentType = proxyRes.headers["content-type"] || "";
      if (!contentType.includes("application/json")) {
        copyHeaders(proxyRes, res);
        setResponseHeaders(proxyRes, req, res);
        res.writeHead(proxyRes.statusCode ?? 200);
        res.end(Buffer.concat(chunks));
        this.invoke("request:responded", { proxyRes, req, res });
        return;
      }
  
      const content = Buffer.concat(chunks).toString("utf8");
      const data = safeParse(content);

      const requestUrl = url.parse(req.url || "", true).pathname;
      const config = getConfig(this.config.key, requestUrl);

      if (this.config.log) {
        console.log(`[${this.config.key} < ${requestUrl}] ${config.cache.write ? "CACHE-W" : ""}`);
      }

      // if (config.cache.write)
      //   await writeJSON(cachePath(instance.key, requestUrl!), data);

      const sendBody = JSON.stringify(data);
      copyHeaders(proxyRes, res);
      setResponseHeaders(proxyRes, req, res);
      setCookieHeaders(this.getCookies(), proxyRes, res);
      res.setHeader("content-length", Buffer.byteLength(sendBody));
      res.writeHead(proxyRes.statusCode ?? 200);

      res.end(sendBody);
      this.invoke("request:responded", { proxyRes, req, res });
    });
  }

  maybeHandleOptions = (req: http.IncomingMessage, res: http.ServerResponse): boolean => {
    const method = String(req.method || "").toUpperCase();
    if (method !== "OPTIONS")
      return false;
  
    setFullHeaders(req, res);
    res.setHeader("Content-Length", "0");
    
    res.writeHead(200);
    res.end();
  
    return true;
  };
}