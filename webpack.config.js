const path = require('path');
const webpack = require('webpack');
const config = {
    // entry: "./public/src/reservation/PMS0110010/PMS0110010.js",
    entry: "./public/src/setUp/PMS0810230/PMS0810230.js",
    // // entry: [
    // //     'webpack/hot/dev-server',
    // //     path.join(__dirname, 'public', 'src')
    // // ],
    // entry: {
    //     permissionSetup: ["./public/src/admin/permission/permissionSetup", "./public/src/admin/permission/store"]
    //     // store: ".／/public/src/admin/permission/store"
    //     // 'PMS0610010.main': "./public/src/sales/PMS0610010.js"
    //     // 'BacUIComps': "./public/src/components/common/bacUIComps/main"
    //     // c: ["./c", "./d"]
    // },
    output: {
        publicPath: '/dist',
        // path: path.join(__dirname, 'public', 'js/reservation/'),
        path: path.join(__dirname, 'public', 'js/setUp/'),
        // filename: 'permissionSetup.js'
        filename: 'PMS0810230_setUp.js'

    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        /**
         * Vue v2.x 之後 NPM Package 預設只會匯出 runtime-only 版本
         */
        alias: {
            vue: 'vue/dist/vue.js'
        },
        extensions: ['.js', '.vue']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()

    ],
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    devtool: '#eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]);
}

module.exports = config;