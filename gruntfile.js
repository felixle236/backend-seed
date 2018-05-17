module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-exec');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sync: {
            main: {
                files: [{
                    cwd: 'src',
                    src: ['resources/templates/mail/*'],
                    dest: 'dest'
                }, {
                    cwd: 'src',
                    src: [], // ['**/*', '!**/*.ts'],
                    dest: 'dest'
                }],
                verbose: true, // Default: false
                pretend: false, // Don't do any disk operations - just write log. Default: false
                failOnError: true, // Fail the task when copying is not possible. Default: false
                ignoreInDest: [
                    '**/*.js'
                ], // Never remove js files from destination. Default: none
                updateAndDelete: false, // Remove all files from dest that are not found in src. Default: false
                compareUsing: 'md5' // compares via md5 hash of file contents, instead of file modification time. Default: "mtime"
            }
        },
        exec: {
            generate: {
                cmd: moduleName => {
                    process.env['MODULE_NAME'] = moduleName;
                    return 'node ./src/resources/templates/source/loader.js';
                }
            } // ./node_modules/.bin/grunt exec:generate:Customer
        }
    });
};
