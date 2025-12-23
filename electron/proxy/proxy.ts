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
import { copyHeaders, setCookieHeaders, setResponseHeaders } from "./headers";

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

const REQUEST_LIST: any[] = [];

const COOKIES = [{
  "name": "cf_clearance",
  "value": "NeHtWi8OumdFncpPWjEfs3IrhTfSNEl1s6M_dLMZCps-1760533096-1.2.1.1-2.8i97vJ3yIi0BabnfudDj6aJdoECsnTigMjnMs73_ayHCHmmqvvo6uPxMe.guotlhIn1ASkb.d02GblJc4ORHN1YaEADuPjHbfK_0O50H.WfVmBCPBcT_3v7Qem4N29XAAS5LegrqvLyebagT5U7Bu.6nIDpnbKrTu0tqwU61zvKgA_XWlsc9NKUEwWPmRlpXZ3xYHo_CXDbmdbcQ8AhcJiRhHpozDO6v0uiAYbbc8",
  "domain": ".skinsearch.com",
  "path": "/",
  "httpOnly": true,
  "secure": true,
  "sameSite": "None",
  "expires": 1792069097.565749
}, {
  "name": "identity",
  "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNzY1NjExOTgwOTk0NTI2OTUifSwiaXNzIjoic2tpbnNlYXJjaCIsInN1YiI6ImlkZW50aXR5In0.1GUmVVlxxS4u9--R1pzf-om9cb9q9Mgi7mnjWIwmr74",
  "domain": "skinsearch.com",
  "path": "/",
  "httpOnly": true,
  "secure": true,
  "expires": 1766927315.920051
}, {
  "name": "content",
  "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImF2YXRhciI6IjlmMjYzODhlMmUyNTQyNTRhMmMyMGI4YzRlZTA1YzBlYmUyY2VhNzEiLCJpZCI6Ijc2NTYxMTk4MDk5NDUyNjk1IiwibmFtZSI6InZ5aGxlZGF2YW0gZG9taW5hbnRuaSB6ZW55In0sImlzcyI6InNraW5zZWFyY2giLCJzdWIiOiJjb250ZW50In0.KTjR_z2rhFbwaL5-xu-3M9O1QTuRSZoGOoqfbWRDycM",
  "domain": "skinsearch.com",
  "path": "/",
  "httpOnly": false,
  "secure": true,
  "expires": 1766927315.920097
}, {
  "name": "discord",
  "value": "eyJpZCI6IjM5MzgwNTU3MjcxOTUwOTUyNSIsInVzZXJuYW1lIjoic2h0b29vZmkiLCJhdmF0YXIiOiJiYWI4N2Q2Nzc3N2U2N2QxZDAxNmM4N2I3YWQ5NzRkOCIsImFwcF9hZGRlZCI6dHJ1ZX0",
  "domain": "skinsearch.com",
  "path": "/",
  "httpOnly": false,
  "secure": true,
  "expires": 1766927315.920097
}];
let activeCookies = COOKIES.map(c => c.name);
export const setActiveCookies = (v: typeof activeCookies) =>
  activeCookies = v;
export const getActiveCookies = () =>
  COOKIES.map(c => ({ ...c, active: activeCookies.includes(c.name) }));

export const proxy = async (feed: (data: any[]) => void) => {
  const updateFeed = () =>
    feed(REQUEST_LIST.map(({ req, res, ...item }) => item));
  
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
      const feedItem = {
        proxy: {
          name: instance.key,
          icon: "mingcute:cat-fill"
        },
        url: {
          pathname: url.parse(req.url || "", true).pathname,
          search: url.parse(req.url || "", true).search
        },
        configs: 4,
        request: {
          timestamp: Date.now()
        },
        req,
        res
      };
      REQUEST_LIST.push(feedItem);
      updateFeed();

      const config = getConfig(instance.key, requestUrl);
      if (config.delay > 0)
        await new Promise(r => setTimeout(r, config.delay));

      if (instance.log) {
        console.log(`[${instance.key} > ${requestUrl}] ${config.cache.read ? "CACHE-R" : ""}`);
      }

      if (await handleCacheRead(instance, config, req, res)) {
        return;
      }

      proxy.web(req, res, { selfHandleResponse: true });
    }).listen(instance.port);

    proxy.on("proxyReq", (proxyReq, req) => {
      const target =  "https://" + instance.target;
      proxyReq.setHeader("origin", target);
      proxyReq.setHeader("referer", target);
      proxyReq.removeHeader("accept-encoding");

      const feedItem = REQUEST_LIST.find(item => item.req === req);
      if (feedItem) {
        feedItem.proxyResponse = {
          timestamp: Date.now()
        };
        updateFeed();
      }
      else {
        console.log("proxyReq, no request item found");
      }
    });

    proxy.on("proxyRes", (proxyRes, req, res) => collectResponse(proxyRes, req, res, async data => {
      const requestUrl = url.parse(req.url || "", true).pathname;
      const config = getConfig(instance.key, requestUrl);

      const feedItem = REQUEST_LIST.find(item => item.req === req);
      if (feedItem) {
        feedItem.proxyResponse = {
          timestamp: Date.now(),
          status: proxyRes.statusCode ?? 600,
          size: 1
        };
        updateFeed();
      }
      else {
        console.log("no request item found");
      }

      if (instance.log) {
        console.log(`[${instance.key} < ${requestUrl}] ${config.cache.write ? "CACHE-W" : ""}`);
      }

      // if (config.cache.write)
      //   await writeJSON(cachePath(instance.key, requestUrl!), data);

      const sendBody = JSON.stringify(data);
      copyHeaders(proxyRes, res);
      setResponseHeaders(proxyRes, req, res);
      setCookieHeaders(COOKIES.filter(c => activeCookies.includes(c.name)), proxyRes, res);
      res.setHeader("content-length", Buffer.byteLength(sendBody));
      res.writeHead(proxyRes.statusCode ?? 200);

      res.end(sendBody);

      if (feedItem) {
        feedItem.response = {
          timestamp: Date.now(),
          status: proxyRes.statusCode ?? 600,
          size: 1
        };
        updateFeed();
      }
      else {
        console.log("no request item found");
      }
    }, 
      async (proxyRes, req) => {
        const feedItem = REQUEST_LIST.find(item => item.req === req);
        if (feedItem) {
          feedItem.proxyResponse = {
            timestamp: Date.now(),
            status: proxyRes.statusCode ?? 600,
            size: 1
          };
          feedItem.response = {
            timestamp: Date.now(),
            status: proxyRes.statusCode ?? 600,
            size: 1
          };
          updateFeed();
        }
      },
      async (proxyRes, req) => {
        const feedItem = REQUEST_LIST.find(item => item.req === req);
        if (feedItem) {
          feedItem.proxyResponse = {
            timestamp: Date.now(),
            status: proxyRes.statusCode ?? 600,
            size: 1
          };
          feedItem.response = {
            timestamp: Date.now(),
            status: proxyRes.statusCode ?? 600,
            size: 1
          };
          updateFeed();
        }
      }
    ));
  }
};
