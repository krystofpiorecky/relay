import { globToRegex } from "@_utilities/glob";
import { deepMerge, objectEntries, RecursivePartial } from "@_utilities/object";

const config = {"default":{"target":"skinsearch.com","cache":{"write":true,"read":false}},"main":{"port":9991,"log":true,"endpoints":[{"paths":"/feed, /api/feed, /api/ac","cache":false},{"paths":"/api/item/*","cache":{"read":false}},{"paths":"/api/inventory/"}]},"s3":{"target":"s3.skinsearch.com","port":9992,"cache":false},"status":{"prefix":"status","port":9993},"watchlist":{"prefix":"watchlist","port":9994,"log":true}} as unknown as ConfigFileSchema | undefined;

type Target =
  | "skinsearch.com"
  | "skinsearch.dev";

type CacheConfigSchema = 
  | boolean
  | {
    write: boolean,
    read: boolean | string,
    read_status?: number
  };

type InterpretedCacheConfigSchema = {
  write: boolean,
  read: boolean | string,
  read_status?: number
};

type GlobalConfigSchema = {
  target: Target,
  delay: number,
  log: boolean,
  cache: CacheConfigSchema
};

type EndpointConfigSchema = 
  & { paths: string }
  & Partial<{
    target: Target,
    delay: number,
    cache: CacheConfigSchema
  }>

type ConfigFileSchema = 
  & { default?: GlobalConfigSchema }
  & Record<Exclude<string, "default">, ProxyInstanceConfigSchema>;

type ProxyInstanceConfigSchema = Partial<{
  port: number,
  endpoints: EndpointConfigSchema[],
  log: boolean,
  prefix: string,
  target: string,
  cache: CacheConfigSchema
}>;

// type InterpretedProxyInstanceConfigSchema = Partial<{
//   log: boolean,
//   cache: InterpretedCacheConfigSchema
// }>;

type OutputConfigSchema = {
  target: Target,
  delay: number,
  cache: {
    write: boolean,
    read: boolean | string,
    read_status?: number
  },
  log: boolean,
  transformer?: string
};

const defaultConfig: OutputConfigSchema = {
  target: "skinsearch.dev",
  delay: 0,
  log: false,
  cache: {
    write: false,
    read: false
  }
};

const defaultPort = 9991;
export type OutputSetupConfigSchema = {
  loginTarget: string,
  instances: {
    key: string,
    target: string,
    port: number,
    log: boolean
  }[]
};

export const getSetupConfig = (): OutputSetupConfigSchema => {
  if (!config)
    return {
      loginTarget: defaultConfig.target,
      instances: []
    };

  let c = defaultConfig;
  if (config.default)
    c = deepMerge(c, config.default);

  let port = defaultPort;

  const instances = objectEntries(config).filter(([key]) => key !== "default");
  const interpretedInstances = instances.map(([key, value]) => ({
    key,
    target: value.target 
      ? value.target
      : value.prefix
      ? `${value.prefix}.${c.target}`
      : c.target,
    port: value.port ?? port++,
    log: value.log ?? c.log
  }));

  return {
    loginTarget: interpretedInstances.find(i => i.key === "main")?.target ?? defaultConfig.target,
    instances: interpretedInstances
  };
};

export const getConfig = (instanceKey: string, path?: string | undefined | null): OutputConfigSchema => {
  if (!config)
    return defaultConfig;

  let c = JSON.parse(JSON.stringify(defaultConfig)) as typeof defaultConfig;
  if (config.default)
    c = deepMerge(c, config.default);

  if (!path)
    return c;

  const { port, endpoints, ...instanceConfig } = config[instanceKey];
  c = deepMerge(c, instanceConfig);

  if (endpoints) {
    const matches = endpoints.filter(item => {
      const paths = item.paths.split(", ");
      return paths.includes(path) || !!paths.find(p => {
        return globToRegex(p).test(path);
      });
    });

    for (const match of matches) {
      const interpretedConfig = interpretConfig(match);
      c = deepMerge(c, interpretedConfig);
    }
  }
  
  return c;
};

const interpretCacheConfig = (config?: CacheConfigSchema): Partial<InterpretedCacheConfigSchema> => {
  if (!config)
    return {};

  if (typeof config === "boolean")
    return { write: config, read: config };

  return config;
};

const interpretConfig = (config: EndpointConfigSchema): RecursivePartial<OutputConfigSchema> => {
  const {
    cache,
    paths,
    ...other
  } = config;

  return {
    cache: interpretCacheConfig(cache),
    ...other
  };
};

// const interpretInstanceConfig = (config: ProxyInstanceConfigSchema): RecursivePartial<InterpretedProxyInstanceConfigSchema> => {
//   const {
//     cache,
//     ...other
//   } = config;

//   return {
//     cache: interpretCacheConfig(cache),
//     ...other
//   };
// };
