import { Icon } from "@iconify/react";
import "./Titlebar.scss";
import { useEffect, useState } from "react";
const ipc = (window as any).ipcRenderer;

export const Titlebar = () => {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    const ipc = (window as any).ipcRenderer;

    ipc.invoke("window:isMaximized").then((isMax: boolean) => {
      console.log("CHANGE");
      setMaximized(isMax);
    });

    const listener = (_: any, state: { maximized: boolean }) => {
      console.log("listener", state);
      setMaximized(state.maximized);
    };

    ipc.on("window:state", listener);
    return () => ipc.off("window:maximized", listener);
  }, []);

  const handleMinimize = () => ipc.send("window:minimize");
  const handleMaximize = () => ipc.send("window:maximize");
  const handleUnmaximize = () => ipc.send("window:unmaximize");
  const handleClose = () => ipc.send("window:close");

  return <div className="titlebar">
    <div className="titlebar-drag-region">
      <img src="/transparent-logo.svg" className="logo" />
    </div>
    <div className="titlebar-buttons">
      <button onClick={handleMinimize}>
        <Icon icon="mingcute:minimize-fill" />
      </button>
      {maximized ? <button onClick={handleUnmaximize}>
        <Icon icon="mingcute:restore-fill" />
      </button> : <button onClick={handleMaximize}>
        <Icon icon="mingcute:fullscreen-fill" />
      </button>}
      <button className="close" onClick={handleClose}>
        <Icon icon="mingcute:close-fill" />
      </button>
    </div>
  </div>
}