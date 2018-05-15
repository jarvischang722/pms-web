const path = require('path');
const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const config = {
    entry: {
        "/common/BacUIComps": "./public/src/common/bacUIComps/main.js",
        "/sales/PMS0610010": ["./public/src/sales/PMS0610010/main.js", "./public/src/sales/PMS0610010/store.js"],
        "/sales/PMS0620020": "./public/src/sales/PMS0620010/main.js",
        "/sales/PMS0620050": "./public/src/sales/PMS0620050/main.js",
        "/setup/PMS0810230_setup": "./public/src/setup/PMS0810230/main.js",
        "/reservation/PMS0110010": "./public/src/reservation/PMS0110010/main.js",
        "/reservation/PMS0110040": "./public/src/reservation/PMS0110040/main.js",
        "/reservation/PMS0110050": "./public/src/reservation/PMS0110050/main.js",
        "/system/permissionSetup": ["./public/src/admin/permission/permissionSetup", "./public/src/admin/permission/store"],
        "/system/prgPropsSetup": "./public/src/admin/prgPropsSetup/main.js"
    },
    output: {
        path: path.join(__dirname, 'public', 'js'),
        filename: '[name].js'
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
    // module.exports.devtool = '#source-map';
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            comments: false,        //去掉註解
            compress: {
                warnings: false     //忽略警告
            }
        }),
        new CompressionWebpackPlugin({ //gzip 壓縮
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(js|css)$'    //壓縮 js 與 css
            ),
            threshold: 10240,
            minRatio: 0.8
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]);
}

module.exports = config;