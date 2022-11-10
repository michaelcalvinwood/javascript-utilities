const formatted = {base64 of image}
const buffer = Buffer.from(formatted, "base64");

const fn = `${uuidv4()}.png`;
    const fp = `/var/www/node.pymnts.com/images/${fn}`;

    fs.writeFileSync(fp, buffer);