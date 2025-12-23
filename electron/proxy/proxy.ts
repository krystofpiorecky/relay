import http from "http";
import { OutputSetupConfigSchema } from "./config";
import { CookieSchema } from "./cookies";
import { EventHandler } from "@_utilities/event-handler";
import { ProxyInstance } from "./instance";

type Events = {
  "request:received": { instance: string, req: http.IncomingMessage, res: http.ServerResponse }
  "proxy:sent": { instance: string, proxyReq: http.ClientRequest, req: http.IncomingMessage },
  "proxy:received": { instance: string, proxyRes: http.IncomingMessage, req: http.IncomingMessage, res: http.ServerResponse },
  "request:responded": { instance: string, proxyRes: http.IncomingMessage, req: http.IncomingMessage, res: http.ServerResponse },
};

export class Proxy extends EventHandler<Events> {
  instances: ProxyInstance[] = [];
  cookies: CookieSchema[] = [];
  config?: OutputSetupConfigSchema;

  setConfig(config: OutputSetupConfigSchema) {
    this.config = config;

    for (const instanceConfig of this.config.instances) {
      const instance = new ProxyInstance();
      this.instances.push(instance);

      instance.getCookies = () => this.cookies.filter(c => c.active);
      instance.setConfig(instanceConfig);

      instance.on("request:received", e =>
        this.invoke("request:received", { instance: instanceConfig.key, ...e })
      );
      instance.on("proxy:sent", e =>
        this.invoke("proxy:sent", { instance: instanceConfig.key, ...e })
      );
      instance.on("proxy:received", e =>
        this.invoke("proxy:received", { instance: instanceConfig.key, ...e })
      );
      instance.on("request:responded", e =>
        this.invoke("request:responded", { instance: instanceConfig.key, ...e })
      );
    }
  }
}
