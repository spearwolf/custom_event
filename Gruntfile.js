module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //coffee: {
            //compile: {
                //files: {
                    //'lib/coffee_state_machine.js': 'src/coffee_state_machine.coffee'
                //}
            //}
        //},

        clean: ["custom_event.min.js"],

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: 'coffee-script'
                },
                src: ['test/**/*.coffee']
            }
        },

        uglify: {
            options: {
                banner: grunt.file.read('src/custom_event-header.js')
            },
            dist: {
                files: {
                    'custom_event.min.js': ['src/custom_event.js']
                }
            }
        }
    });


    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('build', ['uglify']);

    grunt.registerTask('default', 'test');
};
