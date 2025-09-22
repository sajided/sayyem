"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_rsc_models_SeoMeta_js";
exports.ids = ["_rsc_models_SeoMeta_js"];
exports.modules = {

/***/ "(rsc)/./models/SeoMeta.js":
/*!***************************!*\
  !*** ./models/SeoMeta.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst SeoMetaSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({\n    path: {\n        type: String,\n        required: true,\n        unique: true\n    },\n    title: {\n        type: String,\n        default: ''\n    },\n    description: {\n        type: String,\n        default: ''\n    },\n    keywords: {\n        type: String,\n        default: ''\n    },\n    ogImage: {\n        type: String,\n        default: ''\n    },\n    noindex: {\n        type: Boolean,\n        default: false\n    },\n    canonical: {\n        type: String,\n        default: ''\n    }\n}, {\n    timestamps: true\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((mongoose__WEBPACK_IMPORTED_MODULE_0___default().models).SeoMeta || mongoose__WEBPACK_IMPORTED_MODULE_0___default().model('SeoMeta', SeoMetaSchema));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9tb2RlbHMvU2VvTWV0YS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBNEM7QUFFNUMsTUFBTUUsZ0JBQWdCLElBQUlELDRDQUFNQSxDQUFDO0lBQy9CRSxNQUFNO1FBQUVDLE1BQU1DO1FBQVFDLFVBQVU7UUFBTUMsUUFBUTtJQUFLO0lBQ25EQyxPQUFPO1FBQUVKLE1BQU1DO1FBQVFJLFNBQVM7SUFBRztJQUNuQ0MsYUFBYTtRQUFFTixNQUFNQztRQUFRSSxTQUFTO0lBQUc7SUFDekNFLFVBQVU7UUFBRVAsTUFBTUM7UUFBUUksU0FBUztJQUFHO0lBQ3RDRyxTQUFTO1FBQUVSLE1BQU1DO1FBQVFJLFNBQVM7SUFBRztJQUNyQ0ksU0FBUztRQUFFVCxNQUFNVTtRQUFTTCxTQUFTO0lBQU07SUFDekNNLFdBQVc7UUFBRVgsTUFBTUM7UUFBUUksU0FBUztJQUFHO0FBQ3pDLEdBQUc7SUFBRU8sWUFBWTtBQUFLO0FBR3RCLGlFQUFlaEIsd0RBQWUsQ0FBQ2tCLE9BQU8sSUFBSWxCLHFEQUFjLENBQUMsV0FBV0UsY0FBY0EsRUFBQyIsInNvdXJjZXMiOlsiL1VzZXJzL3Jvd3Nob24vRGVza3RvcC9Ub3lSdXNoQkRfcHJlb3JkZXJfdmVyaWZ5X3BhdGNoX3YxNV9hZG1pbl9wcmVvcmRlcl91cGdyYWRlc192MTUvbW9kZWxzL1Nlb01ldGEuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlLCB7IFNjaGVtYSB9IGZyb20gJ21vbmdvb3NlJztcblxuY29uc3QgU2VvTWV0YVNjaGVtYSA9IG5ldyBTY2hlbWEoe1xuICBwYXRoOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZSB9LCAvLyBlLmcuLCAnLycsICcvcHJvZHVjdC9zbHVnJywgJy9ibG9nL3Bvc3Qtc2x1ZydcbiAgdGl0bGU6IHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiAnJyB9LFxuICBkZXNjcmlwdGlvbjogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6ICcnIH0sXG4gIGtleXdvcmRzOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogJycgfSxcbiAgb2dJbWFnZTogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6ICcnIH0sXG4gIG5vaW5kZXg6IHsgdHlwZTogQm9vbGVhbiwgZGVmYXVsdDogZmFsc2UgfSxcbiAgY2Fub25pY2FsOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogJycgfSxcbn0sIHsgdGltZXN0YW1wczogdHJ1ZSB9KTtcblxuXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbHMuU2VvTWV0YSB8fCBtb25nb29zZS5tb2RlbCgnU2VvTWV0YScsIFNlb01ldGFTY2hlbWEpO1xuIl0sIm5hbWVzIjpbIm1vbmdvb3NlIiwiU2NoZW1hIiwiU2VvTWV0YVNjaGVtYSIsInBhdGgiLCJ0eXBlIiwiU3RyaW5nIiwicmVxdWlyZWQiLCJ1bmlxdWUiLCJ0aXRsZSIsImRlZmF1bHQiLCJkZXNjcmlwdGlvbiIsImtleXdvcmRzIiwib2dJbWFnZSIsIm5vaW5kZXgiLCJCb29sZWFuIiwiY2Fub25pY2FsIiwidGltZXN0YW1wcyIsIm1vZGVscyIsIlNlb01ldGEiLCJtb2RlbCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./models/SeoMeta.js\n");

/***/ })

};
;