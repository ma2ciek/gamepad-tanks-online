export function createArray<T>( size: number, filler: T ) {
    const arr = new Array<T>( size );
    for ( let i = 0; i < size; i++ ) {
        arr[ i ] = filler;
    }
    return arr;
}

export function mod( x: number, y: number ) {
    const result = x % y;

    return ( result >= 0 ) ?
        result :
        result + y;
}
