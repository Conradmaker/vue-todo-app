const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
require('@babel/polyfill')
// module.exports = {
//   //진입점 (가장먼저 실행될 파일)
//   entry: {
//     app: [
//       "@babel/polyfill", //폴리필 적용 (없으면 배열빼면됨)
//       path.join(__dirname, "main.js"), //app은 별칭
//     ],
//   },
//   //결과물에 대한 설정
//   output: {
//     filename: "[name].js", //app.js [name] = 진입파일 별칭
//     path: path.join(__dirname, "dist"),
//   },
//   //module,plugins는 처리과정에 들어감
//   module: {
//     rules: [
//       {
//         test: /\.vue$/, //vue라는 확장자를 찾으면
//         loader: "vue-loader", //vue로더를 통해 해석한다.
//       },
//       {
//         test: /\.js$/, //js라는 확장자를 찾으면
//         exclude: /node_modules/, //node_modules제외
//         loader: "babel-loader", //babel로더를 통해 해석한다.
//       },
//       {
//         test: /\.css$/,
//         use: [
//           "vue-style-loader", // 1st
//           "css-loader", // 2nd  //순서중요 (use사용 다른것도 use사용하면 된다.)
//         ],
//       },
//     ],
//   },
//   plugins: [
//     new VueLoaderPlugin(),
//     new HtmlWebpackPlugin({template: path.join(__dirname, "index.html")}),
//     new CopyPlugin([{from: "assets/", to: "."}]),
//     new CleanWebpackPlugin(),
//   ], //추가적인 과정
//   devServer: {
//     open: false, //실행시 브라우저 오픈
//     hot: true, //수정사항적용시 바로바로 (기본값 true)
//   },
//   devtool: "eval", //빌드시간을 최소화 그러나 파일의 용량이 커진다.(개발시에만 사용) 배포시에는 'cheap-module-source-map'
// };

module.exports = (env, opts) => {
  // opts안에 개발/배포정의하는 변수가 들어있다.
  const config = {
    // 중복되는 옵션들..
    resolve: {
      extensions: ['.vue', '.js'] // 확장자 생략
    },
    entry: {
      app: ['@babel/polyfill', path.join(__dirname, 'main.js')]
    },
    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader', 'postcss-loader']
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({ template: path.join(__dirname, 'index.html') }),
      new CopyPlugin([{ from: 'assets/', to: '.' }])
    ]
  }
  // config와 아래 return값을 병합해서 내보내면 된다.
  if (opts.mode === 'development') {
    // 개발용
    return merge(config, {
      devtool: 'eval',
      devServer: {
        open: false,
        hot: true
      }
    })
  } else {
    // 제품용
    return merge(config, {
      devtool: 'cheap-module-source-map',
      plugins: [new CleanWebpackPlugin()]
    })
  }
}
