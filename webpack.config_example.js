const path = require('path');
const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const config = {
    // entry: "./public/src/admin/permission/permissionSetup",
    // entry: [
    //     'webpack/hot/dev-server',
    //     path.join(__dirname, 'public', 'src')
    // ],
    entry: {
        // BacUIComps: "./public/src/common/bacUIComps/main.js",
        // PMS0610010: ["./public/src/sales/PMS0610010/main.js", "./public/src/sales/PMS0610010/store.js"]
        PMS0110050: "./public/src/reservation/PMS0110050/main.js"

        // permissionSetup: ["./public/src/common/permission/permissionSetup", "./public/src/admin/permission/store"],
        // store: "./public/src/admin/permission/store"
        // a: "./a",
        // b: "./b",
        // c: ["./c", "./d"]
    },
    output: {
        publicPath: '/dist',
        path: path.join(__dirname, 'public', 'js/reservation/'),
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
        })
    ]);
}

module.exports = config;