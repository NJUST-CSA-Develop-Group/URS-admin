const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: {
        index: './src/app.tsx'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    module: {
        rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                material: {
                    test: /[\\/]node_modules[\\/]@material-ui[\\/]/,
                    name: 'material',
                    chunks: 'all'
                },
                commons: {
                    test: /[\\/]node_modules[\\/](?!@material-ui[\\/])/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({
            template: 'assets/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true,
                minifyCSS: true
            }
        }),
        new CopyWebpackPlugin([{ from: 'assets/loaders.min.css' }])
    ]
}
