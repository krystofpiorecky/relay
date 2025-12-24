import { Checkbox } from "@components/Checkbox";
import "./Cookies.scss";
import { bridge, useBridgeState } from "@utilities/bridge";
import { Icon } from "@iconify/react";

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

const COL_WIDTHS = [
  150,
  400,
  150,
  150,
  100,
  100,
  100,
];

const COL_NAMES: (keyof CookieSchema)[] = [
  "name",
  "value",
  "expires",
  "domain",
  "path",
  "httpOnly",
  "secure"
];

export const Cookies = () => {
  const [ bridgeItems ] = useBridgeState<CookieSchema[]>("proxy:cookies", []);

  return <div className="cookies">
    <button>
      <Icon icon="mingcute:add-fill" />
      New Cookie
    </button>
    <header>
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
    </div>
  </div>
}

type Props = {
  value: string,
  onChange: (v: string) => void,
  style?: React.CSSProperties
};

const CellInput = ({ value, onChange, style }: Props) => {
  return <div className="cell-input">
    <input 
      value={value}
      onInput={e => onChange((e.target as HTMLInputElement).value)}
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="off"
      autoComplete="off"
      style={style}
    />
  </div>
};