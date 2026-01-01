import { useEffect, useState } from "react";

export const bridge = (window as any).ipcRenderer;



export const useBridgeState = <T extends any, P extends any = any>(key: string, d: T, p?: P): [ T, (v: T, p?: boolean) => void ] => {
  const [ data, setData ] = useState(d);

  useEffect(() => {
    bridge.invoke(key, p).then((state: T) => {
      setData(state);
    });

    const listener = (_: any, state: T) => setData(state);
    if (!p) bridge.on(key, listener);
    // listend for changes for states without parameters

    return () => {
      if (!p) bridge.off(key, listener);
    }
  }, [ key, p ]);

  return [
    data,
    (v: T, preventLocalChange: boolean = false) => {
      if (!preventLocalChange) setData(v);
      bridge.send(key, v, p);
    }
  ];
};

