import path from 'path';
import webpack from 'webpack';
import nodeExternals  from 'webpack-node-externals';
import TerserPlugin  from 'terser-webpack-plugin';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import OptimizeCSSAssetsPlugin  from 'optimize-css-assets-webpack-plugin';

const server:webpack.Configuration = {
  entry:['./bin/index.ts'],
  target: 'node',
  mode: 'production',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false, // and __filename return blank or /
  },
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        loaders:['ts-loader']
      }
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        cache: true,
        parallel: true,
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ],

  },
  plugins: [
    new CleanWebpackPlugin({
      // cleanOnceBeforeBuildPatterns: [path.join(__dirname, 'dist/**/*')]
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin({
        patterns:[
          {
              from: './config',
              to: 'config', 
              // force:true
          },
          {
            from: './src/views',
            to: 'src/views',
            force:true
          },          {
            from: './src/public/static/images',
            to: 'src/public/static/images',
            // force:true
          },
        ]   
    }),

  ],
  externals: [nodeExternals()]
}
const browser:webpack.Configuration = {
  entry:{index:'./src/public/static/js/index.js',common:'./src/public/static/css/common.css'},
  target:'web',
  mode: 'production',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false, // and __filename return blank or /
  },
  resolve: {
    extensions: ['.js','.css'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'src/public/build')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use:[
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use:[
          {
            loader:MiniCssExtractPlugin.loader,
            options:{
              // publicPath: '',
              hmr:process.env.NODE_ENV === 'development',
              reloadAll:true
            },
          },
          'css-loader'
        ]
      }
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        cache: true,
        parallel: true,
        terserOptions: {
          output: {
            comments: false
          }
        }
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name].css',
      }),
      new OptimizeCSSAssetsPlugin({}),
      
    ],
    splitChunks: {
      cacheGroups: {
        common: {
          name: 'common',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new CleanWebpackPlugin({
    //   cleanOnceBeforeBuildPatterns: [path.join(__dirname, 'dist/**/*')]
    // })
    // new CopyWebpackPlugin({
    //   patterns:[
        
    //   ]
    // })
  ],
  // externals: [nodeExternals()]
}



export default [server,browser];