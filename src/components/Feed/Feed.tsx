import { Icon } from "@iconify/react";
import "./Feed.scss";

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
  response?: {
    status: number,
    size: number,
    timestamp: number
  }
};

const items: FeedItemSchema[] = [{
  proxy: {
    name: "Main",
    icon: "mingcute:cat-fill"
  },
  url: {
    pathname: "/api/stash/categories",
    search: "?icon-filter=cat&keyword=ming"
  },
  configs: 4,
  request: {
    timestamp: 10
  },
  response: {
    status: 200,
    size: 4_000_000,
    timestamp: 100
  }
},{
  proxy: {
    name: "Main",
    icon: "mingcute:cat-fill"
  },
  url: {
    pathname: "/api/stash/categories",
    search: "?icon-filter=cat&keyword=ming"
  },
  configs: 4,
  request: {
    timestamp: 10
  }
},{
  proxy: {
    name: "Main",
    icon: "mingcute:cat-fill"
  },
  url: {
    pathname: "/api/stash/categories",
    search: "?icon-filter=cat&keyword=ming"
  },
  configs: 4,
  request: {
    timestamp: 10
  },
  response: {
    status: 500,
    size: 3_000_000,
    timestamp: 100
  }
},{
  proxy: {
    name: "Main",
    icon: "mingcute:cat-fill"
  },
  url: {
    pathname: "/api/stash/categories",
    search: "?icon-filter=cat&keyword=ming"
  },
  configs: 4,
  request: {
    timestamp: 10
  },
  response: {
    status: 302,
    size: 3_000_000,
    timestamp: 100
  }
},{
  proxy: {
    name: "Main",
    icon: "mingcute:cat-fill"
  },
  url: {
    pathname: "/api/stash/categories",
    search: "?icon-filter=cat&keyword=ming"
  },
  configs: 4,
  request: {
    timestamp: 10
  },
  response: {
    status: 404,
    size: 3_000_000,
    timestamp: 100
  }
}];

export const Feed = () => {
  return <div className="feed">
    {items.map((item, index) => <div className="item" key={index}>
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
