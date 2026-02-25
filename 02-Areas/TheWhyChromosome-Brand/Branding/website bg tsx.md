---
type: note
category: Projects
subcategory: Brand
enneagram: Type 5
status: active
---

```
import { ComponentType, useEffect, useState } from "react"

import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0"

  

export function withBackground(Component): ComponentType {

return (props) => {

const [isScrolling, setIsScrolling] = useState(false)

  

useEffect(() => {

let timeoutId

  

const handleScroll = () => {

setIsScrolling(true)

  

// Clear timeout and set a new one to detect when scrolling stops

clearTimeout(timeoutId)

timeoutId = setTimeout(() => {

setIsScrolling(false)

}, 150) // Adjust delay as needed

}

  

window.addEventListener("scroll", handleScroll)

  

return () => {

window.removeEventListener("scroll", handleScroll)

clearTimeout(timeoutId)

}

}, [])

  

return (

<>

<div

style={{

position: "fixed", // Keeps the background fixed to the viewport

top: 0,

left: 0,

width: "100vw", // Ensures it spans the entire viewport width

height: "100%", // Ensures it spans the entire website height

zIndex: -1, // Keeps it behind the content

backgroundColor: "#000000",

pointerEvents: "none",

overflow: "hidden", // Ensures no scrollbars appear

}}

>

<div

style={{

position: "absolute",

inset: 0,

backgroundImage: `repeating-linear-gradient(0deg,

#FFD700 0px, #FFD700 3px,

transparent 3px, transparent 10px)`, // Golden lines with 3px thickness

backgroundSize: "20px 20px", // Adjust spacing for visibility

opacity: 0.07,

animation: isScrolling

? "waveEffect 2s infinite ease-in-out"

: "straightEffect 0.5s forwards ease-in-out",

}}

/>

</div>

<div

style={{

position: "relative", // Content scrolls normally

zIndex: 0, // Content is above the background

}}

>

<Component {...props} />

</div>

<style>

{`

@keyframes waveEffect {

0% {

transform: translateY(0px) skewX(0deg);

}

25% {

transform: translateY(-10px) skewX(2deg);

}

50% {

transform: translateY(10px) skewX(-2deg);

}

75% {

transform: translateY(-5px) skewX(1deg);

}

100% {

transform: translateY(0px) skewX(0deg);

}

}

  

@keyframes straightEffect {

from {

transform: translateY(0px) skewX(0deg);

}

to {

transform: translateY(0px) skewX(0deg);

}

}

`}

</style>

</>

)

}

}
```