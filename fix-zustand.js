const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.mjs') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
};

const zustandDir = path.join(__dirname, 'node_modules', 'zustand');
const files = walk(zustandDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('import.meta.env')) {
        content = content.replace(/import\.meta\.env/g, 'process.env');
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Patched ${file}`);
    }
});
