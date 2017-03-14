const fsbx = require( "fuse-box" );
const gulp = require( 'gulp' );
const tslint = require( 'gulp-tslint' );
const del = require( 'del' );
const runTests = require( './scripts/runTests' );
const cp = require( 'child_process' );

// Create FuseBox Instance
const fuseBox = new fsbx.FuseBox( {
	homeDir: "src/",
	sourceMap: {
		bundleReference: "sourcemaps.js.map",
		outFile: "./build/dist.js.map",
	},
	cache: true,
	outFile: "./build/dist.js",
	plugins: [ fsbx.TypeScriptHelpers ],
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

gulp.task( 'ts-check', () => {
	return cp.execSync( 'tsc', '--project . --noEmit --pretty --noUnusedLocals' );
} );