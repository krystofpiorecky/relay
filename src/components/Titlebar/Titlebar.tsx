import { Icon } from "@iconify/react";
import "./Titlebar.scss";
import { Page } from "@utilities/page";
import { bridge, useBridgeState } from "@utilities/bridge";

type Props = {
  page: Page,
  onPageChange: (v: Page) => void
};

export const Titlebar = ({ page, onPageChange }: Props) => {
  const [ maximized ] = useBridgeState<boolean>("window:isMaximized", false);

  const handleMinimize = () => bridge.send("window:minimize");
  const handleMaximize = () => bridge.send("window:maximize");
  const handleUnmaximize = () => bridge.send("window:unmaximize");
  const handleClose = () => bridge.send("window:close");

  return <div className="titlebar">
    <nav>
      <img src="/transparent-logo.svg" className="logo" />
      <button onClick={() => onPageChange("feed")} data-active={page === "feed"}>
        <Icon icon="mingcute:transfer-fill" />
        Feed
      </button>
      <button onClick={() => onPageChange("cookies")} data-active={page === "cookies"}>
        <Icon icon="mingcute:cookie-fill" />
        Cookies
      </button>
      <button onClick={() => onPageChange("cache")} data-active={page === "cache"}>
        <Icon icon="mingcute:storage-fill" />
        Cache
      </button>
    </nav>
    <div className="titlebar-drag-region"></div>
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
};
