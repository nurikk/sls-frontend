declare namespace StyleCssModule {
    export interface IStyleCss {
        body: string;
        container: string;
        "dnd-list": string;
        "dnd-list-item": string;
        draggable: string;
        header: string;
        icon: string;
        placed: string;
        widget: string;
        "widget-component": string;
    }
}

declare const StyleCssModule: StyleCssModule.IStyleCss & {
    /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
    locals: StyleCssModule.IStyleCss;
};

export = StyleCssModule;
