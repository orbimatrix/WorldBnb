const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.md')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('e:/rental_app/my-windbnb');
let count = 0;
files.forEach(file => {
    if (file.includes('replace_worldbnb.js')) return;
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content
        .replace(/WorldBNB/g, 'Rentora')
        .replace(/WorldBnb/g, 'Rentora')
        .replace(/worldbnb/g, 'rentora');
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Updated', file);
        count++;
    }
});
console.log('Total files updated:', count);
