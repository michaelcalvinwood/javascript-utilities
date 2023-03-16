
const test = {
    a: "house",
    b: 5,
    c: (d) => `Hello ${d}`,
    e: {
        f: "cars",
        g: 42,
        h: (i) => `Goodbye ${i}`
    }
};

const str = JSON.stringify(test, (key, value) => typeof value === 'function' ? `funcxyx_${value.toString()}` : value, 4);

const par = JSON.parse(str, (key, value) => {
    if (typeof value === 'string' && value.startsWith('funcxyx_')) {
        const func = value.substring(8);
        return eval(func);
    }
    return value;
})

console.log(par.e.h('Michael'))