import { ComponentChild, FunctionalComponent, h } from "preact";
import style from './style.css';
import SafeImg from "../../../safe-image";
import { Device } from "../../../../types";
import { genDeviceImageUrl } from "../../../../utils";
import cx from "classnames";
// import Moveable from "preact-moveable";


export const getStatusText = (device: Device): ComponentChild[] => {
    const statuses = Object.entries(device.st ?? {});
    return statuses.map(([name, value]) => {
        switch (name) {
            case "contact":
                return <i class={cx("fas fa-magnet", style.status)} />

            case "temperature":
                return <div class={cx(style.status)} title={"temperature"}>{value}&#8451;</div>;

            case "humidity":
                return <div class={cx(style.status)} title={"humidity"}>{value}%</div>;

            case "smoke":
                return <i class={cx("fas fa-smog", style.status)} />

            case "water_leak":
                return <i class={cx("fas fa-water", style.status)} />

            case "occupancy":
                return <i class={cx("fas fa-running", style.status)} />

            case "state":
                return <div class={cx( style.status)} >{value}</div>

            default:
                console.count(name);
                return null;
        }
    });
}

const DeviceWidget: FunctionalComponent<{device: Device}> = (props) => {
    const { device } = props;
    return (
        <div class={style.widget}>
            <div class={style.header}>{device.friendly_name ? device.friendly_name : device.ieeeAddr}</div>
            <div class={style.body}>
                <div class={style.icon}>
                    <SafeImg src={genDeviceImageUrl(device)} />
                </div>
                <div class={style.statuses}>{getStatusText(device)}</div>
                <div class={style.actions}>
                    {/*<i class="fas fa-power-off" />*/}
                </div>
            </div>
        </div>
    )
}
export default DeviceWidget;