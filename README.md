# [MineTweeter](http://twitter.com/minetweeter_)

A twitter bot that generates MineSweeper games and accepts commands via @mentions.

## Key

```
ＡＢＣＤＥＦＧＨＩ
．．．．．．．．．Ｊ
１１．．１１１．．Ｋ
＝２．．１＾１．．Ｌ
＝２．．１１１．．Ｍ
＝１１１１．．．．Ｎ
＝＝＝＾３１．．．Ｏ
＝＝＝＝＾１．．．Ｐ
＝＝＝＝２２２３２Ｑ
＝＝＝＝＾１＾＾＾Ｒ

． REVEALED BLANK/EMPTY SPACE
＝ NON-REVEALED SPACE
＾ FLAGGED SPACE
```

## Command Syntax

```
<action> <x> <y>

Available actions:
- click
- flag
- unflag

Example actions:
click A J
flag E K
```

## Why would you make this?

*Stares off into the distance, smiling manically.*

Huh?

## Game Logic

If you're looking for some example code for generating, rendering, and evaluating
the state of minesweeper boards, check out these files:

- src/createBoard.js
- src/gameStateToString.js
- src/MinesweeperGame.js

----

[![Analytics](https://ga-beacon.appspot.com/UA-33247419-2/minetweeter/README.md)](https://github.com/igrigorik/ga-beacon)
