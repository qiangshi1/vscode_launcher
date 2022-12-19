// export function similarity2(s, t) {
//     var l = s.length > t.length ? s.length : t.length;
//     var d = strSimilarity2Number(s, t);
//     return (1 - d / l).toFixed(4);
// }

// function strSimilarity2Number(s, t) {
//     var n = s.length,
//         m = t.length,
//         d = [];
//     var i, j, s_i, t_j, cost;
//     if (n == 0) return m;
//     if (m == 0) return n;
//     for (i = 0; i <= n; i++) {
//         d[i] = [];
//         d[i][0] = i;
//     }
//     for (j = 0; j <= m; j++) {
//         d[0][j] = j;
//     }
//     for (i = 1; i <= n; i++) {
//         s_i = s.charAt(i - 1);
//         for (j = 1; j <= m; j++) {
//             t_j = t.charAt(j - 1);
//             if (s_i == t_j) {
//                 cost = 0;
//             } else {
//                 cost = 1;
//             }
//             d[i][j] = Minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
//         }
//     }
//     return d[n][m];
// }

// function Minimum(a, b, c) {
//     return a < b ? (a < c ? a : c) : (b < c ? b : c);
// }


// console.log(similarity2('456', '123'));
// console.log(similarity2('456', '654'));

// function compare(v1, v2){
//     // console.log(v1);
//     // console.log(v2);
//     // console.log(base_str);
//     d1=similarity2(v1, base_str);
//     d2=similarity2(v2, base_str);
//     if(d1<d2){
//         return 1;
//     }else if(d1>d2){
//         return -1;
//     }else{
//         return 0;
//     }
// }

// strs = ['123', '456', '12', '789'];
// var base_str='';
// strs2=strs.sort(compare);
// console.log(strs2);

// export {similarity2, compare, base_str}

export function sum() {
    console.log('sum');
}