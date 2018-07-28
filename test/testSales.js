const alasql = require('alasql');
const _ = require('underscore');

let la_array = [
    {ikey_seq_nos: '0', name: 'test0'},
    {ikey_seq_nos: '1', name: 'test1'},
    {ikey_seq_nos: '2', name: 'test2'}
];
let la_array2 = [
    {ikey_seq_nos: '0', name: 'test0'},
    {ikey_seq_nos: '1', name: 'test1'}
];
let ls_ikeyNos = "0";
_.each(la_array2, (lo_array) => {
    ls_ikeyNos += `,'${lo_array.ikey_seq_nos}'`;
});

console.log(ls_ikeyNos)
let ls_statement = `select * from ? where ikey_seq_nos in (${ls_ikeyNos})`;

console.log(alasql(ls_statement, [la_array]));