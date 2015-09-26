# circular-player
proof of concept for a circular html5 audio player, using svg and plain javascript

## how it looks
It's nothing special, but the basics are there. You can style SVG using CSS.
![](http://i.imgur.com/vHiNdcq.png)

## Why

1. I wanted to know how to do it
2. There is such a thing as [jPlayer](http://jplayer.org) which has an ugly circle-based player, but like all libraries it's designed for flexibility not specificity
3. I wanted to use SVG so that (in theory) you could have a non-round player.

## How it works
There's a SVG on the page. I animate its stroke length based on the length of the audio file being played, using CSS3 animations.

## Requires
A browser capable of rendering SVG and playing HTML5 audio.

## Licence
MIT.
