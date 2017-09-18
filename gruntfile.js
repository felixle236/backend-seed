module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sync: {
            main: {
                files: [{
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
            install: {
                cmd: () => {
                    return 'npm install';
                }
            },
            eslint: './node_modules/.bin/eslint --ext .ts --ext .js ./src',
            build: './node_modules/.bin/tsc',
            start_with_data: {
                cmd: () => {
                    process.env['DATA_TEST'] = true;
                    process.env['NODE_ENV'] = 'development';
                    return 'node ./dest/server.js';
                }
            },
            start: {
                cmd: () => {
                    process.env['NODE_ENV'] = 'development';
                    return 'node ./dest/server.js';
                }
            },
            deploy: {
                cmd: () => {
                    process.env['NODE_ENV'] = 'deployment';
                    return 'node ./dest/server.js';
                }
            },
            drop_db: `mongo backend_seed --eval "db.dropDatabase();"`,
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
    grunt.registerTask('install', ['exec:install']);
    grunt.registerTask('drop-db', ['exec:drop_db']);
    grunt.registerTask('build', ['sync', 'exec:build']);
    grunt.registerTask('start-with-data', ['build', 'exec:start_with_data']);
    grunt.registerTask('start', ['build', 'exec:start']);
    grunt.registerTask('deploy', ['install', 'build', 'exec:deploy']);
};