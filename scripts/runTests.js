const Mocha = require( 'mocha' );
const glob = require( 'glob' );
require( 'ts-node/register' );

const files = glob.sync( 'test/**/*.ts' );

module.exports = function runTests() {
    return new Promise( ( resolve, reject ) => {
        const mocha = new Mocha( {
            recursive: true
        } );

        for ( const file of files ) {
            mocha.addFile( file );
        }

        const runner = mocha.run( ( failures ) => {
            process.on( 'exit', () => {
                reject( failures );
                process.exit( failures ); // exit with non-zero status if there were failures
            } );
        } );

        runner.on( 'end', resolve );
    } );
}