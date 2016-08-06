/**
 * Created by Justin on 7/6/2016.
 */
(function(global){

    // map tells the System loader where to look for things
    var map = {
        'app':      'app', // 'dist',
        'rxjs':     'lib/rxjs',
        'angular2-in-memory-web-api': 'lib/angular2-in-memory-web-api',
        'socket.io-client': 'lib/socket.io-client',
        '@angular': 'lib/@angular',
        'd3':               'lib/d3'
    };

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app': { main: 'main.js', defaultExtension: 'js' },
        '@angular/router': { main: 'index.js', defaultExtension: 'js' },
        'rxjs': { main:'/bundles/Rx.umd.js', defaultExtension: 'js' },
        'socket.io-client': { main: 'socket.io.js', defaultExtension: 'js' },
        'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
        'd3':               { main: 'd3.js', defaultExtension: 'js' }
    };

    var packageNames = [
        'common',
        'compiler',
        'core',
        'http',
        'platform-browser',
        'platform-browser-dynamic'
    ];

    // Individual files (~300 requests):
    function packIndex(pkgName){
        packages['@angular/' + pkgName] = { main: 'index.js', defaultExtension: 'js' };
    }

    // Bundled (~40 requests):
    function packUmd(pkgName) {
        console.log(pkgName);
        packages['@angular/' + pkgName] = { main: 'bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
    }

    // Most environments should use UMD; some (Karma) need the individual index files
    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;

    packageNames.forEach(setPackageConfig);

    var config = {
        map: map,
        packages: packages
    };

    System.config(config);

})(this);