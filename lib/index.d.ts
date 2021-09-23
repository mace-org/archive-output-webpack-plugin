/// <reference types="node" />
import webpack from 'webpack';
import { streamEntryOpts } from 'compressing';
import { ReadStream } from 'fs';
declare type WebpackArchiveOutputOptions = {
    archiveType?: 'war' | 'zip' | 'tar' | 'tgz';
    archiveName?: string;
};
interface ICompressionStream extends ReadStream {
    addEntry(entry: Buffer | ReadStream, opts: streamEntryOpts): void;
}
export declare class ArchiveOutputWebpackPlugin implements webpack.Plugin {
    private _options;
    constructor(options?: WebpackArchiveOutputOptions);
    get archiveName(): string;
    creatStream(): ICompressionStream;
    apply(compiler: webpack.Compiler): void;
}
export {};
