# circular-player
proof of concept for a circular html5 audio player, using svg and plain javascript

[Demo](http://frumbert.org/demo/circular-player/index.html)

## how it looks
It's nothing special, but the basics are there. You can style SVG using CSS.

![](http://i.imgur.com/vHiNdcq.png)

## Why

1. I wanted to know how to do it
2. There is such a thing as [jPlayer](http://jplayer.org) which has an ugly circle-based player that you can't easily style or change, but like all libraries it's designed for flexibility not specificity. Mine is only a couple of k all up.
3. I wanted to use SVG so that (in theory) you could have a non-round player.

## How it works
There's a SVG on the page. I animate its stroke length based on the length of the audio file being played, using CSS3 animations. HTML5 audio is triggered using .play() and different controls appear in the circle so you can pause, etc. When the file finishes, you have to click it to reset then click again to play.

## Requires
A browser capable of rendering SVG and playing HTML5 audio. If you want fallbacks, use jPlayer, or fork this and fix it :)

## Licence
MIT.
