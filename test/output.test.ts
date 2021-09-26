import {ArchiveOutputWebpackPlugin} from '../src';
import webpack from 'webpack';
import fs from "fs";
import path from "path";

async function remove(file: string) {
    if (fs.existsSync(file)) {
        if ((await fs.promises.stat(file)).isDirectory()) {
            for (const name of await fs.promises.readdir(file)) {
                await remove(path.join(file, name));
            }
            await fs.promises.rmdir(file);
        } else {
            await fs.promises.unlink(file);
        }
    }
}

function createCompiler() {
    return webpack({
        mode: 'production',
        context: __dirname,
        entry: {
            entry1: './fixtures/index.js',
            entry2: './fixtures/foo.js'
        }
    });
}

function runCompiler(compiler: webpack.Compiler) {
    return new Promise<webpack.Stats>((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                reject(err);
            } else if (stats.hasErrors()) {
                reject(stats.toString());
            } else {
                resolve(stats);
            }
        });
    });
}

async function testOutput(type: 'war' | 'zip' | 'tar' | 'tgz') {
    const compiler = createCompiler();
    const plugin = new ArchiveOutputWebpackPlugin({archiveType: type});
    plugin.apply(compiler);
    const stats = await runCompiler(compiler);
    const keys = Object.keys(stats.compilation.assets);
    expect(keys.length).toEqual(1);
    expect(keys[0]).toEqual(`dist.${type}`);
}

describe('output archive file tests', () => {

    beforeAll(async () => {
        const compiler = createCompiler();
        await remove(compiler.outputPath);
    })

    it('should output file "dist.war"', async () => {
        await testOutput('war')
    });

    it('should output file "dist.zip"', async () => {
        await testOutput('zip')
    });

    it('should output file "dist.tar"', async () => {
        await testOutput('tar')
    });

    it('should output file "dist.tgz"', async () => {
        await testOutput('tgz')
    });

})

