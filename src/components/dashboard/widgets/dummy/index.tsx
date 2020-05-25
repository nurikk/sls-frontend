import { FunctionalComponent, h } from "preact";
import style from './style.css';
import SafeImg from "../../../safe-image";

const DummyWidget: FunctionalComponent<{body: string; title: string; img?: string}> = (props) => {
    const { body , title, img } = props;
    return (
        <div class={style.widget}>
            <div class={style.header}><span>Лампа в зале</span><span>Зал</span></div>
            <div class={style.body}>
                <div class={style.icon}>
                    <SafeImg src={"https://raw.githubusercontent.com/slsys/Gateway/master/devices/png/lumi.sensor_ht.png"} />
                </div>
                <div>24.5C</div>
                <div class={style.actions}>
                    <i class="fas fa-power-off" />
                </div>
            </div>
        </div>
    )
}
export default DummyWidget;