"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveOutputWebpackPlugin = void 0;
var compressing_1 = require("compressing");
var webpack_sources_1 = require("webpack-sources");
var path = __importStar(require("path"));
var _name = 'archive-output-webpack-plugin';
var ArchiveOutputWebpackPlugin = /** @class */ (function () {
    function ArchiveOutputWebpackPlugin(options) {
        var name = (options === null || options === void 0 ? void 0 : options.archiveName) || 'dist';
        var type = options === null || options === void 0 ? void 0 : options.archiveType;
        if (!type) {
            var ext = path.extname(name);
            if (ext && ['.war', '.zip', '.tar', '.tgz'].indexOf(ext) >= 0) {
                type = ext.substr(1);
                name = name.substr(0, name.length - 4);
            }
        }
        this._options = {
            archiveName: name,
            archiveType: type || 'zip',
        };
    }
    Object.defineProperty(ArchiveOutputWebpackPlugin.prototype, "archiveName", {
        get: function () {
            return this._options.archiveName + '.' + this._options.archiveType;
        },
        enumerable: false,
        configurable: true
    });
    ArchiveOutputWebpackPlugin.prototype.creatStream = function () {
        switch (this._options.archiveType) {
            case 'tar':
                return new compressing_1.tar.Stream();
            case 'tgz':
                return new compressing_1.tgz.Stream();
            default:
                return new compressing_1.zip.Stream();
        }
    };
    ArchiveOutputWebpackPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.emit.tapAsync(_name, function (compilation, callback) {
            var stream = _this.creatStream();
            for (var key in compilation.assets) {
                stream.addEntry(Buffer.from(compilation.assets[key].source()), { relativePath: key });
                delete compilation.assets[key];
            }
            var buffers = [];
            stream
                .on('data', function (chunk) { return buffers.push(chunk); })
                .on('end', function () {
                var buffer = Buffer.concat(buffers);
                var outFile = _this.archiveName;
                compilation.assets[outFile] = new webpack_sources_1.RawSource(buffer);
                compilation.compiler.getInfrastructureLogger(_name).info('emit war asset: ' + outFile);
                callback();
            });
        });
    };
    return ArchiveOutputWebpackPlugin;
}());
exports.ArchiveOutputWebpackPlugin = ArchiveOutputWebpackPlugin;
