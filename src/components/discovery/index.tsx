import { h, ComponentChild, Component } from "preact";
import { Device, InterviewState, InterviewStateLabels, inteviewsCount } from "../../types";
import { genDeviceShortAddress, genDeviceDetailsLink } from "../../utils";
import DeviceControlGroup from "../device-control";
import style from "./style.css";
import cx from 'classnames';
import { ZigbeeEvent, WebsocketMessage, ZigbeePayload } from "./types";
const ws = new WebSocket("ws://192.168.1.209:81/log");
interface DeviceCardProps {
    device: Device;
}

// eslint-disable-next-line react/prefer-stateless-function
class DeviceCard extends Component<DeviceCardProps, {}> {
    getInterviewText(): string {
        const { device } = this.props;
        return InterviewStateLabels.get(device.Interview?.State) || InterviewStateLabels.get(InterviewState.StateUnknown);
    }

    render(): ComponentChild {
        const { device } = this.props;
        const progressValue = 100 / inteviewsCount * device?.Interview?.State;
        const isDone = device?.Interview?.State === inteviewsCount;

        return (
            <div className={cx('card', style["discovery-card"])}>
                <div class="card-header">
                    New device <a href={genDeviceDetailsLink(device.nwkAddr)}>{genDeviceShortAddress(device.nwkAddr)}</a>
                    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                </div>
                <div className="card-body">
                    {!isDone ? (<p className="card-text">
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped progress-bar-animated" style={`width: ${progressValue}%;`} aria-valuenow={progressValue} aria-valuemin="0" aria-valuemax="100" >{progressValue}%</div>
                        </div>
                    </p>) : null}


                    <div class="row">
                        <div class="col">Current status:</div>
                        <div class="col">
                            {this.getInterviewText()}
                        </div>
                    </div>

                    {device.ieeeAddr ? (<div className={`row ${style["scale-in-center"]}`}>
                        <div class="col">ieeeAddr:</div>
                        <div class="col">
                            {device.ieeeAddr}
                        </div>
                    </div>) : null}


                    {device.ep ? (<div className={`row ${style["scale-in-center"]}`}>
                        <div class="col">Enpoints:</div>
                        <div class="col">
                            {Object.keys(device.ep).join(', ')}
                        </div>
                    </div>) : null}

                    {device.ManufName ? (<div className={`row ${style["scale-in-center"]}`}>
                        <div class="col">Manufacturer:</div>
                        <div class="col">
                            {device.ManufName}
                        </div>
                    </div>) : null}

                    {device.ModelId ? (<div className={`row ${style["scale-in-center"]}`}>
                        <div class="col">ModelId:</div>
                        <div class="col">
                            {device.ModelId}
                        </div>
                    </div>) : null}

                    {device?.st?.battery ? (<div className={`row ${style["scale-in-center"]}`}>
                        <div class="col">Battery:</div>
                        <div class="col">
                            {device?.st?.battery}
                        </div>
                    </div>) : null}

                    {device?.st?.linkquality ? (<div className={`row ${style["scale-in-center"]}`}>
                        <div class="col">Link quality:</div>
                        <div class="col">
                            {device?.st?.linkquality}
                        </div>
                    </div>) : null}
                    {device.ModelId ? <img class="img-fluid card-img-bottom h-25" src="https://www.zigbee2mqtt.io/images/devices/4713407.jpg" alt="Card image cap" /> : null}
                </div>
                {isDone ? <div className="card-footer"><DeviceControlGroup device={device} /></div> : null}
            </div>
        )
    }
}
interface DiscoveryState {
    devices: Device[];
}

const isZigbeeEvent = (event: string | ZigbeePayload): event is ZigbeePayload => {
    return typeof event !== "string";
}

export default class Discovery extends Component<{}, DiscoveryState> {
    constructor() {
        super();
        this.state = {
            devices: []
        }

    }
    onMessageRecieve = (wsEvent: MessageEvent): void => {

        try {

            const event = JSON.parse(wsEvent.data) as WebsocketMessage;
            switch (event.category) {
                case "log":
                    // console.log(event.payload);
                    break;
                case "zigbee":
                    // eslint-disable-next-line no-case-declarations
                    const payload = event.payload as ZigbeePayload;

                    switch (payload.event) {
                        case "LinkData":
                            // console.log("LinkData", payload.payload);
                            break;
                        default:
                            console.log(wsEvent.data);
                            console.log(payload);
                            break;

                    }

                    break;
                default:
                    console.warn("Unknow event", event);
                    break;
            }

            // const { devices } = this.state;
            // this.setState({
            //     devices: { ...devices, ...newDevices }
            // });
        } catch (e) {
            // console.log('wsEvent', wsEvent);
            // console.error('Bad event', wsEvent.data);
        }

        // console.log(newDevices);
    }
    connectWS = (): void => {
        ws.addEventListener("open", (): void => {
            console.log("[WS] Connected!")
            ws.send("hello");
        });

        ws.addEventListener("message", this.onMessageRecieve);
        ws.addEventListener("error", (event) => {
            console.error(event);
        })
    }

    componentDidMount(): void {
        this.connectWS();
    }
    render(): ComponentChild {
        const { devices } = this.state;

        return (
            <div className="card-group">
                {devices.map(device => <DeviceCard device={device} />)}
                {devices.map(device => <DeviceCard device={device} />)}
                {devices.map(device => <DeviceCard device={device} />)}
                {devices.map(device => <DeviceCard device={device} />)}
            </div>
        );
    }

}