
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

