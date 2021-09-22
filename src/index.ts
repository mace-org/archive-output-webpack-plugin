import webpack from 'webpack';
import {streamEntryOpts, tar, tgz, zip} from 'compressing';
import {RawSource} from 'webpack-sources';
import * as path from 'path';
import {ReadStream} from 'fs';

type WebpackArchiveOutputOptions = {
    archiveType?: 'war' | 'zip' | 'tar' | 'tgz',
    archiveName?: string
}

interface ICompressionStream extends ReadStream {
    addEntry(entry: Buffer | ReadStream, opts: streamEntryOpts): void
}

const _name = 'archive-output-webpack-plugin';

export class ArchiveOutputWebpackPlugin implements webpack.Plugin {

    private _options: Required<WebpackArchiveOutputOptions>;

    constructor(options?: WebpackArchiveOutputOptions) {
        let name = options?.archiveName || 'dist';
        let type = options?.archiveType;
        if (!type) {
            const ext = path.extname(name);
            if (ext && ['.war', '.zip', '.tar', '.tgz'].indexOf(ext) >= 0) {
                type = ext.substr(1) as any;
                name = name.substr(0, name.length - 4);
            }
        }
        this._options = {
            archiveName: name,
            archiveType: type || 'zip',
        };
    }

    get archiveName() {
        return this._options.archiveName + '.' + this._options.archiveType;
    }

    creatStream(): ICompressionStream {
        switch (this._options.archiveType) {
            case 'tar':
                return new tar.Stream();
            case 'tgz':
                return new tgz.Stream();
            default:
                return new zip.Stream();
        }
    }

    apply(compiler: webpack.Compiler): void {

        compiler.hooks.emit.tapAsync(_name, (compilation, callback) => {

            const stream = this.creatStream();
            for (const key in compilation.assets) {
                stream.addEntry(Buffer.from(compilation.assets[key].source()), {relativePath: key});
                delete compilation.assets[key];
            }

            const buffers: any[] = [];
            stream
                .on('data', chunk => buffers.push(chunk))
                .on('end', () => {
                    const buffer = Buffer.concat(buffers);
                    const outFile = this.archiveName;
                    compilation.assets[outFile] = new RawSource(buffer as any);
                    compilation.compiler.getInfrastructureLogger(_name).info('已生成部署包：' + outFile);
                    callback();
                });
        });
    }
}
