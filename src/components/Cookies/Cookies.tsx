import { Checkbox } from "@components/Checkbox";
import "./Cookies.scss";
import { bridge, useBridgeState } from "@utilities/bridge";
import { Icon } from "@iconify/react";
import { Table } from "@components/Table";

type CookieSchema = {
  name: string
  value: string,
  domain: string,
  path: string,
  httpOnly: boolean,
  secure: boolean,
  expires: number,
  active: true
};

export const Cookies = () => {
  const [ bridgeItems ] = useBridgeState<CookieSchema[]>("proxy:cookies", []);

  return <div className="cookies">
    <button>
      <Icon icon="mingcute:add-fill" />
      New Cookie
    </button>
    <Table
      cols={[
        { name: "name", width: 150, stick: "start" },
        { name: "value", width: 400  },
        { name: "expires", width: 150, },
        { name: "domain", width: 150, },
        { name: "path", width: 100, },
        { name: "httpOnly", width: 100 },
        { name: "secure", width: 100 },
      ]}
      items={bridgeItems}
    />
    {/* <header>
      <Checkbox
        value={false}
        onChange={() => {
          
        }}
      />
      {COL_NAMES.map((col, index) => 
        <div
          key={col}
          style={{
            width: COL_WIDTHS[index],
            minWidth: COL_WIDTHS[index]
          }}
        >
          {col}
        </div>
      )}
    </header>
    <div className="items">
      {bridgeItems.map((item, index) => 
        <div className="item" key={index}>
          <Checkbox
            value={item.active}
            onChange={() => {
              bridge.send("proxy:cookies:active", 
                bridgeItems
                  .filter(c => c.name === item.name ? !c.active : c.active)
                  .map(c => c.name)
              );
            }}
          />
          {COL_NAMES.map((col, index) => 
            <CellInput
              key={col}
              value={item[col].toString()}
              onChange={() => {}}
              style={{ width: COL_WIDTHS[index], minWidth: COL_WIDTHS[index] }}
            />
          )}
        </div>
      )}
    </div> */}
  </div>
}
