module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: [
        'Gruntfile.js', 'src/**/*.js', 'test/**/*.js'
      ],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      options: {
        livereload: true // Override defaults here
      },
      express: {
        files: ['**/*.js', "public/planets.json"],
        // tasks: ['express:dev'],
        options: {
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
        }
      }
    },
    express: {
      dev: {
        options: {
          script: './app.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('server', ['express:dev', 'watch'])
};
