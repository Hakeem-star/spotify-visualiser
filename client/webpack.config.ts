import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import path from "path";
import * as webpack from "webpack";
import * as webpackDevServer from "webpack-dev-server";

const config: (env: any, argv: any) => webpack.Configuration = (env, argv) => {
  console.log({ argv: argv.mode });

  function modeURL() {
    if (argv.mode === "development") {
      return [
        new webpack.DefinePlugin({
          SERVER_URL: JSON.stringify("http://localhost:3000"),
        }),
      ];
    } else {
      return [
        new webpack.DefinePlugin({
          SERVER_URL: JSON.stringify(
            "https://us-central1-spotify-visualiser-293211.cloudfunctions.net/app"
          ),
        }),
      ];
    }
  }

  return {
    entry: "./src/index.tsx",
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: [/node_modules/],
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
                "@emotion/babel-preset-css-prop",
              ],
              plugins: [
                [
                  "@babel/plugin-transform-runtime",
                  {
                    regenerator: true,
                  },
                ],
              ],
            },
          },
        },

        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg|gif)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "bundle.js",
    },
    devServer: {
      contentBase: path.join(__dirname, "build"),
      historyApiFallback: true,
      compress: true,
      port: 4000,
      hot: true,
    },
    plugins: [
      ...modeURL(),
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [{ from: "src/index.html" }],
      }),
      new ForkTsCheckerWebpackPlugin({
        async: false,
        // eslint: {
        //   files: "./src/**/*.{ts,tsx,js,jsx}",
        // },
      }),
    ],
  };
};

export default config;
