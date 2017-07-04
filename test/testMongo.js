/**
 * Created by Jun Chang on 2017/2/8.
 */
var mongoAgent = require("../plugins/mongodb");
// var co = require("co");
// var async = require('asyncawait/async');
// var await = require('asyncawait/await');

const posts = [
    { title: 'Post 1', content: 'fake content'},
    { title: 'Post 2', content: 'fake content'},
];
const getPosts = () => new Promise(resolve => setTimeout(() => resolve(posts), 1000));

async function printPostsToConsole() {
    const posts = await getPosts();
    console.log(posts);
};
printPostsToConsole()