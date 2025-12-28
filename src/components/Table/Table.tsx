import "./Table.scss";

type Props<K extends string> = {
  cols: {
    name: K,
    width: number,
    stick?: "start" | "end"
  }[],
  items: Record<K, any>[]
};

export const Table = <K extends string>({ cols, items }: Props<K>) => {
  const startCols = cols.filter(c => c.stick === "start");
  const middleCols = cols.filter(c => c.stick === undefined);
  const endCols = cols.filter(c => c.stick === "end");

  return <div className="table">
    <header>
      {/* <Checkbox
        value={false}
        onChange={() => {
          
        }}
      /> */}
      {[startCols, middleCols, endCols].map(group => {
          if (group.length === 0) return;
          return <div className="group" data-group={group[0].stick}>
            {group.map(col => 
              <div
                key={col.name}
                style={{ width: col.width, minWidth: col.width }}
              >
                {col.name}
              </div>
            )}
          </div>;
        })}
    </header>
    <div className="items">
      {items.map((item, index) => 
        <div className="item" key={index}>
        {/* <Checkbox
          value={item.active}
          onChange={() => {
            // bridge.send("proxy:cookies:active",
            //   bridgeItems
            //     .filter(c => c.name === item.name ? !c.active : c.active)
            //     .map(c => c.name)
            // );
          }}
        /> */}
        {[startCols, middleCols, endCols].map(group => {
          if (group.length === 0) return;
          return <div className="group" data-group={group[0].stick}>
            {group.map(col => <CellInput
              key={col.name}
              value={item[col.name].toString()}
              onChange={() => { } }
              style={{ width: col.width, minWidth: col.width }} />
            )}
          </div>;
        })}
      </div>)}
    </div>
  </div>
}

type CellInputProps = {
  value: string,
  onChange: (v: string) => void,
  style?: React.CSSProperties
};

const CellInput = ({ value, onChange, style }: CellInputProps) => {
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