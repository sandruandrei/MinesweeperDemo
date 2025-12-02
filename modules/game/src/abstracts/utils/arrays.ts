export const generateFilledArray = (length: number, value: any): any[] => {
    const deepCopy = (val: any): any => {
        if (val instanceof Array) {
            return val.map(deepCopy); // Recursively copy each element if it's an array
        }
        return val; // Return the value directly if it's not an array
    };

    return new Array(length).fill(null).map(() => deepCopy(value));
};

export const flat = (array: any[]): any[] => {
    return array.reduce((acc, curVal) => {
        return acc.concat(curVal);
    }, []);
};

export const randomizeArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};
