let keys = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()-=+<>.,;: ';
let values = '０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ！＠＃＄％＾＆＊（）－＝＋＜＞．，；：　';

let map = keys.split('').reduce((result, char, idx) => {
  result[char] = values[idx];
  return result;
}, {});

let begin = '﻿';

export default function toFullWidthString (str) {
  return begin + str.split('').map((k) => { return map[k] || k; }).join('');
}