const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const bundleOutputDir = './dist';
var copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env)=>{
    return [
        {
            entry:'./src/main.js',
            output:{
                filename:'calculator-widget.js',
                path:path.resolve(bundleOutputDir)
            },
            devServer:{
                contentBase:bundleOutputDir
            },
            plugins:[
                new webpack.SourceMapDevToolPlugin(),
                new copyWebpackPlugin([
                    {
                        from:'html/'
                    }
                ])
            ],
            module:{
                rules:[
                    { test: /.html$/i, use:'html-loader'},
                    { test: /\.css$/i, use:['style-loader','css-loader']},
                    { test: /\.png$/i, use:[
                        'file-loader',
                        {
                            loader:'image-webpack-loader',
                            options:{
                                bypassOnDebug:true,
                                disable:true
                            }
                        }
                        ]}
                ]
            }
        }
    ]
};