import { Component, ComponentChild, createRef, Fragment, h } from "preact";

import { GlobalState } from "../../store";
import actions, { Actions } from "../../actions";
import { connect } from "unistore/preact";
import style from "./style.css";
import DeviceWidget, { getStatusText } from "./widgets/device";
import { MoveableInterface } from "preact-moveable";
import { useEffect } from "preact/hooks";
import { Plugins, Swappable } from "@shopify/draggable";


import cx from "classnames";
import { Device } from "../../types";
import { deviceDisplayName, DeviceSelector } from "../device-page/device-selector";
import SafeImg from "../safe-image";
import { genDeviceImageUrl } from "../../utils";
import DeviceControlGroup  from "../device-control";



export interface Item {
    title: string;
    body: string;
    transform?: string;
}

export interface DashboardState {
    followLog: boolean;
    items: Item[];
    target: any;
    isResizable: boolean;
    renderMovable: boolean;
    device?: Device;
}





export class Dashboard extends Component<GlobalState & Actions, DashboardState> {
    public moveable: MoveableInterface;

    constructor() {
        super();
        this.state = {
            renderMovable: false,
            followLog: true,
            items: [
            ],
            target: null,
            isResizable: true
        };
    }

    onMoveItem = (source: number, dest: number) => {
        const { items } = this.state;
        const sourceItem = items.splice(source, 1);
        items.splice(dest, 0, ...sourceItem);
        this.setState({ items });
    };


    componentDidMount(): void {
        const { getZigbeeDevicesList } = this.props;
        getZigbeeDevicesList(true).then();
    }

    public onClick = (e: MouseEvent) => {
        e.preventDefault();

        if (!this.moveable.isMoveableElement(e.target as HTMLElement)) {
            if (this.state.target === e.target) {
                this.moveable.updateRect();
            } else {
                this.setState({
                    target: e.target
                });
            }
        }
    };

    renderDeviceSelect(): ComponentChild {
        const { devices } = this.props;
        return (
            <select class="custom-select">
                <option selected>Open this select menu</option>
                {devices.map(device => (<option value={device.nwkAddr}>{device.nwkAddr} ({device.friendly_name ? device.friendly_name : device.ModelId})</option>))}
            </select>
        )
    }

    onDeiceSelect = (device: Device): void => {
        this.setState({device});
    }

    render(): ComponentChild {
        const { device } = this.state;
        const { devices } = this.props;
        useEffect(() => {
            const containerSelector = `.${style.container}`;
            const draggableSelector = `.${style.draggable}`;
            const containers = document.querySelectorAll(containerSelector);

            if (containers.length === 0) {
                return;
            }

            const swappable = new Swappable(containers, {
                draggable: draggableSelector,
                mirror: {
                    appendTo: containerSelector,
                    constrainDimensions: true,
                },
                plugins: [Plugins.ResizeMirror],
            });

            // const containers = document.querySelectorAll(`.${style.container}`);
            //
            // if (containers.length === 0) {
            //     return;
            // }
            //
            // const sortable = new Sortable(containers, {
            //     draggable: `.${style.draggable}`,
            //     mirror: {
            //         constrainDimensions: true
            //     },
            //     plugins: [Plugins.ResizeMirror]
            // });
            //
            // const containerTwoCapacity = 3;
            // const containerTwoParent = sortable.containers[1].parentNode;
            // let currentMediumChildren;
            // let capacityReached;
            // let lastOverContainer;
            //
            // // --- Draggable events --- //
            // sortable.on("drag:start", (evt) => {
            //     currentMediumChildren = sortable.getDraggableElementsForContainer(sortable.containers[1]).length;
            //     capacityReached = currentMediumChildren === containerTwoCapacity;
            //     lastOverContainer = evt.sourceContainer;
            //     containerTwoParent.classList.toggle(Classes.capacity, capacityReached);
            // });
            //
            // sortable.on("sortable:sort", (evt) => {
            //     if (!capacityReached) {
            //         return;
            //     }
            //
            //     const sourceIsCapacityContainer = evt.dragEvent.sourceContainer === sortable.containers[1];
            //
            //     if (!sourceIsCapacityContainer && evt.dragEvent.overContainer === sortable.containers[1]) {
            //         evt.cancel();
            //     }
            // });
            //
            // sortable.on("sortable:sorted", (evt) => {
            //     if (lastOverContainer === evt.dragEvent.overContainer) {
            //         return;
            //     }
            //
            //     lastOverContainer = evt.dragEvent.overContainer;
            // });

        }, []);
        return (
            <section>
                <article>
                    <div>Available components</div>
                    <DeviceSelector device={device} devices={devices} onSelect={this.onDeiceSelect} />
                    <div class={cx("container", style.container)}>
                        {
                            device ? <Fragment>
                                {/*<div class={"card"}><DeviceWidget device={device} /></div>*/}
                                <div class="row">
                                        <div class={cx(style["widget-component"], style.draggable)}>
                                            <DeviceControlGroup device={device} />
                                        </div>

                                        <div class={cx(style["widget-component"], style.draggable)}>
                                            {deviceDisplayName(device)}
                                        </div>

                                        <div class={cx(style["widget-component"], style.draggable)}>
                                            <SafeImg src={genDeviceImageUrl(device)} />
                                        </div>

                                    {getStatusText(device).filter(child => child).map(child => (
                                            <div class={cx(style["widget-component"], style.draggable)}>
                                                {child}
                                            </div>
                                    ))}

                                </div>
                            </Fragment> : 'Select device'
                        }

                    </div>
                </article>

                <div>WIDGET:</div>
                <div class={cx('card', style.widget)}>
                    <div class={cx("container", style.container, style.header)}>
                            <div class={cx(style["widget-component"], style.draggable)} />
                            <div class={cx(style["widget-component"], style.draggable)} />
                            <div class={cx(style["widget-component"], style.draggable)} />
                    </div>
                    <div class={cx("container", style.container, style.body)}>
                        <div class={cx(style["widget-component"], style.draggable)} />
                        <div class={cx(style["widget-component"], style.draggable)} />
                        <div class={cx(style["widget-component"], style.draggable)} />
                    </div>
                </div>

            </section>
        );
        // return (
        //     <div class="card-columns">
        //             {devices.map(device => (
        //                 <div class="card">
        //                     <DeviceWidget device={device} />
        //                 </div>
        //             ))}
        //     </div>
        // );
    }
}

const mappedProps = ["devices"];
const ConnectedDashboard = connect<{}, DashboardState, GlobalState, Actions>(mappedProps, actions)(Dashboard);
export default ConnectedDashboard;