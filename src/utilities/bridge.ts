import { useEffect, useState } from "react";

export const bridge = (window as any).ipcRenderer;

export const useBridgeState = <T extends any>(key: string, d: T): T => {
  const [ data, setData ] = useState(d);

  useEffect(() => {
    bridge.invoke(key).then((state: T) => {
      setData(state);
    });

    const listener = (_: any, state: T) => setData(state);
    bridge.on(key, listener);
    return () => bridge.off(key, listener);
  }, []);

  return data;
};
