export function flash<T>(data: T) {
    return {
        data: deepFreeze(deepCopy(data)),
        timeStamp: Date.now(),
    };
}

function deepCopy<T>(data: T) {
    // TODO
    return data;
}

function deepFreeze<T>(data: T) {
    // TODO
    return data;
}
