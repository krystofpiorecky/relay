import http from "http";
import https from "https";
import httpProxy from "http-proxy";
import url from "url";
// import { join } from "path";
// import { existsSync, mkdirSync } from "fs";
// import { readJSON, writeJSON } from "@utilities/file";
// import inquirer from "inquirer";
// import { login } from "./login";
import { getConfig, getSetupConfig } from "./config";
import { handleOptions } from "./options";
import { handleRedirect } from "./redirect";
import { handleCacheRead } from "./cache";
import { collectResponse } from "./response";
import { copyHeaders, 
  // setCookieHeaders, 
  setResponseHeaders } from "./headers";

const CONFIG = getSetupConfig();

// const cacheDir = join(process.cwd(), "remote", "proxy", "cache");
// const cachePath = (instanceKey: string, url: string) => {
//   let parts = url
//     .split("/")
//     .filter(x => !!x)
//     .map(x => encodeURIComponent(x));
//   if (parts.length === 0)
//     parts = [ "__index" ];
//   return join(cacheDir, instanceKey, parts.join("/") + ".json");
// };

export const proxy = async () => {
  // const cookiesFile = join(process.cwd(), "remote", "proxy", "cookies.json");
  // TODO: check cookie expires date
  // TODO: handle unset cookie header
  // if (!existsSync(cookiesFile)) {
  //   // ask for login
  //   const { confirm } = await inquirer.prompt([{
  //     type: "confirm",
  //     name: 'confirm',
  //     message: "Missing cookies, open login?",
  //     default: false
  //   }]);

  //   if (confirm) await login(CONFIG.loginTarget);
  // }

  // const cookies: any[] = await readJSON(cookiesFile) ?? [];

  // if (!existsSync(cacheDir)) {
  //   mkdirSync(cacheDir, { recursive: true });
  // }

  for (const instance of CONFIG.instances) {
    console.log(`Launching proxy ${instance.target}::${instance.port}`);

    const proxy = httpProxy.createProxyServer({
      target: "https://" + instance.target,
      agent: https.globalAgent,
      headers: {
        host: new URL("https://" + instance.target).host
      }
    });

    http.createServer(async (req, res) => {
      if (handleOptions(req, res)) return;
      if (handleRedirect(instance, req, res)) return;

      const requestUrl = url.parse(req.url || "", true).pathname;

      const config = getConfig(instance.key, requestUrl);
      if (config.delay > 0)
        await new Promise(r => setTimeout(r, config.delay));

      if (instance.log) {
        console.log(`[${instance.key} > ${requestUrl}] ${config.cache.read ? "CACHE-R" : ""}`);
      }

      if (await handleCacheRead(instance, config, req, res)) return;

      proxy.web(req, res, { selfHandleResponse: true });
    }).listen(instance.port);

    proxy.on("proxyReq", proxyReq => {
      const target =  "https://" + instance.target;
      proxyReq.setHeader("origin", target);
      proxyReq.setHeader("referer", target);
      proxyReq.removeHeader("accept-encoding");
    });

    proxy.on("proxyRes", (proxyRes, req, res) => collectResponse(proxyRes, req, res, async data => {
      const requestUrl = url.parse(req.url || "", true).pathname;
      const config = getConfig(instance.key, requestUrl);

      if (instance.log) {
        console.log(`[${instance.key} < ${requestUrl}] ${config.cache.write ? "CACHE-W" : ""}`);
      }

      // if (config.cache.write)
      //   await writeJSON(cachePath(instance.key, requestUrl!), data);

      const sendBody = JSON.stringify(data);
      copyHeaders(proxyRes, res);
      setResponseHeaders(proxyRes, req, res);
      // setCookieHeaders(cookies, res);
      res.setHeader("content-length", Buffer.byteLength(sendBody));
      res.writeHead(proxyRes.statusCode ?? 200);

      res.end(sendBody);
    }));
  }
};
