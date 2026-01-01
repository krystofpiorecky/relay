import { ipcMain, BrowserWindow } from "electron";
import { Proxy } from "./proxy";
import { COOKIES } from "./cookies";
import { getSetupConfig } from "./config";
import url from "url";
import { getCacheTtree } from "./cache";

const feed: any[] = [];

export const setupProxy = (win: BrowserWindow) => {
  const proxy = new Proxy();
  proxy.setConfig(getSetupConfig())
  proxy.cookies = COOKIES;

  proxy.on("request:received", ({ instance, req }) => {
    const feedItem = {
      proxy: {
        name: instance,
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
      req
    };
    feed.push(feedItem);
    win.webContents.send("proxy:feed", feed.map(({ req, ...item }) => item));
  });

  proxy.on("proxy:sent", ({ req }) => {
    const feedItem = feed.find(item => item.req === req);
    if (!feedItem) return;

    feedItem.proxyRequest = {
      timestamp: Date.now()
    };
    win.webContents.send("proxy:feed", feed.map(({ req, ...item }) => item));
  });

  proxy.on("proxy:received", ({ proxyRes, req }) => {
    const feedItem = feed.find(item => item.req === req);
    if (!feedItem) return;

    feedItem.proxyResponse = {
      timestamp: Date.now(),
      status: proxyRes.statusCode ?? 600,
      size: 1
    };
    win.webContents.send("proxy:feed", feed.map(({ req, ...item }) => item));
  });

  proxy.on("request:responded", ({ proxyRes, req }) => {
    const feedItem = feed.find(item => item.req === req);
    if (!feedItem) return;

    feedItem.response = {
      timestamp: Date.now(),
      status: proxyRes.statusCode ?? 600,
      size: 1
    };
    win.webContents.send("proxy:feed", feed.map(({ req, ...item }) => item));
  });

  ipcMain.handle("proxy:feed", () => feed.map(({ req, ...item }) => item));
  ipcMain.handle("proxy:cookies", () => proxy.cookies);

  ipcMain.on("proxy:cookies:active", (_, data: string[]) => {
    proxy.cookies = COOKIES.map(c => ({ ...c, active: data.includes(c.name) }))
    win.webContents.send("proxy:cookies", proxy.cookies)
  });

  ipcMain.handle("cache:tree", () => getCacheTtree());
};
