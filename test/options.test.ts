import {ArchiveOutputWebpackPlugin} from '../src';

describe('archive type and name options', () => {

    test('default archive type and name', () => {
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
});
