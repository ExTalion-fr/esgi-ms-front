export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
        head: {
            title: 'ESGI-MS',
                htmlAttrs: {
                    lang: 'fr'
                },
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { hid: 'description', name: 'description', content: '' },
                { name: 'format-detection', content: 'telephone=no' }
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
            ]
        },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '@node_modules/@fortawesome/fontawesome-free/css/all.css',
        '@assets/css/main.scss',
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        "@nuxtjs/axios",
    ],

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        extend(config, ctx) {
            if (ctx.isDev) {
                config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
            }
        }
    },

    axios: {
        baseURL: 'http://127.0.0.1/esgi-ms-back/'
    }

}