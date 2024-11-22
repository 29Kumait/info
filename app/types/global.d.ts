declare module 'postcss-lightningcss' {
    import { PluginCreator } from 'postcss';
    const lightningcss: PluginCreator<any>;
    export default lightningcss;
}

declare module 'browserslist-to-targets' {
    function browserslistToTargets(browserslist: string[]): any;
    export default browserslistToTargets;
}