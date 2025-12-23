import { Icon } from "@iconify/react";
import "./Checkbox.scss";

type Props = {
  value: boolean,
  onChange: (v: boolean) => void
};

export const Checkbox = ({ value, onChange }: Props) => {
  return <button
    className="checkbox"
    onClick={() => onChange(!value)}
    data-active={value}
  >
    <Icon icon="mingcute:check-2-fill" />
  </button>
}
