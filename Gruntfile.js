var fs = require('fs');

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({

        clean: [
            "custom_event.js",
            "custom_event-min.js"
        ],

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
                    'custom_event.js': [ 'src/custom_event.js' ]
                }
            },
            min: {
                options: {
                    banner: fs.readFileSync('src/custom_event-header.js').toString()
                },
                files: {
                    'custom_event-min.js': [ 'src/custom_event.js' ]
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


    grunt.registerTask('test', ['mochaTest:spec']);
    grunt.registerTask('build', ['uglify', 'mochaTest:nyan']);
    grunt.registerTask('default', ['build']);

};
