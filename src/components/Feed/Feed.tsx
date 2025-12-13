import { Icon } from "@iconify/react";
import "./Feed.scss";
import { useEffect, useState } from "react";

type ProxyInfoSchema = {
  name: string,
  icon: string
};

type FeedItemSchema = {
  proxy: ProxyInfoSchema,
  url: {
    pathname: string,
    search: string
  },
  configs: number,
  request: {
    timestamp: number
  },
  proxyRequest?: {
    timestamp: number,
  },
  proxyResponse?: {
    status: number,
    size: number,
    timestamp: number
  },
  response?: {
    status: number,
    size: number,
    timestamp: number
  }
};

const useBridgeState = <T extends any>(key: string, d: T): T => {
  const [ data, setData ] = useState(d);

  useEffect(() => {
    const ipc = (window as any).ipcRenderer;

    const listener = (_: any, state: T) => setData(state);
    ipc.on(key, listener);
    return () => ipc.off(key, listener);
  }, []);

  return data;
};

export const Feed = () => {
  const bridgeItems = useBridgeState<FeedItemSchema[]>("proxy:feed", []);

  const filteredItems = bridgeItems
    .filter(item => item.proxy.name !== "s3");
  
  const sortedItems = filteredItems
    .sort((a, b) => b.request.timestamp - a.request.timestamp);

  return <div className="feed">
    {sortedItems.map((item, index) => <div className="item" key={index}>
      <FeedItemStatus {...item} />
      <div className="url">
        <span className="proxy">
          {item.proxy.name}
        </span>
        <span className="pathname">
          {item.url.pathname}
        </span>
        <span className="search">
          {item.url.search}
        </span>
      </div>
    </div>)}
  </div>
}

const FeedItemStatus = (item: { response?: { status: number } }) => {
  if (!item.response)
    return <div className="status status-loading">
      <Icon icon="svg-spinners:ring-resize" />
    </div>

  const status = item.response.status;
  const color = status >= 400
    ? "128, 0, 0"
    : status >= 300
    ? "128, 0, 128"
    : status >= 200 && status <= 399
    ? "36, 128, 0"
    : "0, 98, 128";

  return <div className="status">
    <div className="status-badge" style={{ backgroundColor: `rgba(${color})` }}>
      {item.response.status}
    </div>
  </div>
}
