const {
    FuseBox,
    TypeScriptHelpers
} = require( "fuse-box" );
const gulp = require( 'gulp' );
const tslint = require( 'gulp-tslint' );
const del = require( 'del' );
const runTests = require( './scripts/runTests' );
const cp = require( 'child_process' );

// Create FuseBox Instance
const fuseBox = new FuseBox( {
    homeDir: "src/",
    sourceMaps: true,
    cache: true,
    outFile: "./build/dist.js",
    plugins: [ TypeScriptHelpers ],
} );

gulp.task( 'lint', () =>
    gulp.src( 'src/**/*.ts' )
    .pipe( tslint( {
        formatter: 'verbose',
    } ) )
    .pipe( tslint.report( {
        emitError: false,
    } ) )
);

gulp.task( "build", () => {
    return fuseBox.bundle( ">index.ts" );
} );

gulp.task( 'test', () => {
    return runTests();
} );

gulp.task( 'default', [ 'build', 'lint', 'watch' ] );

gulp.task( 'watch', () => {
    return gulp.watch( [
        'src/**/**', 'test/**/**',
    ], [
        'build',
        'lint',
    ] )
} );
