module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-watch');

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
            eslint: './node_modules/.bin/eslint --ext .ts --ext .js ./src',
            build: './node_modules/.bin/tsc',
            generate: {
                cmd: moduleName => {
                    process.env['MODULE_NAME'] = moduleName;
                    return 'node ./src/resources/templates/source/loader.js';
                }
            } // grunt exec:generate:Customer
        },
        watch: {
            scripts: {
                files: ['src/**/*'],
                tasks: ['exec:eslint', 'sync', 'exec:build']
            }
        }
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['sync', 'exec:build']);
};
