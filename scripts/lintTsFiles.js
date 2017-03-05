const path = require( 'path' );
const {
    Linter,
    Configuration
} = require( 'tslint' );

const PROJECT_ROOT = path.join( __dirname, '..' )

module.exports = function lintTsFiles() {
    const tslintRules = require( '../tslint.json' );

    const program = Linter.createProgram( "tsconfig.json", PROJECT_ROOT );
    const files = Linter.getFileNames( program );
    const linter = new Linter( program );

    const results = files.map( ( fileName ) => {
        const fileContents = program.getSourceFile( fileName ).getFullText();
        return linter.lint( fileName, fileContents, tslintRules );
    } );
}