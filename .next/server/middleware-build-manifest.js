self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/employee/benefits": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/employee/benefits.js"
    ],
    "/employee/budget": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/employee/budget.js"
    ],
    "/employee/login": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/employee/login.js"
    ],
    "/employee/paycheck": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/employee/paycheck.js"
    ],
    "/employer/login": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/employer/login.js"
    ],
    "/employer/signup": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/employer/signup.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];