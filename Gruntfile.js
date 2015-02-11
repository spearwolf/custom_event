var fs = require('fs');

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha-test');

    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks


    grunt.initConfig({

        clean: [
            ".tmp/",
            "custom_event.js",
            "custom_event-min.js"
        ],

        '6to5': {
            options: {
                sourceMap: false
            },
            all: {
                files: {
                    '.tmp/custom_event.js': 'src/custom_event.js'
                }
            }
        },

        uglify: {
            dev: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true,
                    preserveComments: 'all',
                    banner: fs.readFileSync('src/custom_event-header.js').toString()
                },
                files: {
                    'custom_event.js': [ '.tmp/custom_event.js' ]
                }
            },
            min: {
                options: {
                    banner: fs.readFileSync('src/custom_event-header.js').toString()
                },
                files: {
                    'custom_event-min.js': [ '.tmp/custom_event.js' ]
                }
            }
        },

        mochaTest: {
            nyan: {
                src: ['test/*.coffee'],
                options: {
                    reporter: 'Nyan',  // spec
                    require: 'coffee-script/register'
                },
            },
            spec: {
                src: ['test/*.coffee'],
                options: {
                    reporter: 'spec',
                    require: 'coffee-script/register'
                },
            },
        },

    });


    grunt.registerTask('test', ['6to5', 'uglify', 'mochaTest:spec']);
    //grunt.registerTask('build', ['6to5', 'uglify', 'mochaTest:nyan']);
    grunt.registerTask('build', ['6to5', 'uglify']);
    grunt.registerTask('default', ['build']);

};
