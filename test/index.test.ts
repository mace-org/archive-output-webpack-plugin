import {ArchiveOutputWebpackPlugin} from '../src';
import webpack from 'webpack';

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

test('default archive name', () => {
    const plugin = new ArchiveOutputWebpackPlugin();
    expect(plugin.archiveName).toEqual('dist.zip');
});

test('special archive type', () => {
    const plugin = new ArchiveOutputWebpackPlugin({archiveType: 'war'});
    expect(plugin.archiveName).toEqual('dist.war');
});

test('special archive name', () => {
    const plugin = new ArchiveOutputWebpackPlugin({archiveName: 'tomcat'});
    expect(plugin.archiveName).toEqual('tomcat.zip');
});

test('special archive name with extension', () => {
    const plugin = new ArchiveOutputWebpackPlugin({archiveName: 'tomcat.war'});
    expect(plugin.archiveName).toEqual('tomcat.war');
});

test('special archive type and name', () => {
    const plugin = new ArchiveOutputWebpackPlugin({archiveName: 'tomcat', archiveType: 'war'});
    expect(plugin.archiveName).toEqual('tomcat.war');
});

test('should replace output asserts with single archive assert', async () => {
    const compiler = createCompiler();
    const plugin = new ArchiveOutputWebpackPlugin();
    plugin.apply(compiler);
    const stats = await runCompiler(compiler);
    const keys = Object.keys(stats.compilation.assets);
    expect(keys.length).toEqual(1);
    expect(keys[0]).toEqual('dist.zip');
}, 30000);