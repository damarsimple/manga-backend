// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");

const Dotenv = require("dotenv-webpack");

const isProduction = process.env.NODE_ENV == "production";

const config = {
    entry: "./src/browsers/src/index.ts",
    output: {
        path: path.resolve(__dirname, "src/browsers/dist"),
    },
    plugins: [
        new Dotenv(),
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [{
                test: /\.(ts|tsx)$/i,
                loader: "ts-loader",
                exclude: ["/node_modules/"],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset",
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        fallback: { os: require.resolve("os-browserify/browser") },
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = "production";
    } else {
        config.mode = "development";
    }

    config.devtool = "inline-source-map";

    return config;
};