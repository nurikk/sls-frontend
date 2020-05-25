import { Component, ComponentChild, h } from "preact";
import { Device } from "../../types";
import flatten from "lodash/flatten";
import cx from "classnames";
interface DeviceSelectorProps {
    devices: Device[];
    device: Device;
    onSelect(device: Device): void;
}
export const deviceDisplayName = (dev: Device): string => {
    return `${dev.nwkAddr} (${dev.friendly_name ? dev.friendly_name : dev.ModelId})`;
}
export class DeviceSelector extends Component<DeviceSelectorProps, {}>{
    onChange = (e: Event): void => {
        const { onSelect, devices } = this.props;
        const { target } = e;
        const selected = (target as HTMLSelectElement).value;
        const selectedDevice = devices.find(dev => dev.nwkAddr === selected);
        onSelect(selectedDevice);
    }
    render(): ComponentChild {
        const { devices, device } = this.props;
        const options = devices
            .map(dev => <option selected={device && dev.nwkAddr === device.nwkAddr}
                                   value={dev.nwkAddr}>{deviceDisplayName(dev)}</option>);

        options.unshift(<option hidden>Select device ({options.length})</option>);

        return <select onChange={this.onChange}>{options}</select>;
    }
}