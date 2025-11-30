const lucide = require('lucide-react');
console.log('Tag:', !!lucide.Tag);
console.log('Tags:', !!lucide.Tags);
console.log('Keys starting with Tag:', Object.keys(lucide).filter(k => k.startsWith('Tag')));
