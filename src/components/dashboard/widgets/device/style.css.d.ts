declare namespace StyleCssModule {
    export interface IStyleCss {
        actions: string;
        body: string;
        header: string;
        icon: string;
        status: string;
        statuses: string;
        widget: string;
    }
}

declare const StyleCssModule: StyleCssModule.IStyleCss & {
    /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
    locals: StyleCssModule.IStyleCss;
};

export = StyleCssModule;
