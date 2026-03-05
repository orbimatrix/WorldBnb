const fs = require('fs');
const globPath = 'e:/rental_app/my-windbnb/node_modules/next/dist/compiled/glob/glob.js';
let content = fs.readFileSync(globPath, 'utf8');

// Patch readdirError
content = content.replace(
    'case"ENOENT":case"ELOOP":case"ENAMETOOLONG":case"UNKNOWN":',
    'case"EPERM":case"EACCES":case"ENOENT":case"ELOOP":case"ENAMETOOLONG":case"UNKNOWN":'
);

// Patch _stat2 error handling which looks like: r.code==="ENOENT"||r.code==="ENOTDIR"
content = content.replace(
    'r.code==="ENOENT"||r.code==="ENOTDIR"',
    'r.code==="EPERM"||r.code==="EACCES"||r.code==="ENOENT"||r.code==="ENOTDIR"'
);

// Patch any lstatSync / statSync try-catch blocks that only check ENOENT
content = content.replace(
    't.code==="ENOENT"',
    't.code==="EPERM"||t.code==="EACCES"||t.code==="ENOENT"'
);
content = content.replace(
    't.code==="ENOENT"',
    't.code==="EPERM"||t.code==="EACCES"||t.code==="ENOENT"'
);

fs.writeFileSync(globPath, content);
console.log('glob.js patched successfully');
