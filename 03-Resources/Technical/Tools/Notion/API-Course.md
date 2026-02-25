# The Complete Notion API Crash Course for Beginners (01j4x9s0b0vpka291g2va2mevt)

Source: The Complete Notion API Crash Course for Beginners (01j4x9s0b0vpka291g2va2mevt).html

My work is reader-supported; if you buy through my links, I may earn an affiliate commission.
Play Video
If you want to learn how to work directly with the
Notion API
, this tutorial will teach you how to do it – even if you’re a beginner with no coding experience.
In this tutorial, you’ll learn:
What the Notion API is and what it can do
What an API is (in general)
How to create a Notion API integration inside your Notion workspace
How to send data to Notion via the Notion API
How to create new pages in a Notion database via the Notion API
How to read, understand, and
actually use
API documentation
Lots of beginner-to-intermediate level JavaScript
The Notion API already has
great documentation
, so here I’ll be teaching you how to actually
use
the API by walking you step-by-step through a fun example project –
building a complete Pokédex in Notion!
Many people have built Pokédexes in Notion by hand, but we’ll build ours with
zero manual data entry.
Everything will be handled by the Notion API and a small JavaScript application that we’ll build, which will automatically create an entry for each Pokémon.
Here’s a look at the final product (you can also
view this Pokédex directly on Notion
):
Each Pokémon has its own database entry with art, stats, description, and more.
This is a great introductory project for learning how to work with the Notion API. And once you’ve completed it,
you’ll have the knowledge and skill to do nearly anything else with the API
.
I have many more API tutorials planned, so if you’d like to get notified when they go live,
join my Notion Tips newsletter
.
You won’t need any special software for this project – we’ll do everything in the browser using
free
tools. We’ll even code in the browser (of course, you can use your own local code editor if you want).
I’ve also included deep explanations (in handy collapsible toggles) and external links that explain
everything,
so you’ll be able to use this as a true zero-to-hero path for learning Notion’s API. There’s even a fully mapped-out
learning path
below.
Every Pokémon will get its own Notion database entry that includes its stats (HP, attack, defense, etc), types, flavor text, artwork, and more.
We’ll accomplish this by building a simple JavaScript application that pulls all of this data from
PokéAPI
, a free and open-source resource with an immense amount of information on all things Pokémon. Our app will then format the data and send it to Notion.
Note:
This tutorial is meant for those who want to work directly with the Notion API using a programming language like JavaScript. If you’d like to work with the Notion API using
no-code tools
(like
Make.com
), check out this tutorial instead:
What is the Notion API?
To kick this off, let’s talk a bit about what the Notion API actually is.
The Notion API is a set of tools that allow you to connect your Notion workspace to other apps and services outside of Notion (including apps you build yourself). Using the API, you could:
Add new rows to a sales database in Notion when customers make purchases on your online store (using a platform like
Lemon Squeezy
or
Shopify
)
Auto-transcribe voice notes using a service like
Deepgram
and send the transcript to a Notion page (tutorial on this coming soon!
Join the newsletter
to get notified.)
Use Notion as a CMS for blog posts and display them on a custom-built website (like
Braydon Coyer
does – though you can also use
Notaku
for this instead of building a site from scratch)
…and much more. The possibilities are basically endless.
The Notion API provides endpoints for many major functions, including:
Querying, creating, and updating databases
Retrieving, creating, updating, and archiving pages
Retrieving, creating, updating, and deleting blocks
Appending child blocks to a parent block
Listing workspace users and retrieving specific user information
Creating and retrieving comments
All API requests to the Notion API must be sent to the base URL
https://api.notion.com
, which you’ll see as the first part of the listed endpoint for any action you’d want to take. For example, if you wanted to query a database, you’d send a POST request to:
Notion requires all API requests to be made over HTTPS, and they must be
authenticated
properly. To make API requests to your workspace, you’ll first need to create an integration (we’ll cover this later), then give that integration explicit access to pages in your workspace.
Notion also provides a JavaScript SDK for working with the API. As you’ll see later in the tutorial, it’s easy to add this to your project, and it gives you access to handy methods that make API requests easy to construct in your code.
If you’d like a more thorough overview, check out the
official API documentation’s introduction
. However, I think you’ll get a better grasp on the API by actually working with it – so let’s start doing that!
If you do happen to want a primer or refresher on what an API is (in general), check out the toggle block below.
Some content could not be imported from the original document.
View content ↗
Some content could not be imported from the original document.
View content ↗
Some content could not be imported from the original document.
View content ↗
Some content could not be imported from the original document.
View content ↗
“What If I Don’t Know How to Code?”
In this project, we’ll build our application using
JavaScript
. So if you have a basic understanding of JavaScript, you’ll be more comfortable going through it.
However,
you don’t need to already know JavaScript to go through this tutorial.
My entire goal with this tutorial is to help non-technical people dip their toes into the world of coding and working with the Notion API. I’ve gone to great lengths to make it a
truly comprehensive resource.
Thomas Frank
@TomFrankly
To build any skill, you need 3 ingredients:
1. Quality instruction
2. Deliberate practice
3. Feedback
Most people don't get nearly enough of #3 because they're too afraid of making mistakes or getting judged.
Don't be one of them.
Try often, get judged often, learn faster.
Posted Oct 20, 2022 at 4:20PM
As we go through this tutorial, I’ll include asides and primers about all of the tools and concepts we’ll use. However, I’ve also collected them all in this
learning path
toggle, enabling you to find them all in one place.
Steal My Code and Create a Pokédex Instantly
If you just want the code you’ll need to build a Pokédex, you’re in luck! I’ve built this project on
Glitch
, which is a free platform that allows people to build and share working web apps and sites.
Here’s the direct link to my Glitch project.
There’s a handy
Remix
feature that allows you to fully copy my Pokédex project and run it for yourself. All you’ll need to do is create a free Glitch account, hit the Remix button, and follow the instructions in the
README.md
file.
Even if you intend to follow this tutorial and build the project from scratch, I’d encourage you to first Remix mine and see how it works!
One of the most powerful ways to learn faster is to
prime your brain
by skipping ahead and getting a preview of what you’re trying to accomplish. Even if you don’t fully understand it, you’ll be setting your brain up to more readily understand each piece of the process once you go back and start it in earnest.
I’ve also meticulously commented my code, so you can work through it and get an explanation of how everything works.
To get the script running:
Create a Glitch account and hit the Remix button on my project.
Open the Terminal.
Type
node index.js
and hit Enter.
By default, the script will pull the first 10 Pokémon into your Notion database. To change this, modify the
start
and
end
variables (lines 65 and 66 in
index.js
, or 18 and 19 in
index-nocomments.js
).
Full Project Code
I’m also going to share the full code for this project right here.
As we work through the tutorial, I’ll include smaller code snippets that focus on the specific part we’ll be building at that point.
However, you may want to reference the project code in its entirety; when that happens, just open one of these toggles.
What You’ll Need to Get Started
To successfully complete this tutorial, you’ll need a few things:
A Notion database that you’d like to use for your Pokédex (you can start with my template below).
An
integration
in your Notion account.
We’ll create this in the first step of the tutorial.
A free
Glitch account
. This is the platform where we’ll build and run the application.
You can use any database you want to create your Pokédex, but if you’d like a head start, you can use this
free Pokédex Notion template
I’ve created for you.
The template is an exact copy of my
public Pokédex
, minus all the actual Pokémon. It comes with all the properties and views pre-configured, so you can skip all of the database setup and get to coding.
Since I’m providing this template, I won’t cover the database set up in this tutorial. However, if you want to learn more about setting up Notion databases, check out my
beginner’s guide to Notion databases
. You may also find my
complete Notion formula guide
helpful for understanding some of the formulas in this template!
Tutorial Overview
Before we start coding, let’s do a quick overview and cover what we’ll be accomplishing.
We know that we want to pull information about each Pokémon from PokéAPI and then create a new page in our Notion database for each Pokémon – but how exactly will we do that?
First, the prep work: We’ll set up our Pokédex database on Notion, create a Notion API integration, and ensure the integration is able to edit the database (covered in the
very next section
).
Once that’s done, we’ll build the script that will actually execute the process of getting the data and sending it to Notion.
Let’s break down the process.
Don’t worry if you don’t know what GET and POST requests are – I’ll explain them as they come up!
For each Pokémon, we’ll send a GET request to PokéAPI. This will contain the URL that maps to the specific Pokémon we want information about – e.g.
https://pokeapi.co/api/v2/pokemon/4
(you can paste that link directly in your browser to see the response).
PokéAPI will accept our GET request if it is formatted correctly.
PokéAPI sends back a response that contains all of the Pokémon data we want, plus other meta info.
The response contains way too much data, and it’s not always formatted perfectly. So we’ll do some work to process the response directly on our web server (Glitch/Node.js).
For each Pokémon, we’ll create a custom JavaScript object called
pokeData
that will contain all the info we’ll need.
We’ll do the work to extract and format the data from PokéAPI and add it to the
pokeData
object – including name, height, weight, base stats, artwork, etc.
We’ll add each
pokeData
object to an array called
pokeArray
.
Now we’ll make a POST request to the Notion API for each Pokémon within
pokeArray
.
Assuming our request is formatted correctly and authenticated, Notion will create a new page within our Pokédex database, setting property values and populating the page content with the information we sent over.
Finally, the Notion API will send back a response that we’ll simply log.
Here’s a graphic that shows the entire process visually (you can also
view this directly on Whimsical
):
Now that you’ve got a map in your head for what we’ll be building, let’s build it!
Create a Notion Integration
The first thing we’ll do is create an integration within your Notion account. This integration will allow you to work with the Notion API and make changes to your workspace.
Note:
You’ll also find these instructions in the
getting started guide
within the Notion API docs. We’ll be referencing these docs a lot later on, and I highly recommend getting familiar with them if you plan on building more Notion API integrations!
To start, make sure you’ve duplicated my
Pokedex template
into your Notion workspace. This template contains all the properties and views you’ll need.
Next, you’ll need to create an
integration
in your Notion account.
Click here to go directly to the “My Integrations” area of your account.
Alternatively, you can find this page by going to
Settings & Members
within the Notion app, then navigating to
My Connections → Develop or Manage Integrations.
Click
New Integration.
Fill out the
Basic Information
for your integration. You can leave most of the settings at their defaults, but set these as needed:
Name:
Any descriptive name. I’ll use “Notion Pokedex Integration” in this guide.
Associated workspace:
Choose the workspace you want this integration to work with (aka the one that contains your Pokedex database).
User capabilities:
Set to
no user infomation.
This project doesn’t need user info, and it’s a good practice to limit integrations to only the capabilities they need.
Click
Submit.
Once the integration has been created, you’ll see a field where you can show your
internal integration token.
Copy this token
to your clipboard; you’ll need it when we start setting up the project in Glitch.
Important:
Keep this token secret. As this tutorial will show you, an integration token allows external tools and scripts to make changes to your Notion workspace.
Show the token, then copy it to your clipboard.
Additionally, note where it says, “Only works with
[your workspace name]
workspace”. If you want to work with another workspace, you’ll need to create another integration.
You’ll also be able to see that your integration is set as
Internal
rather than
Public.
This is what you want! I’m just pointing it out in case you’re unsure which one should be selected.
Add Your Integration to Your Pokedex Database
Before we can move on, we need to give your integration permission to edit your database.
To do that, head to your Pokedex:
Click the
•••
icon in the top-right corner.
Find the
Connections
sub-menu.
Find and select your integration.
You’ll see the following message:
Notion Pokedex Integration will have access to this and all child pages. Continue?
Click
confirm.
Once connected, you’ll be able to navigate back to that Connections menu and see your connected integration’s permissions for this page. Note that any child pages/databases of the current page will also be accessible to the integration.
Now that your integration can modify your Pokedex page, we can move onto the next step!
Create Your Glitch Project
We’ll be writing our actual code on Glitch, a free platform that lets you built
and run
websites and apps in a single, easy-to-use interface.
To get started,
head to Glitch
and create a free account.
Next, click
New Project.
You’ll be given the choice of a few different starter apps, but you should actually click
Find More,
as the one we want isn’t shown here.
From this new page, find the
Hello Node!
starter project and choose the
blank version.
While you
can
use the regular Hello Node! app (and I do in the video tutorial above), it comes with a bunch of extra stuff you don’t need. It also doesn’t come with a
.env
file by default, whereas the blank version does.
Select the blank version of the Hello Node! app.
Once done, Glitch will set up a new project that is pre-configured to run Node.js, the server runtime that will allow us to run JavaScript code directly from the terminal (instead of needing to run it in web page).
Some content could not be imported from the original document.
View content ↗
The Glitch app gives you a complete development environment. Here’s a quick tour, going over the most important parts:
The editor is where you’ll write your code. As you can see below, it can also render markdown files (
.md
files) with formatting.
The sidebar gives you access to all of the files and assets within your project, and allows you to create more. You can also access your project settings here.
The
terminal
will allow you to run your code. This is where we’ll run your Pokedex script.
The main thing you should do right now is create an
index.js
file. This will be the file where we write our JavaScript code in the next steps.
To do this:
Click the
+
icon next to
Files
in the sidebar.
Name the file
index.js
.
Click
Add This File.
For now, you can leave this file blank. We’ll come back to it soon and start coding, but before that, we need to set up our environment variables and import a couple of packages.
Let’s go!
Set your Environment Variables
For the script to be able to send Pokemon data to your Notion workspace, you’ll need to provide it with two pieces of specific information:
Your
internal integration token
(set when you created your Notion integration earlier)
The
database ID
for your Pokedex database
Both of these are
private
pieces of information that shouldn’t be shared.
When developing Node.js apps (which we’re doing here), there’s a best practice for storing private pieces of information with which the program needs to directly interact, and that’s to store them in as
environmental variables
in a
.env
file.
So that’s exactly what we’ll do now, and we’ll start by gathering these pieces of information.
Some content could not be imported from the original document.
View content ↗
You should already have your internal integration key from when you set up your Notion integration; if not, head back to the
My Integrations
page and copy it.
Next, we’ll get your database ID.
Obtain Your Database ID
Your database ID can be found within the URL of your Notion database.
To find it, first navigate to your
source database
in Notion. If you’re using my Pokedex template, note that the template is a normal page that
contains
the source database.
Click the
Open as full page
button on the database view to access the source database.
Once you’re looking at your source database, copy its URL by going to the
•••
menu and clicking
Copy Link.
Alternatively, you can use the shortcut ⌘/Ctrl + L.
Within your database’s URL, your
database ID
is the string of characters after the final
/
and before the query symbols
?v=
.
// Full URL
https://www.notion.so/thomasfrank/c9cdd00ed7314f9497f4ab23e9fa0bdd?v=2d6e86289d304cd1ab5ba08a0d9ec1b4
// Database ID
c9cdd00ed7314f9497f4ab23e9fa0bdd
Copy your database ID and paste it in a temporary holding place along with your internal integration token.
P.S. – if you don’t have clipboard history enabled on your computer, now’s a great time to turn it on! On Windows, just hit ⊞ Win + V. If you’re on a Mac, get
Raycast
; it’s an incredibly powerful launcher tool with built-in clipboard history.
Edit the .env File
Now that you have your
internal integration token
and
database ID,
head back to Glitch.
Your project should already have a
.env
file listed in the sidebar. If not, click the
+
one more time and create a file called
.env
.
Add these two environmental variables. Ensure the labels are
NOTION_KEY
and
NOTION_DATABASE_ID
, but replace the example values with your own.
NOTION_KEY=secret_LykgP0z2wvrYCiqAaWKu3j5uSokRvosbsqgWaHIjLw6
NOTION_DATABASE_ID=c9cdd00ed7314f9497f4ab23e9fa0bdd
As the dialogue box pictured above will tell you, these environmental variable values will be visible to you and anyone else you specifically invite to
edit
your project.
However, anyone else will merely see the variable names – not the values. That means you’ll be able to safely let people view (or even Remix) your project without revealing them. To learn more about how
.env
works in Glitch, check out their article on
Adding Private Data
.
Add Your NPM Packages
The script we’re building uses two
external libraries
that do a lot of the heavy lifting. These include
The Axios HTTP library
The Notion API’s JavaScript SDK
Once we start coding, I’ll explain what these libraries actually do in more detail. For now, we simply need to bring them into our project and set up
index.js
so that our code can access and use them.
Luckily, bringing these libraries into our project is very easy. Node.js comes with a
package manager
called
npm
, which lets developers quickly import packages (which contain these libraries) into their projects.
Normally, a developer would install a package by typing
npm install
into the terminal along with the name of the package. For example, you could install the
dadjoke
library into your project by typing:
You can actually do this on Glitch, and I’ll invite you to do so and then type
dadjoke
in the terminal to see what happens.
For clarity: You do not need the dadjoke library for this project; it’s just a very simple library that you can easily use to test the
npm install
process.
However, Glitch provides an even easier way to install packages. Simply head to your
package.json
file and click
Add Package.
From there, you can search for packages and click them to install.
Search for and install the following packages.
I’ve linked their npm pages below in case you need to double-check that you’re installing the right ones.
Once done, you’ll see that your
package.json
file has been updated with new depencies:
"dependencies": {
"fastify": "^4.4.0",
"handlebars": "^4.7.7",
"@fastify/view": "^7.1.0",
"@fastify/static": "^6.5.0",
"@fastify/formbody": "^7.0.1",
}
Now you’ve got the packages installed in your project. Before you can use them, however, you’ll need to “require” them within your
index.js
file.
Head over to
index.js
and add the following lines to the top of the file (which should currently be blank):
const axios = require('axios')
const { Client } = require('@notionhq/client')
const notion = new Client({auth: process.env.NOTION_KEY})
For our purposes, it’s not incredibly important to know exactly how
require()
works. But if you’re curious, here’s a great article:
Make Your First Call to PokéAPI
We’re finally ready to start coding! In this step, we’ll make our first call to
PokeAPI
and log the name of a Pokemon in the Glitch terminal.
First, let’s look at how this actually works. In this
Replit
embed, I’ve created a very simple script that will call PokeAPI once.
Go ahead and hit
Run
to see what happens.
If everything went smoothly, you should see
bulbasaur
displayed in the terminal.
Here’s a look at the code:
const axios = require('axios')
async function getPokemon() {
await axios.get(`https://pokeapi.co/api/v2/pokemon/1`).then((poke) => {
console.log(poke.data.species.name)
})
}
getPokemon()
This very simple script does three things:
Uses
require('axios')
to make the axios library’s methods available for use in the script
Defines an asynchronous function
getPokemon()
, which will call PokeAPI and console log the name of the first pokemon
Calls the
getPokemon()
function in order to run it
Once the function is called, the code inside it runs. Here, we’re only doing two things:
Using the
axios.get()
method to call a specific resource within PokeAPI. In this case, it’s the first entry in the pokemon resource, which contains data about bulbasaur.
Once we get the response, we use JavaScript’s built-in
console.log()
function to display the pokemon’s name in the terminal
PokeAPI returns
JSON
data, so we access specific pieces of that data by using
dot notation.
To get the name, we have to traverse the JSON data tree.
PokeAPI
is mainly a learning tool, and they actually have a great interface for exploring the API’s data right on their homepage. I’d encourage you to check it out if you want to understand the JSON data structure found in the response a bit better.
Here’s a screenshot showing the name that we’re accessing:
Here, you can see that there’s a
species
object, which contains a property called
name
. (There’s also a separate
name
property as well, but I’ve found that the
species.name
property is more reliable to use).
Note:
You can see all of the properties accessible via this
pokemon
endpoint at the
endpoint’s page in the official PokéAPI docs
.
Of course, in the code above, we’re accessing:
So where does the
poke.data
part come into play?
poke
is a variable that we declare, which holds the
entirety
of the response from PokeAPI. Let’s look at the API call:
await axios.get(`https://pokeapi.co/api/v2/pokemon/1`).then((poke) => {
console.log(poke.data.species.name)
})
I’ll cover the
await
part in a second; right now, let’s look at the part that says
.then((poke) => ...
and break that down.
The code
axios.get(`https://pokeapi.co/api/v2/pokemon/1`)
calls the PokeAPI to get the resource stored at
https://pokeapi.co/api/v2/pokemon/1
.
Once the call is finished, we need to do something with the response. The
.then()
function allows us to do this.
Within it, we’re both defining and calling a function (using an
arrow function
) which stores the entire response in a variable called
poke.
It then uses
console.log()
to log the
poke.data.species.name
property’s value.
Using
.then()
just keeps our code nice and concise. We could re-write it using an old-school function declaration and get the same result:
async function getPokemon() {
const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/1`)
log(poke)
}
function log (poke) {
console.log(poke.data.species.name)
}
But this is more verbose, so using
.then()
is preferable.
Next, let’s address the
data
property in
poke.data.species.name
. We don’t see that on the PokeAPI website’s example response, so where is it coming from?
As it turns out, the response we get from PokeAPI contains a
lot
of information. We get a status code, headers, config information, and a lot of other information that we generally don’t need to worry about (but that’s good to have for debugging in case something goes wrong).
The entire response is contained within an
object,
and inside that object there is another
nested
object called
data
. This
data
object contains all the information that you can see on the PokeAPI homepage’s sample response.
More on objects:
In the accordion block below, I’ve included the
entire
response that PokeAPI returns for this API call. Take a second to look through it and identify the
data
object.
You may have also noticed the
async
and
await
keywords shown in our sample script. These have to do with
asynchronous JavaScript
and
Promises,
two topics that are intermediate-level in complexity.
I’ll explain them in the accordion block below and link you to some useful resources for learning them in more detail, but the gist is this:
Axios is a “promise-based” library, and to use it correctly within our script, we need to use
async
and
await.
If we don’t, responses might come back from the PokeAPI out-of-order.
Of course, there are other JavaScript tools for working with APIs that don’t force you to use Promises (like
fetch
), but I’m choosing to use Axios for this tutorial because it’s the default option used by
Pipedream
, which is an amazing automation platform that I’ll be using for upcoming Notion API tutorials.
Some content could not be imported from the original document.
View content ↗
Some content could not be imported from the original document.
View content ↗
With all that preamble out of the way, let’s start coding!
In the embedded Replit above, we made a single call to PokeAPI and logged bulbasaur’s name in the terminal. Let’s take that a step further and set the foundation for our script by adding the following code to
index.js
in our Glitch project (everything from here on out will go in
index.js
):
const axios = require('axios')
const { Client } = require('@notionhq/client')
const notion = new Client({auth: process.env.NOTION_KEY})
const pokeArray = []
async function getPokemon() {
const start = 1
const end = 10
for (let i = start; i <= end; i++) {
const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
.then((poke) => {
console.log(poke.data.species.name)
})
.catch((error) => {
console.log(error)
})
}
}
getPokemon()
Note:
From this point on, we’ll often be adding new code in between existing lines. Sometimes we’ll even change existing lines. I’m doing it this way so the learning curve in this tutorial remains gradual. I’ll make sure to highlight those lines in the code blocks that follow this one. Remember, you can always reference the full code (with or without comments) in the
Steal My Code
section above.
In your terminal, type
node index.js
and then hit Enter to run your script. If you’ve set things up correctly so far, you should get a list of the first 10 Pokemon:
This code is very similar to the code in the embedded Replit example above.
One change is the addition of these lines:
const axios = require('axios')
The first two are creating a
notion
variable and bringing in the Notion SDK that we imported earlier, so we can use it within our script. We’ll start using it in earnest below when we
send our first page to Notion
.
We’re also creating an empty array with
const pokeArray = []
. As I mentioned in the tutorial overview, we’ll be adding an
object
for each Pokemon to this array. Then, we’ll loop through the array and create a new page in Notion for each of those Pokemon objects.
Another big difference is that we’ve added a
for loop
to the function; now we’re calling the PokeAPI from inside it.
This means that we’re making a call to PokeAPI every time the loop executes.
Additionally, we’ve tweaked our
axios.get()
function call slightly. It now reads:
We’ve wrapped our PokeAPI URL in
template literals
(the backticks
``
), which allows us to use variables within it.
We can use
${}
to reference a variable within our string; in this case, we’re referencing
i
, which increases by 1 each time the loop runs.
In effect, each execution of the loop calls the
next
Pokemon from PokeAPI:
https://pokeapi.co/api/v2/pokemon/1
https://pokeapi.co/api/v2/pokemon/2
https://pokeapi.co/api/v2/pokemon/3
…and so on.
The
start
and
end
variables define how many times the loop will run. Currently, we’ve set them so that the loop runs 10 times, but hopefully you can see how tweaking them would let us get all 905 Pokemon!
Finally, I’ll point out the addition of the
.catch()
block of code:
const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
.then((poke) => {
console.log(poke.data.species.name)
})
If our API throws an error for some reason, the catch block will be activated. Right now, we’re just logging the error in the console, but you could add more sophisticated error-handling code if you wanted. Learn more here:
Format the Pokémon Data
The next thing we need to do is construct an
object
that will hold the information about each Pokemon that we want to send to Notion.
That information includes:
Name
Number
Type(s)
Category –
e.g. “Flame Pokemon” or “Seed Pokemon”
Generation
Height
Weight
HP
Attack
Defense
Special Attack
Special Defense
Speed
Sprite
Official Artwork
Flavor text
We could declare individual variables for each of these, but a better method is to construct an
object
and store the values inside it.
In JavaScript, an object is a collection of
key:value
pairs. Object keys always have defined names, and the key:value pairs do not have a specific order (unlike arrays).
Objects are heavily used in JavaScript, so check out this primer if you want to learn more about them:
We’re going to create an object for each Pokemon that will store all of the data we want to send to Notion.
For now, we won’t add
all
of the information. Instead we’ll stick with a few basics – name, number, height/weight, and basic stats. This will keep things simple; we’ll add the other pieces later on.
Remove the old
console.log()
line, and add the highlighted code within your
.then()
block:
const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
.then((poke) => {
pokeArray.push(pokeData)
})
.catch((error) => {
console.log(error)
})
In the
pokeData
object declaration, we are creating several
keys
, such as name, number, height, etc.
The
value
that corresponds to each key is dynamically set by accessing a specific value from the
poke
object, which contains the entire response from PokéAPI.
Later, we’ll access the values of
this
object in order to send information to Notion. You can see that we’re already doing it once here:
console.log(`Fetched ${pokeData.name}.`)
.
After declaring the
pokeData
object and filling it up with values, we also add the object onto the end of our
pokeArray
array with
pokeArray.push(pokeData)
.
You may remember that we declared that array near the top of our code:
const pokeArray = []
.
The
[]
symbols define the variable as being an array, but when it was declared, it was empty. In other words, it was an array with no elements inside it.
Using the push method, we “push” our
pokeData
object onto the
end
of the array. You can learn more about how this method works here:
Before we move on, you should also change your
const end = 10
line to
const end = 1
for now:
This will cause the script to fetch only the first Pokémon, Bulbasaur. Later, we’ll change it to a higher number so we can fetch hundreds of Pokémon – but for now, it’ll keep things simpler if we fetch just one.
Once again, run
node index.js
in your terminal. You should see a result like this:
The
console.table()
method is another useful tool for seeing information in the terminal. It nicely formats data structures like objects, and by using it we can see all of the properties that we created within the
pokeData
object.
I’ve removed the
console.table()
line from my final code; you can choose whether or not to do the same. Leaving it in won’t change anything, as it’s just a logging tool.
Create Your First Page with the Notion API
Now that we have a tidy little object full of Pokémon data, let’s send it to Notion and create the first page in our Pokédex!
To do that, we’ll declare a second function called
createNotionPage()
at the bottom of our code, beneath the
getPokemon()
function call.
Additionally, we’ll
call
the
createNotionPage()
within the
getPokemon()
function’s declaration, at the very end before its closing curly brace.
Go ahead and add the highlighted lines to your code:
pokeArray.push(pokeData)
})
.catch((error) => {
console.log(error)
})
}
}
getPokemon()
We’ll go through what this code does in a second. For now, we’re going to run the code and see what happens.
First, you’ll need to go to your Pokédex database’s
•••
menu, go to
Group
, and set the
No Generation
option to visible. We currently aren’t passing generation information, so you’ll need to do this in order to see the page you’re about to send to Notion.
Next, go ahead and run
node index.js
in the terminal once more.
If your code and
.env
variables are set up correctly, you should see something similar to this in your terminal:
app@blog-notion-pokedex:~ 23:48
$ node index.js
Fetched bulbasaur.
┌─────────────────┬─────────────┐
│     (index)     │   Values    │
├─────────────────┼─────────────┤
│      name       │ 'bulbasaur' │
│     number      │      1      │
│     height      │      7      │
│     weight      │     69      │
│       hp        │     45      │
│     attack      │     49      │
│     defense     │     49      │
│ special-attack  │     65      │
│ special-defense │     65      │
│      speed      │     45      │
└─────────────────┴─────────────┘
Sending bulbasaur to Notion
{
object: 'page',
id: '64499d85-9748-4ddd-a08b-38a8c6dd6a2c',
created_time: '2023-02-05T23:49:00.000Z',
last_edited_time: '2023-02-05T23:49:00.000Z',
created_by: { object: 'user', id: '19c6f4cd-6e7d-40ef-8489-9983b28e1bf5' },
last_edited_by: { object: 'user', id: '19c6f4cd-6e7d-40ef-8489-9983b28e1bf5' },
cover: null,
icon: null,
parent: {
type: 'database_id',
database_id: 'c9cdd00e-d731-4f94-97f4-ab23e9fa0bdd'
},
archived: false,
properties: {
Height: { id: 'C%3FgF', type: 'number', number: 7 },
'Weight (kg)': { id: 'Dn_%5D', type: 'formula', formula: [Object] },
Attack: { id: 'MRaQ', type: 'number', number: 49 },
'HP Label': { id: 'MdMo', type: 'formula', formula: [Object] },
Weight: { id: 'N%3BN%7B', type: 'number', number: 69 },
'Stats Meta': { id: 'NZS%7B', type: 'formula', formula: [Object] },
HP: { id: 'Rce%7D', type: 'number', number: 45 },
'Sp. Attack': { id: 'U%7Bi%40', type: 'number', number: 65 },
'Defense Label': { id: 'VRMi', type: 'formula', formula: [Object] },
Sprite: { id: '%5BlYm', type: 'files', files: [] },
No: { id: '%5DY%40D', type: 'number', number: 1 },
'Ht/Wgt Meta': { id: 'cjoi', type: 'formula', formula: [Object] },
Speed: { id: 'dCkj', type: 'number', number: 45 },
'Height (m)': { id: 'e%5DNz', type: 'formula', formula: [Object] },
Defense: { id: 'iLgx', type: 'number', number: 49 },
'Height (ft)': { id: 'i%5DgP', type: 'formula', formula: [Object] },
Meta: { id: 'oBLz', type: 'formula', formula: [Object] },
'No Label': { id: 'oLD%3B', type: 'formula', formula: [Object] },
'Sp. Defense': { id: 'pmEd', type: 'number', number: 65 },
'Weight (lbs)': { id: 'qT%5Er', type: 'formula', formula: [Object] },
Generation: { id: 'q%5CeI', type: 'select', select: null },
Type: { id: 'smaD', type: 'multi_select', multi_select: [] },
Category: { id: 'tESh', type: 'rich_text', rich_text: [] },
'Attack Label': { id: 'xLfc', type: 'formula', formula: [Object] },
Name: { id: 'title', type: 'title', title: [Array] }
},
url: 'https://www.notion.so/bulbasaur-64499d8597484ddda08b38a8c6dd6a2c'
}
Operation complete.
You should also see a new Bulbasaur entry in your Pokédex:
Congratulations!
You’ve just created your first page in Notion using the Notion API.
If it didn’t work, make sure you added the line calling
createNotionPage()
right before the closing
}
in your
getPokemon()
function!
Now let’s walk through these code additions and see what’s actually happening.
The code we added here does five distinct things:
Declares the
createNotionPage()
function.
Creates a
for...of
loop, which allows us to iterate over the elements of
pokeArray
, performing the same set of actions (defined within the loop) on each one.
Defines a
data
object, which is formatted in the way the Notion API wants, and which is filled with the values of the current object within
pokeArray
that the loop is working on.
Sends a POST request to the
https://api.notion.com/v1/pages
endpoint of the Notion API in order to create a new page, using the information from the
data
object
Finally, calls the
createNotionPage()
function from within the
getPokemon()
function, after everything else in that latter function has finished executing.
At this point, the basic structure of the entire script is in place. You can jump back up to the
flow chart
(or
view it on Whimsical in a new tab
) to see that entire structure, but here’s a super-quick refresher.
When you run
node index.js
in the terminal, the following process kicks into high gear:
Axios and the Notion API client are imported, the
notion
variable is created, and the
pokeArray
array is created (initially empty).
getPokemon()
is called.
Within
getPokemon()
, a loop executes. For each loop iteration, we make a call to PokéAPI for a Pokémon, then place the data we want from the response into an object called
pokeData
.
We then push that
pokeData
object onto the end of
pokeArray
.
After the loop has finished running as many times as is defined, we call
createNotionPage()
.
Inside
createNotionPage()
, we have a loop that will execute for each object within
pokeArray
.
Each time, it will take the data from the current object within
pokeArray
being worked on, place it in the
data
object, then send that object off to Notion within a request to create a new page.
In other words, we go through one loop to called PokéAPI a bunch of times and load up our
pokeArray
with lots of objects (one for each Pokémon), then we go through another loop a bunch of times to send those objects to our Notion Pokédex.
Now that you understand the gist of what’s happening, let’s dig into the actual call being made to the Notion API.
First, I’ll briefly cover what’s happening in our
for...of
loop:
This is a looping construct that iterates over every element in
pokeArray
. As you’ll recall, each element in that array is an object, defined by the
pokeData
object definition, which holds information about each Pokémon.
Each time the loop executes, the current element of
pokeArray
is temporarily stored in the
pokemon
variable defined in the loop declaration.
This means that we can access the Pokémon’s name like so:
pokemon.name
Earlier in the script, we used
pokeData.name
to do the same thing. But since we define the variable name as
pokemon
in the loop declaration, we now use
pokemon
instead of
pokeData
.
Next, let’s look at the
data
object declaration.
const data = {
"parent": {
"type": "database_id",
"database_id": process.env.NOTION_DATABASE_ID
},
"properties": {
"Name": {
"title": [
{
"text": {
"content": pokemon.name
}
}
]
},
"No": {
"number": pokemon.number
},
"Height": { "number": pokemon.height },
"Weight": { "number": pokemon.weight },
"HP": { "number": pokemon.hp },
"Attack": { "number": pokemon.attack },
"Defense": { "number": pokemon.defense },
"Sp. Attack": { "number": pokemon['special-attack'] },
"Sp. Defense": { "number": pokemon['special-defense'] },
"Speed": { "number": pokemon.speed }
}
}
data
is an object that is structured exactly as the Notion API expects. Of course, you may now be wondering… how do I know how to structure the object?
That’s where the
Notion API documentation
comes in – and you’re going to want to get very familiar with it.
In this case, I looked at the reference for creating new pages:
On this page, you can get all the information you need to properly structure your request to the API. Let’s go over a few important parts of this page:
First, at the top of the page you’ll see the endpoint URL and the method required for sending this type of request. For creating a page, you send a POST request to
https://api.notion.com/v1/pages
– or you use a method that does the same for you (e.g. using
notion.pages.create()
as we are in our script).
Second, you’ll see the body parameters that can be sent with the request. You’ll also see the ones that are required – in this case, the
parent
(which is either a
database
or an existing page) and the
properties.
Third, you’ll see the example code area. This shows a sample request, which you can use as a reference for modeling your own request.
Fourth, you can see examples of
responses
that the API will send back. Here on the
Create a Page
doc, there are four possible responses:
200 – a successful response, indicating that the page has been created.
400 – invalid request (can mean several things)
404 – resource does not exist (in this case, the parent)
You can see a full list of the error responses that the Notion API may return here:
Using the information on this page –
especially
the example code – I was able to properly construct the
data
object.
There’s one other page that came in very handy for constructing this request, and that’s the
Property Values
reference:
Note:
This page is currently not shown in the sidebar of the API reference. It’s quite hard to find, and it’s the only page that shows you explicitly how to
set
property values when creating or updating pages. There is also a
Page Property Values
page, which
is
listed in the sidebar, and which has a very similar title – but only shows you the responses that you get when you
retrieve
property values. Notion is in the middle of merging these two pages, but as of this writing, that process hasn’t been completed yet.
This page will show you how to properly construct an object in order to set any kind of property value (that is supported by the API).
For example, here’s how you’d set a value in the
number-type
property called
No
:
Important Note:
That first key value (in this case, “No”),
must
match the name of the property in your database.
Using the property references on that page, you’ll be able to figure out how to structure your request and add values to all of the properties in your target database (if indeed you’re creating a page in a database).
Finally, we have this small block of code that actually sends the request to Notion:
console.log(`Sending ${pokemon.name} to Notion`)
console.log(response)
Here, we’re simply using the
notion.pages.create()
method, passing our
data
object as the argument. Note that we could have defined the object directly between those parentheses, but I find it cleaner to define it first and then simply pass the variable as the argument.
The
console.log()
lines simply log information in the terminal.
Before we move one, I’d like to cover one more quirk from our
data
object definition:
"Defense": { "number": pokemon.defense },
"Sp. Attack": { "number": pokemon['special-attack'] },
Note how the first line accesses the
defense
property:
pokemon.defense
– this method of accessing object properties is called
dot notation.
It can be used when the property name contains only letter, numbers, or underscores.
When a property name contains other characters – such as spaces or dashes – then you must use
bracket notation
to access it. The line accessing
special-attack
shows how:
pokemon['special-attack']
. Learn more here:
Create Multiple Pages at Once
Now that we have the basic structure of our script in place, it’s time to kick things up a notch and fetch multiple Pokémon at once.
Fortunately, we already have both of our loops in place! So all we need to do in this step is:
Tweak the
end
variable so that the initial loop runs more than once, and fetches more than one Pokémon
Add a “wait” function to prevent our script from getting rate-limited
Add/change the
highlighted
lines in your code:
async function getPokemon() {
const start = 1
for (let i = start; i <= end; i++) {
const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
.then((poke) => {
const pokeData = {
"name": poke.data.species.name,
"number": poke.data.id,
"height": poke.data.height,
"weight": poke.data.weight,
"hp": poke.data.stats[0].base_stat,
"attack": poke.data.stats[1].base_stat,
"defense": poke.data.stats[2].base_stat,
"special-attack": poke.data.stats[3].base_stat,
"special-defense": poke.data.stats[4].base_stat,
"speed": poke.data.stats[5].base_stat
}
console.log(`Fetched ${pokeData.name}.`)
console.table(pokeData)
pokeArray.push(pokeData)
})
.catch((error) => {
console.log(error)
})
}
createNotionPage()
}
getPokemon()
async function createNotionPage() {
for (let pokemon of pokeArray) {
const data = {
"parent": {
"type": "database_id",
"database_id": process.env.NOTION_DATABASE_ID
},
"properties": {
"Name": {
"title": [
{
"text": {
"content": pokemon.name
}
}
]
},
"No": {
"number": pokemon.number
},
"Height": { "number": pokemon.height },
"Weight": { "number": pokemon.weight },
"HP": { "number": pokemon.hp },
"Attack": { "number": pokemon.attack },
"Defense": { "number": pokemon.defense },
"Sp. Attack": { "number": pokemon['special-attack'] },
"Sp. Defense": { "number": pokemon['special-defense'] },
"Speed": { "number": pokemon.speed }
}
}
console.log(`Sending ${pokemon.name} to Notion`)
const response = await notion.pages.create( data )
console.log(response)
}
console.log(`Operation complete.`)
}
Now let’s test this out. First, delete your original Bulbasaur entry from your Pokédex, since it will be recreated.
Next, run
node index.js
in the terminal once more. If everything goes smoothly, you should see a
lot
of log information in your terminal. Additionally, you should now have ten entries in your Pokédex:
Let’s go over what we’ve added.
The first change here is pretty simple. We’re just changing
const end = 1
to
const end = 10
, which will cause our initial loop to run ten times.
This means that we’ll make ten called to PokéAPI and add ten objects to
pokeArray
.
The other change is the addition of the following code beneath the
getPokemon()
call:
const sleep = (milliseconds) => {
return new Promise(resolve => setTimeout(resolve, milliseconds))
};
This is a simple function that takes a single argument (a number) and will cause the script to wait that many milliseconds before continuing whenever we call it.
You can see that we’re calling it right before sending each page to Notion:
console.log(`Sending ${pokemon.name} to Notion`)
const response = await notion.pages.create( data )
console.log(response)
JavaScript doesn’t have a built-in
sleep()
function as some other languages do, but we can use the above code to approximate one. It uses a combination of
setTimeout()
(a built-in
Web API
method), a Promise, and async/await to essentially pause the script for the number of milliseconds we specify.
Why are we doing this, though?
The reason is that requests to the Notion API are
rate-limited,
meaning you can’t send a huge number of requests super-quickly to it. Notion is not unique here; almost all APIs have some kind of rate-limiting implemented.
The Notion API currently allows an
average
of three requests per second:
The rate limit for incoming requests per integration is an average of three requests per second.
Some bursts beyond the average rate are allowed.
Read more here:
This doc also mentions that a rate-limited request (e.g. one that fails due to hitting the rate limit) will return a 429 error. If you get this, you’re supposed to set up your code to try the request again after a number of milliseconds that is specified in the Retry-After header value in the 429 response.
However, a quick-and-dirty way to make sure we never even see a 429 response is to make sure our script never sends requests too quickly.
Hence our
await sleep(300)
line before the actual call to the Notion API – we are waiting 300ms before sending each request, keeping our average very close to that three-requests-per-second limit.
There are certainly more sophisticated ways you could handle Notion’s rate limits, which would likely make your application run faster. I’d encourage you to explore them as you continue to learn and build!
Refine Your Pokémon Data
At this point, your script can send basic information about multiple Pokémon to Notion all at once.
Now we’ll start the process of adding additional information to each Pokédex entry, as well as refining some of the information we already have.
Add/change the
highlighted
lines in your code:
async function getPokemon() {
const start = 1
const end = 10
for (let i = start; i <= end; i++) {
const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
.then((poke) => {
const sprite = (!poke.data.sprites.front_default) ? poke.data.sprites.other['official-artwork'].front_default : poke.data.sprites.front_default
console.log(`Fetched ${pokeData.name}.`)
console.table(pokeData)
pokeArray.push(pokeData)
})
.catch((error) => {
console.log(error)
})
}
createNotionPage()
}
Remember, you can always jump back up to the
Steal My Code
section to see the final version of the code.
This step adds a lot of code, and makes some significant changes to the
pokeData
object declaration.
If you’re starting to feel overwhelmed, now might be a good time to get up and take a short break! I made a video about how breaks are crucial to learning and productivity a while ago, and it even has a Pokémon in the thumbnail… so you know I have to include it here.
Some content could not be imported from the original document.
View content ↗
Once you’re feeling fresh, let’s take some time to go through each of these new additions to our code.
At a glance, here’s what we’re accomplishing in this step:
Get and store each Pokémon’s type(s)
Reformat each Pokémon’s name to look nicer (e.g. changing “mr-mime” to “Mr. Mime”)
Construct a valid
Bulbapedia
URL for each Pokémon, which we’ll later embed in that Pokémon’s page content
Get and store the sprite and/or official artwork for each Pokémon
Each of these steps has a specific code block. For now, we’re simply getting and formatting this information; we’ll send it to Notion in a later step.
First, we get the Pokémon’s type – or multiple types!
const typesRaw = poke.data.types
const typesArray = []
for (let type of typesRaw) {
const typeObj = {
"name": type.type.name
}
typesArray.push(typeObj)
}
This presents a bit of a challenge. Pokémon can have up to two types, and PokéAPI returns each Pokémon’s type(s) as an array filled with objects. See for yourself at the
official docs for the pokemon endpoint
.
This means we have to:
Dig into each object within the
types
array and get the name of each type
Place to types into a
new
array of objects, structured in the way that the Notion API requires
To do this, we create a
typesRaw
variable, setting its value to the entire array of types from the API response:
poke.data.types
. We also create a new
empty
array called
typesArray
.
Once again, we’re using a
for...of
loop to iterate over
typesRaw
. Inside, we declare an object called
typeObj
, setting its
name
property to
type.type.name
.
The first
type
in that object is simply the
type
variable we defined in the
for...of
loop declaration, which represents the current object being iterated over. The second is the actual
type
property, the value of which is an object containing the
name
property (in addition to a
url
property that we aren’t using).
Next, we format the Pokémon’s name so it looks nicer. This process also has a secondary benefit; it will allow us to construct valid
Bulbapedia
URLs later.
const processedName = poke.data.species.name.split(/-/).map((name) => {
return name[0].toUpperCase() + name.substring(1);
}).join(" ")
.replace(/^Mr M/,"Mr. M")
.replace(/^Mime Jr/,"Mime Jr.")
.replace(/^Mr R/,"Mr. R")
.replace(/mo O/,"mo-o")
.replace(/Porygon Z/,"Porygon-Z")
.replace(/Type Null/, "Type: Null")
.replace(/Ho Oh/,"Ho-Oh")
.replace(/Nidoran F/,"Nidoran♀")
.replace(/Nidoran M/,"Nidoran♂")
.replace(/Flabebe/,"Flabébé")
We’re doing a
lot
here code-wise, but the aims are simple:
Capitalize each Pokémon’s name
Handle edge cases where we need to add periods, accent characters (é), dashes, colons, or gender symbols (♂, ♀)
Some content could not be imported from the original document.
View content ↗
Third, we construct the
Bulbapedia
URL:
const bulbURL = `https://bulbapedia.bulbagarden.net/wiki/${processedName.replace(' ', '_')}_(Pokémon)`
This step is fairly straightforward. We create a variable called
bulbURL
and set its value by creating a template literal (using the backtick
`
characters), which allows us to reference variables within the string.
Bulbapedia has an extremely rigid structure for its URLs. It’s always the same, except for the Pokémon name:
https://bulbapedia.bulbagarden.net/wiki/Charmander_(Pokémon)
https://bulbapedia.bulbagarden.net/wiki/Squirtle_(Pokémon)
https://bulbapedia.bulbagarden.net/wiki/Mr._Mime_(Pokémon)
Thus, our URL structure just needed to use
processedName
to set the correct URL. The only fancy thing we’re doing here is using
replace()
to replace any space characters with underscores:
`https://bulbapedia.bulbagarden.net/wiki/${processedName.replace(' ', '_')}_(Pokémon)`
More on
replace()
:
Fourth, we define a variable called
sprite
that holds
either
the Pokémon’s sprite or its official artwork:
const sprite = (!poke.data.sprites.front_default) ? poke.data.sprites.other['official-artwork'].front_default : poke.data.sprites.front_default
The reason we need to do either/or here is because Pokémon from
Pokémon Legends: Arceus
and later games don’t have sprites (their models are 3D). As a result, PokéAPI doesn’t have a sprite object for them, meaning we need to grab their official artwork instead.
Finally, we add our new key:value pairs to the
pokeData
object definition:
sprite
,
bulbURL
, and
typesArray
. Additionally, we change the value of the
name
property to be our new
processedName
variable.
const pokeData = {
"number": poke.data.id,
"height": poke.data.height,
"weight": poke.data.weight,
"hp": poke.data.stats[0].base_stat,
"attack": poke.data.stats[1].base_stat,
"defense": poke.data.stats[2].base_stat,
"special-attack": poke.data.stats[3].base_stat,
"special-defense": poke.data.stats[4].base_stat,
"speed": poke.data.stats[5].base_stat,
}
If you’d like to test your code at this point, I’d recommend
commenting out
the
createNotionPage()
function call. Adding
//
to the beginning of that line will turn it into a comment, preventing it from executing.
Doing this will allow you to see the log information for your code changes without sending more pages to Notion (which we’re not yet ready to do).
Run
node index.js
in the terminal once more, and you should see log information like this:
Here, our
console.table()
reports are now showing our nicely-formatted Pokémon names. We can also see the URLs for the sprite, official artwork, and Bulbapedia page.
Get Flavor & Generation Data for Each Pokémon
In the last step, we added quite a lot of new information to our
pokeData
object definition. However, we’re still missing a few vital pieces – including each Pokémon’s:
Generation (e.g. Gen I, II, III…)
Category/Genera (e.g. “Flame Pokémon” or “Dancing Pokémon”)
Flavor Text
The reason we haven’t gotten these pieces of information up until now is because they’re accessible via a completely different endpoint of PokéAPI: the
pokemon-species
endpoint. All of our previous information came from the
pokemon
endpoint.
In fact, PokéAPI has
several
different endpoints under the “Pokémon” umbrella:
My guess as to why they’ve designed their API this way is to simply cut down on the amount of information that is returned from a single request.
In any case, we need to query the
pokemon-species
endpoint in order to get these piece of information. To do so, add the following lines to your code, just above your
createNotionPage()
function call within the
getPokemon()
function:
pokeArray.push(pokeData)
})
.catch((error) => {
console.log(error)
})
}
const flavorText = flavor.data.flavor_text_entries.find(({language: { name }}) => name === "en").flavor_text.replace(/\n|\f|\r/g, " ")
pokemon.generation = generation
//createNotionPage();
}
This code sets up a
for...of
loop, just as we did when we created our
createNotionPage()
function (
click here to jump back to that section
if you need a refresher).
Within that loop, we’re using Axios to call the
pokemon-species
endpoint. Note how we use the
pokemon.number
property to define the specific URL:
await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.number}`)
Since we’re iterating over each element of
pokeArray
, we’re just taking the number obtained from our previous call to the normal
pokemon
endpoint.
Once we get the response, we do three things:
Declare the
flavorText, category,
and
generation
variables, setting their values by accessing the relevant information from the API response and formatting it.
Add new properties to our
pokeData
object, setting their values using the variables we just declared.
Log the event in the console.
Note that we could easily combine steps #1 and #2 here; we don’t need the interim variables (e.g.
flavorText
). I’ve only split these steps up to make things clearer.
There’s actually a lot going on here, and the steps we have to take to access and format the data in step #1 here are quite technical. Therefore, I’ll put each of them in a toggle that you can read through if you want.
Once we have those variables set, we simply create new properties in the current
pokemon
object (defined earlier by the
pokeData
definition, then represented as
pokemon
via the
for...of
loop definition):
pokemon['flavor-text'] = flavorText
pokemon.category = category
pokemon.generation = generation
As you can see, all we have to do is create the new property with either dot notation or bracket notation, depending on the characters in its name. Read more on this here:
Add New Data to the Notion API Call
We’re at the last code step! All we need to do now is modify the
data
object definition within our
createNotionPage()
function, adding the new pieces of information that we’ve fetched (generation, types, flavor text, art, etc.).
Add the
highlighted
code to your
data
object definition:
async function createNotionPage() {
for (let pokemon of pokeArray) {
const data = {
"parent": {
"type": "database_id",
"database_id": process.env.NOTION_DATABASE_ID
},
"properties": {
"Name": {
"title": [
{
"text": {
"content": pokemon.name
}
}
]
},
"No": {
"number": pokemon.number
},
"Height": { "number": pokemon.height },
"Weight": { "number": pokemon.weight },
"HP": { "number": pokemon.hp },
"Attack": { "number": pokemon.attack },
"Defense": { "number": pokemon.defense },
"Sp. Attack": { "number": pokemon['special-attack'] },
"Sp. Defense": { "number": pokemon['special-defense'] },
"Speed": { "number": pokemon.speed }
},
In addition to the additions and changes highlighted above, be sure to add commas after the closing
}
symbols where needed.
For example:
"properties": {
"Name": {
"title": [
{
"text": {
"content": pokemon.name
}
}
]
"Category": {
"rich_text": [
{
"type": "text",
"text": {
"content": pokemon.category
}
}
]
"No": {
"number": pokemon.number
},
When defining JavaScript objects or writing JSON, sequential properties must be separated by commas as shown above.
If you run into errors when trying to run your code, be sure to check for missing commas. I’ve missed plenty of them in my code before.
In this step, we add the following information:
Page Icon (Using the sprite)
Page Cover (Using the official artwork)
Properties:
Category (rich text)
Type (multi-select)
Generation (select)
Sprite (file)
Child blocks (i.e. page content)
Flavor text (quote block)
A blank space (text block – for formatting/aesthetics)
“View This Pokémon’s Entry on Bulbapedia:” (text block)
Bulbapedia URL (bookmark block)
We’ve already covered objects quite heavily in this guide, so I won’t spend too much time explaining each addition here. Instead, I’ll point you to the relevant pages in the Notion API reference that explain them.
To learn how to set the page icon and page cover, refer to the example code shown on the Create a Page reference:
Note that images cannot be uploaded to Notion via the API at this time, so you must link to an image hosted externally (as we’re doing here).
For the properties, you can currently see how to format your objects when creating and updating pages here:
In the near future, all of this information will be consolidated into the
Page Property Values
page, which is linked in the reference’s sidebar.
To add child blocks/page content, refer to the example code in the Create a Page reference linked above.
You can also use the Append Block Children reference to learn how to add new blocks to existing pages and blocks (remember, pages are blocks themselves!):
Run Your Final Test
It’s time to actually run your script!
Before you do, go into your code and “un-comment” the
createNotionPage()
function call at the end of your
getPokemon()
function:
console.log(`Fetched flavor info for ${pokemon.name}.`)
})
.catch((error) => {
console.log(error)
})
}
}
getPokemon()
This will ensure the
createNotionPage()
function is actually called, and that your pages get created in your Notion database.
Now it’s time for the moment of truth. Run
node index.js
in your terminal one more time; if all goes well, you should see these full-featured entries flooding into your Pokédex:
Since we also set up the Generation information, you’ll also get them neatly grouped under the
I
group!
If you click into each page, you should also see the flavor text and Bulbapedia link:
If everything looks good, then you can modify your
start
and
end
variables in order to fetch more Pokémon. You already have #1-#10, so now you can set:
start = 11
end = 905
Once you’re modified those variables and ran the script again, you’ll be the proud owner of a full Pokédex in your Notion workspace.
Conclusion
If you’ve followed this tutorial, you hopefully now have a strong grasp on how to work with the Notion API using JavaScript.
What you’ll quickly learn if you start working with other APIs is… you also know how to work with them as well! As I’ve learned, working with one API greatly prepares you for working with almost any other API.
From here, you can use your newly-developed programming and API skills to do nearly anything you want.
One resource I’ll recommend now is
Pipedream
, which is a platform that lets you connect APIs
and
write actual code (unlike no-code tools, such as
Make.com
).
I love Pipedream because it handles all of the server setup and API authentication for you, letting you just worry about your code. They also have an incredibly generous free tier; I can’t imagine ever having to pay for Pipedream. As a result, you’ll see Pipedream-focused tutorials on this site in the future.
This tutorial took months to produce; if you enjoyed it, you can support my work by grabbing one of my Notion templates (there are both free and paid options here):
You can also join my
Notion Tips
newsletter below for free; once you’re on it, I’ll send you tons of Notion cheat sheets and goodies. You’ll also be the first to know when I publish new tutorials and templates.
Get updates about my Notion templates and tutorials. Easily unsubscribe at any time.
ThomasJFrank.com:
Learn Notion
Notion Templates
In case of sale of your personal information, you may opt out by using the link "
Do Not Sell My Personal Information
".
To find out more about the categories of personal information collected and the purposes for which such information will be used, please refer to our
privacy policy
.