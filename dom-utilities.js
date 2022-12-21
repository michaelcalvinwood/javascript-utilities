/*
 * mcwCreateElement: Creates an element and appends to parent
 * @param parent (Element | String): optional parent to attach child to. Can be a query selector or an actual element itself.
 * @param tag (String): element tag to create
 * @param c (String): optional class(es) of the element. Multiple classes are allowed when separated by a space.
 * @param text (String): optional innerText of the element
 * @param attributes (Obj): optional object whose key/value pairs will be added to the element (e.g. {src: 'https://google.com', id: 'myId'})
 * @param style (Obj): optional set of styles to apply to the created element (e.g. {color: "red"})
 * @return Element on success (the created child element); false on error (if tag contains invalid characters). 
 * Example: createElement('body', 'div', 'hello-world-class hello-moon-class', 'Hello World', {id: 'helloWorldId'}, {color: 'blue'});
 * Author: Michael Wood
 * License-1: Copyright February 2022. Michael Wood. All rights reserved.
 * License-2: BSD License for any company that employs Michael Wood either as a consultant or employee.
 */
 
function mcwCreateElement (parent, tag, c = false, text = false, attributes = false, style = null) {
    let el = {};
    try {
        el = document.createElement(tag);
    } catch (e) {
        return false;
    }

    let parentEl = null;
    try {
        if (parent) {
            if (typeof parent === 'string') parentEl = document.querySelector(parent);
            else parentEl = parent;

            if (parentEl) parentEl.appendChild(el);
        }
        if (c) el.className = c; 
        if (text) el.innerText = text;
        if (attributes) {
            for (const [key, value] of Object.entries(attributes)) {
                el.setAttribute (key, value);
            };
        }
        if (style) {
            for (const [key, value] of Object.entries(style)) {
                el.style[key] = value;
            };
        }
    } catch (e) {
        console.error(e);
        return false;
    }
    
    return el
}

createElement('body', 'div', 'hello-world-class', 'Hello World', {id: 'helloWorldId'}, {color: 'blue'});





