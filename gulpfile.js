const fsbx = require( "fuse-box" );
const gulp = require( 'gulp' );
const tslint = require( 'gulp-tslint' );
const del = require( 'del' );
const runTests = require( './scripts/runTests' );

// Create FuseBox Instance
const fuseBox = new fsbx.FuseBox( {
	homeDir: "src/",
	sourceMap: {
		bundleReference: "sourcemaps.js.map",
		outFile: "./build/dist.js.map",
	},
	cache: true,
	outFile: "./build/dist.js",
	watch: true,
	plugins: [ fsbx.TypeScriptHelpers ]
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
	return del( 'build/**/**' )
		.then( () => fuseBox.bundle( ">PadManager.ts" ) );
} );

gulp.task( 'test', () => {
	return runTests();
} );

gulp.task( 'default', [ 'build', 'lint', 'watch' ] );

gulp.task( 'watch', () => {
	return gulp.watch( [
		'src/**/**', 'test/**/**',
	], [ 'build', 'lint' ] )
} );
