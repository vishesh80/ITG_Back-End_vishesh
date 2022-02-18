let admin = require('firebase-admin');

let serviceAccount = require("./itg-assign-firebase-adminsdk-i2us2-38f2837358.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();


async function getfilters() {

    const docRefs = await db.collection('articles').get();
    let authors = {}, categories = {};

    docRefs.forEach(docRef => {

        let doc = docRef.data();
        if (doc.sauthor) authors[doc.sauthor] = true;
        if (doc.category) categories[doc.category] = true;
    });

    return { authors: Object.keys(authors), categories: Object.keys(categories) };
}

async function byAuthor(name = '') {

    name = name.toUpperCase().trim();
    let articles = [];

    const docRefs = await db.collection('articles').where('sauthor', '==', name).get();

    if (docRefs.empty) return articles;

    docRefs.forEach(docRef => {

        let doc = docRef.data();
        if (doc.timestamp) doc.date = (new Date(doc.timestamp)).toDateString();
        articles.push(doc);

    });

    return { articles };
}

async function byCategroy(category = '') {

    category = category.toUpperCase().trim();
    let articles = [];

    const docRefs = await db.collection('articles').where('category', '==', category).get();

    if (docRefs.empty) return articles;

    docRefs.forEach(docRef => {

        let doc = docRef.data();
        if (doc.timestamp) doc.date = (new Date(doc.timestamp)).toDateString();
        articles.push(doc);

    });

    return { articles };
}


async function recent() {

    let articles = [];

    const docRefs = await db.collection('articles').get();

    if (docRefs.empty) return articles;

    docRefs.forEach(docRef => {
        let doc = docRef.data();
        if (doc.timestamp) doc.date = (new Date(doc.timestamp)).toDateString();
        articles.push(doc);
    });

    articles.sort((a, b) => b.timestamp - a.timestamp);

    return { articles };
}

async function oldest() {

    let articles = [];

    const docRefs = await db.collection('articles').get();

    if (docRefs.empty) return articles;

    docRefs.forEach(docRef => {
        let doc = docRef.data();
        if (doc.timestamp) doc.date = (new Date(doc.timestamp)).toDateString();
        articles.push(doc);
    });

    articles.sort((a, b) => a.timestamp - b.timestamp);

    return { articles };
}

async function search(keywords = '') {

    let articles = [];
    keywords = keywords.toUpperCase().trim().split(' ');

    const docRefs = await db.collection('articles').get();

    if (docRefs.empty) return articles;

    for (let i in docRefs.docs) {
        let match = true;
        let doc = docRefs.docs[i].data();
        let mem = {};
        for (let word of doc.title.split(' ')) mem[word.toUpperCase()] = true;
        for (let word of doc.category.split(' ')) mem[word.toUpperCase()] = true;
        for (let word of doc.sauthor.split(' ')) mem[word] = true;

        for (let keyword of keywords) {
            if (keyword in mem) continue;
            else match = false;
        }

        if (!match) continue;
        if (doc.timestamp) doc.date = (new Date(doc.timestamp)).toDateString();
        delete doc.timestamp;
        delete doc.sauthor;
        articles.push(doc);
    }

    return { articles };
}

async function createUser(body) {

    //const users = await db.collection('users').get();

    if (!/^[aA-zZ][aA-zZ\s]{1,40}[aA-zZ]$/.test(body.name)) return { message: "(name) Field is missing or invalid." };
    if (!/^\d{8,12}$/.test(body.phone)) return { message: "(phone) Field is missing or invalid." };
    if (!/^[^\s@]+@[aA-zZ]+\.[aA-zZ]+$/.test(body.email)) return { message: "(email) Field is missing or invalid." };
    if (!/^[^\s]{6,}$/.test(body.password)) return { message: "(password) Field is missing or invalid. Minimum 6 characters" };
    if (!/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(body.dob)) return { message: "(dob) Field is missing or invalid. Format e.g (01/04/2000)" };

    const userRef = await db.collection('users').doc();

    await userRef.set(body);

    return { message: `User created sucessfully(id : ${userRef.id}).\nTo get user info. use the link below:-\n http://localhost:3000/getuser/${userRef.id} ` };
}

async function getUser(id) {

    const docRef = await db.collection('users').doc(id).get();

    let doc = docRef.data();
    doc.id = docRef.id;

    return doc;
}



module.exports.getfilters = getfilters;
module.exports.byAuthor = byAuthor;
module.exports.byCategroy = byCategroy;
module.exports.recent = recent;
module.exports.oldest = oldest;
module.exports.search = search;
module.exports.createUser = createUser;
module.exports.getUser = getUser;