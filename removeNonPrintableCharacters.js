function removeNonPrintableCharacters (text) {
    return text.replace(/[^ -~]+/g, "");
}