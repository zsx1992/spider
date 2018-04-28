module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    fis: {
      compile: {
        options: {
          src: './src/',
          dist: '../site',
          pack: true, //是否按照将js,css的uri打包
          env: {
            'NODE_ENV': 'development'
          },
          command: 'm,D,l,p' //m: md5, D: domains, l: lint, o: optimize, p: pack
        }
      },
      deploy: {
        options: {
          src: './src/',
          dist: '../site',
          pack: true, //是否按照将js,css的uri打包
          env: {
            'NODE_ENV': 'production'
          },
          command: 'm,D,l,o,p' //m: md5, D: domains, l: lint, o: optimize, p: pack
        }
      }
    },

    layout: {
      view: {
        options: {
          dist: './src/'
        },
        tree: ['{0}/page/index.ejs', '{0}/static/index.css', '{0}/static/index.js', '{0}/static/image/', '{0}/tpl/']
      },
      controller: {
        options: {
          dist: './controllers/'
        },
        tree: ['{0}/index.js']
      }
    },

    nodeunit: {
      files: ['test/**/*_test.js'],
    },

    clean: {
      site: ['site']
    },

    // qiniu: {
    //   sync: {
    //     options: {
    //       ACCESS_KEY: 'H51ZLbLGMEBOL0Ut56CI7ZOPsOiE3lkWdriXawr6',
    //       SECRET_KEY: 'Sf-Y_OzfCKtQCUgYZQ7AKTB0x8YsCkqb5ZYSXHIE',
    //       bucket: 'epbimg',
    //       prefix: 'static/',
    //       path: __dirname,
    //       domain:'https://dn-epbimg.qbox.me'
    //     },
    //     files: {
    //       'logs/qiniu.json': ['site/static/']
    //     }
    //   }
    // },
    qiniu: {
      sync: {
        options: {
          ACCESS_KEY: 'H51ZLbLGMEBOL0Ut56CI7ZOPsOiE3lkWdriXawr6',
          SECRET_KEY: 'Sf-Y_OzfCKtQCUgYZQ7AKTB0x8YsCkqb5ZYSXHIE',
          bucket: 'epb-pc',
          prefix: 'static/',
          path: __dirname,
          domain:"http://7xnm81.com1.z0.glb.clouddn.com"
        },
        files: {
          'logs/qiniu.json': ['site/static/']
        }
      }
    },

    watch: {
      scripts: {
        options: {
          livereload: 1339
        },
        files: ['src/**/*', 'rbac/*'],
        tasks: ['fis:compile']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-umi-fis');
  grunt.loadNpmTasks('grunt-umi-layout');
  grunt.loadNpmTasks('grunt-umi-qiniu');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task.
  grunt.registerTask('deploy', ['fis:deploy', 'qiniu']);

  grunt.registerTask('default', ['cp']);

  grunt.registerTask('cp', ['fis:compile']);
  grunt.registerTask('av', ['layout:view']);
  grunt.registerTask('ac', ['layout:controller']);
};