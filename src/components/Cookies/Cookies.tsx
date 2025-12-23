import { Checkbox } from "@components/Checkbox";
import "./Cookies.scss";
import { bridge, useBridgeState } from "@utilities/bridge";

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
  const bridgeItems = useBridgeState<CookieSchema[]>("cookies:list", []);

  return <div className="cookies">
    <div className="items">
      {bridgeItems.map((item, index) => 
        <div className="item" key={index}>
          <Checkbox
            value={item.active}
            onChange={() => {
              bridge.send("cookies:set", 
                bridgeItems
                  .filter(c => c.name === item.name ? !c.active : c.active)
                  .map(c => c.name)
              );
            }}
          />
          <CellInput
            value={item.name}
            onChange={() => {}}
          />
          <CellInput
            value={item.value}
            onChange={() => {}}
          />
        </div>
      )}
    </div>
  </div>
}

type Props = {
  value: string,
  onChange: (v: string) => void
};

const CellInput = ({ value, onChange }: Props) => {
  return <div className="cell-input">
    <input 
      value={value}
      onInput={e => onChange((e.target as HTMLInputElement).value)}
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="off"
      autoComplete="off"
    />
  </div>
};