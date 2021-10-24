import { Tooltip } from "antd";

function BaseTooltip(props) {
  return <Tooltip mouseEnterDelay={1.5} {...props} />;
}

export default BaseTooltip;
