import { Icon } from "@iconify/react";
import "./Feed.scss";
import { useState } from "react";
import { useBridgeState } from "@utilities/bridge";

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

export const Feed = () => {
  const bridgeItems = useBridgeState<FeedItemSchema[]>("proxy:feed", []);
  const [ activeItem, setActiveItem ] = useState<FeedItemSchema>();

  const filteredItems = bridgeItems
    .filter(item => item.proxy.name !== "s3");
  
  const sortedItems = filteredItems
    .sort((a, b) => b.request.timestamp - a.request.timestamp);
  
  const toggleItem = (item: FeedItemSchema) => {
    if (item === activeItem) setActiveItem(undefined);
    else setActiveItem(item);
  };

  return <div className="feed">
    <div className="items">
      {sortedItems.map((item, index) => 
        <div className="item" key={index} onClick={() => toggleItem(item)} data-active={item === activeItem}>
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
        </div>
      )}
    </div>
    {activeItem && <div className="detail">
      <div className="badges">
        <FeedItemStatus {...activeItem} />
        <span className="proxy">
          {activeItem.proxy.name}
        </span>
      </div>
      <h2>
        <span className="pathname">
          {activeItem.url.pathname}
        </span>
        <span className="search">
          {activeItem.url.search}
        </span>
      </h2>
      <div className="route">
        <div className="item">
          <Icon icon="mingcute:arrow-to-right-fill" />
          <div>
            <div className="name">Received request</div>
          </div>
        </div>
        <div className="item">
          <Icon icon="mingcute:arrows-right-fill" />
          <div>
            <div className="name">Sent request to target</div>
            <div className="fullUrl">https://example.com{activeItem.url.pathname}{activeItem.url.search}</div>
          </div>
        </div>
        <div className="item">
          <Icon icon="mingcute:arrows-left-fill" />
          <div>
            <div className="name">Received response</div>
            <div className="snippet"></div>
          </div>
        </div>
        <div className="item">
          <Icon icon="mingcute:save-2-fill" />
          <div>
            <div className="name">Saved response to cache</div>
            <div className="fullUrl">D:/example{activeItem.url.pathname}</div>
          </div>
        </div>
        <div className="item">
          <Icon icon="mingcute:transfer-fill" />
          <div>
            <div className="name">Transformed: inventory</div>
            <div className="snippet"></div>
          </div>
        </div>
        <div className="item">
          <Icon icon="mingcute:align-arrow-left-fill" />
          <div>
            <div className="name">Sent response to client</div>
            <div className="snippet"></div>
          </div>
        </div>
      </div>
    </div>}
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
