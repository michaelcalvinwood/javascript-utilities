/*
 * createElement: Creates a child element and appends to parent
 * @param parent (Element): parent element to attach child to
 * @param tag (String): element tag to create
 * @param c (String): optional class(es) of the element. Multiple classes are allowed when separated by a space.
 * @param text (String): optional innerText of the element
 * @param attributes (Obj): optional object whose key/value pairs will be added to the element
 * @return Element on success (the created child element); false on error (if tag contains invalid characters). 
 */
 
function createElement (parent, tag, c = false, text = false, attributes = false) {
    let el = {};
    try {
        el = document.createElement(tag);
    } catch (e) {
        return false;
    }

    parent.appendChild(el);
    
    // optional parameters
    if (c) el.className = c; 
    if (text) el.innerText = text;
    if (attributes) {
        for (const [key, value] of Object.entries(attributes)) {
            el.setAttribute (key, value);
        };
    }

    return el
}

