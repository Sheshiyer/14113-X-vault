# Build an AI-NLP TV Series Analysis System with Hugging Face, Chatbots… (01j6dk2trep5vbk3qvk0emyj8a)

Source: Build an AI-NLP TV Series Analysis System with Hugging Face, Chatbots… (01j6dk2trep5vbk3qvk0emyj8a).html

hello in today's video we'll build a
series analysis system with AI NLP and
llms we will create two text classifiers
an awesome character network with named
entity recognition and a character
chatbot with one of the state-of-the-art
llms out there this project is a
Powerhouse that will beef up your resume
with four big NLP models and will put
those models in a beautiful web UI with
gradio we will first start by choosing a
series to analyze and then crawl its
data from the internet using Scrapy then
we'll go over the basics of neural
networks and how they evolves to become
those powerful
llms after that we'll extract the main
themes of a series with zero shot
classifiers and hugging face in the
second module we'll create a character
Network that shows how big each
character is and plot their relationship
with one another using spaces ner model
up next is the most common NLP task in
the field which is training your own
text classifier with a custom data set
last but not least is a character
chatbot where you will be able to have a
full conversation with your favorite
character we will train an llm called
llama which is one of the best llms out
there to imitate the attitude and the
personality of your favorite character
in the series whether you're a beginner
or an experienced NLP engineer this
project will boost your NLP skills and
take your resume to the next level let's
start the project we'll Begin by finding
a series that we want to analyze
whatever series we choose we need to
find three different types of data sets
for them a subtitles data set a
transcripts data set and a
classification data set I'm going to
show you example data sets on the series
that I choose and then you can find
similar data sets on the series that you
want if you're not comfortable with your
data wrangling abilities I recommend you
to follow along with the series that I
choose and then you can expand it to the
series that you want I am going to
choose the Naruto anime Naruto takes
place in a world that is divided into
multiple hidden villages
Each of which has its own ninja clans
and some of them are good some of them
are bad but the main character here is
Naruto that is trying to become the best
ninja ever so we can start by finding by
creating a new folder that is going to
have uh our code so you can call it
whatever you want and then inside of it
we're going to have another folder that
is called Data so just create data that
is going to have our own data sets then
I'm going to paste in
uh a text folder that has the links for
the three types of data set that we want
so the first is the subtitles data set
the second is also a transcripts data
set that we are going to download and
the third one is going to be a data set
that we are going to crawl and this is
going to be the classification data
set so let's open the first
link right
there and this is going to be the
subtitles data sets for all the episodes
in the first season
just download it press on this download
button it's going to finish
downloading uh go to your downloads
folder cut it return back to your data
folder and paste it and then you can
extract
it or unzip
it then we can uh rename this folder the
extracted folder to
subtitles and delete the zip
folder and I want to show you the data
set so each of those files is going to
be an episode and uh at the beginning
you're going to find some metadata but
afterwards you're going to see that at
second five till 2
11.99 this is being said uh this is the
narration that is being
said and or a character that is saying
this and this is the second line where
also this is being said and so on and so
forth uh you're going to find that we
don't know who's saying this and this is
the difference between the subtitles
data set and the transcripts data set
the transcripts data set tells you who's
saying this right now so you can go to
the second link and uh I'm can show you
that so uh the second link is going to
be from
Kagel and it's telling you that Naruto
which is the main character is saying
this and an ninja is saying this and Uka
is saying this so on and so
forth the problem with this data set is
that it's not on all the episodes so
that's why I divided it to a subtitled
data set and transcripts data set um I'm
going to choose the subtitles data set
on the character Network and the theme
classification since it's going to be a
lot of data so we can um analyze it and
for this a smaller data set I'm going to
use it for the chatbot and yeah so make
sure to uh sign in to gagle it might
require you to sign in to download it's
going to be free and then uh you can
just press download
button again go to your download folder
cut it paste it right here then we can
extract it or unzip
it and then we have an AR folder just go
inside of it then cut the naruto. CSV
and paste it outside uh then we can
delete the zip folder and the archive
folder uh just like
that and the third one is going to be a
classification data set so let's go
inside and see
that we are going to CW this and not
download it so in this uh data set
basically uh you're going going to find
uh a lot of ninja attacks so there are
multiple ninja attacks that are being
used in the series you're going to find
a whole list and then at the bottom you
can actually go through a next page so
there's a next page and a next page and
the next page again and
again they are a lot of ninja attacks
and uh the ninja attacks is divided into
multiple categories so one category is
going to be a physical attack
uh so I'm going to show you this so if
you clicked on one attack like this if
you clicked on any attack like the 10
hit combo you're going to find its title
then its description and then its
classification this classification
basically tells you what type of ninja
attack is
this so uh we are going to have three
types of ninja attack which is um
Ninjutsu genjutsu and Tai
Jutsu uh so I'm going to show you
it uh so Tai Jutsu is going to be any
physical attack that is normal like
kicking or punching things like that
Ninjutsu is going to be somehow of a
magical attack where the use fire wind
or something called chakra is in place
and this is uh this is going to be uh
something called Ninjutsu uh it also
hurts you physically basically and
genjutsu is what hits you uh like in
your senses which is sight hearing or
like mind games so those are the three
different types of uh attacks that we
want to uh uh
classify so back again here you're going
to find that this is tautu so this is
just a physical attack and what we want
to do is that we want to Loop over each
link then uh we want to exract the title
the description and the
classification and then put it into a uh
a structured data
set and after looping in all this in
page one we want to actually Loop uh
actually Loop in page 2 3 4 and so on
and so
forth so uh to do this we are going to
use something called scraping scraping
data from the internet and this is a
very important skill when
uh in in the world of NLP since a lot of
NLP data sets are actually crawled and
this is this becomes a requirement for
the in the CV so it's quite good to have
it uh in your tool
belt and since we're going to be
crawling uh like from a website I'm
going to unboard you or like give you a
recap on the main building blocks of
HTML so that you understand what you're
craw crawling and your understand the
code that you're
writing so you can go back again to your
folder like here and I am going to open
up a
terminal and from here I am going to
open up visual studio code you can
choose whatever editor you want but I'm
choosing here uh Visual Studio
code so let's uh let's board you a
little bit on the HTML uh components and
if you're comfortable with your HTML
then then feel free to skip this section
uh but it's going to be a very quick
recap so maybe if you stayed along uh
you can just uh have a quick recap on
it so this is an HTML page uh that is
going to have HTML extension and the
first thing that we are going to do is
that we are going to have a doct type
HTML to specify that this is an HTML
page and then have some thing called
HTML to indicate that this is the
beginning of the HTML code now in HTML
things are uh in tags basically like
this an opening tag and a closing tag
and whatever data that is inside it's
going to be within this tag
so uh we can start by having a header
tag and this header is going to be just
having the title of the page and then we
can have a body tag that is going to
have the body of the
page and we can have a huge uh heading
tag that is called head head H1 and just
like the word document like header one
is going to be a big text that is going
to be bold and we can write
welcome to my
page uh then you can go back here open
up the uh the example HTML and you're
going to find the H1 tag right
there so the HTML page is being rendered
by the browser and you can see how it
looks so basically those tags is a way
to tell the browser how to display those
tags and this is just HTML it's just
markup language we're marking up the
text or the components inside of it to
tell the browser how to display it
we can also have something called a
paragraph tag which is just normal text
so this is a sample HTML page just save
it don't forget to do so go back to your
link and uh refresh it and you're going
to find that this is the paragraph tag
that we
have um and then we also have something
that is um a links like this this is a
link that we if we clicked on it it it
takes you to another
page and to do this in HTML we have an
uh we have a we have something called an
anchor
tag so an anchor tag takes in an
attribute um which is called href that
is just a link that is going to be
redirected once you click on the text so
we can just write uh Google like the
link of Google and you can write
whatever text you want here so basically
we can write Google link and then you
can close it uh and open it back here
refresh it and you're going to find the
link for Google just click on it and it
will take you to
Google then uh we also have something
called an unordered list and this is
just some bullet points that we can add
and we can have um list item which is
one bullet point and this is the first
one second one and third one uh this is
Li and this is unordered list if you go
back again here refresh it you're going
to find that it is it has item one item
two and item
three and the last component that we are
going to learn is something called a
div like that and the div here is just
um a de like uh a code container that is
going to house some more HTML code but
it's going to be easier for us to say
the code inside this div uh like give it
this uh specific styling or give it the
specific functionality so it's just um
um a way to uh to make our code easier
and to refer to specific parts of the
HTML page that we want to add
functionality on and we want to add HTML
uh like styling
on so we can just write here H2 which is
another header that is less in size and
just write first
div like this
div then we can also add a paragraph tag
and this is the
contents of the first
div save it go back again here and just
see it and you can see that it just
looks very similar to the one without
the div and again the div by itself does
not do anything it just um like uh puts
it in a in a structured container so
that the code is organized we can have
another div like
this uh we are going to
have um like uh the text is going to be
second div this is the second div in the
paragraph tag and you can see here it's
just uh the like there's quite
similar uh but we can add some styling
to a div and this is what I'm going to
refer to uh a div is just like um
something that is easier for us to refer
so we can say we can give it a class
which is
um uh a way to say this is the div that
I am referring to uh and you can write
container you can write whatever you
want here and then we can add some
styling to it so to add some styling we
can go back again to the Head write
style then write dot container which is
dot is for classes then container is the
name that we uh gave down in the div
right there
uh and we can say the text align is
Center so we are going to align all the
things that inside of this div uh
centered and this is the beauty of a div
it's like we're referring it and
anything that is inside of it is going
to like it's going to have the uh The
Styling that we uh add so if you refresh
it you're going to find that the first T
here is centered
uh we're going to also give the class to
the other one which is maybe container
two go back again up say container
two and give it a
color of
red so you can go here and refresh and
you're going to find that this is red
and this is centered so we are referring
to div uh like by the way that we want
and this by the way in the style section
this is called CSS we are not going to
cover it I'm just going to I'm just uh
letting you know what the divs are for
and those are called like CSS classes
that we can refer to then we can have
another div which is the third div and
we can have also an H2 tag and a
paragraph tag like this write third
div and this
third div like that um and let's refresh
it and see how it looks right now so
that's how it
looks and in the class like that you can
give it two classes so you can give it
container one and container two so the
stylings from this and this is going to
be applied both so it's going to be
centered and red so one div can have
multiple classes so if you can go back
here and refresh it you're going to find
that it is centered and red like
that and this is our HTML recap or quick
crash course and we are going to use
this knowledge for our
scraping uh so you can uh close
this and you can close every three other
thing like I had this folder before
that's why I have
different um like other unopened folders
but you shouldn't see it now in order
for us to crawl a website we need to use
a crawling Library a very famous library
is called Scrapy and it allows you to
scrape data from websites and uh quite
easily and the first thing that we are
going to do we are going to just pip
into install it so you can go back here
uh make sure to pip install Scrapy like
that and then press
enter uh it didn't take a long a long
time from my end because I already have
it but it should take a little bit of
time from you uh then you can clear the
output like
this and uh we can go over this code
together uh so the first thing we are
going to do is we are going to create a
folder called
crawler inside of it create a folder
create a file called whatever you want
but I am going to call it
Jutsu crawler since we are going to be
crawling
jutus and Jutsu is just the ninja
attacks uh it's called Jutsu in the
Naruto
anime um and you can go back here copy
the boilerplate code and paste it right
in
so let me explain to you what this code
is all about so it's first uh Imports
crepy then it creates a class called
block spider we can call it whatever we
want it inherits from creepy. spider um
and spider is just a crawler that crawls
multiple um web pages and it has the
ability to Traverse through web pages so
this is called The Spider and this class
has all the fun functionality that is
needed to crawl the data and put it into
a structured data
set uh it first makes the name it it
initializes a name also you can call the
blog spider whatever you want uh you can
give it whatever name you want and then
it takes in a starting URL our starting
URL is going to be the main page that
have all the jutsus listed like
this and yeah so you can choose uh when
you're choosing it like you choose the
page that you can iterate through them
uh quite easily and uh yeah it has all
the things that you want to
crawl um then it has two it has a
function called porse that has two for
Loops like this and like this the second
for Loop is the one that is iterating
over pages so it it is iterating over
this going to the next page the next
page the next page
and the first one is iterating through
the objects that we are trying to crawl
so it's iterating over uh this this this
and
this uh so it's iterating over each J2
that we have uh of course right now this
is not adapted to our code or this is
not adapted to our website but it's um
like this is some boiler plate code so
you can find that it is looping over
each title in the response and the
response here is just the web page uh
CSS is actually filtering out the HTML
page to anything that has the class of
oxy post title so it's using the class
again like those classes right there so
that's how we are referring to the
things that we are crawling and then it
tells it get me everything that has this
class it loops over them it takes in the
title and extracts the text and put it
into a structured um variable which is a
dictionary that has a title and then the
um value of the
title and yeah this is the explanation
of the boiler plate code and we can now
start adapting it so we can write
Naruto spider in the
name and uh you can go here copy the URL
and put the URL in the starting
URLs and then we want to uh know which
um like what CSS class is in this link
which is the uh the link that is
um it goes to the next page and you just
write uh press right click inspect
then you have this
tool right
there and you just highlight the next
page and if you highlight it basically
you're going to find that it is an
anchor tag right there uh with an
hre and it also has a class of MW next
link so you can copy it like this and
paste it right in and this is how you
are iterating over next pages so it is
iterating over the anchor tags and it is
calling the purse function again on it
so it's going to pass the data and then
go to the next page right now we are not
uh like extracting the data that we want
so what we want to do is we have we want
to have a for Loop that opens every link
of those so we are going to make another
request uh to get this page and then
extract this this and the classification
as well so you can go back here and you
can also choose the tool and you can
see like you can start to highlight on
the place that you want and you can see
that in this div that is called smw
column list
container it has a column so every
column like this and you can see the
highlighted version in the in the page
so this column has a lot of um that is
going to have uh uh links anchor tags
and it has a second column and a third
column and then if you open the column
like this you are going to find an
unordered list Each of which has its own
Li which is list item that is going to
have an anchor
tag and if if you see the href right
there it has/ Wiki and 10 hit combo and
if you clicked on it you can see that it
appended the Naruto fandom.com uh link
before the/ Wiki uh 10 hit
combo and yeah a better like we can Loop
over every anchor tag in the smw column
list container and is and like you can
see we only have one tag in the page one
div with that uh class in the page so
you just can copy
it and paste it right here now this is
the um this is the
div then we know that it is going to be
only one div so we can write dot of zero
then inside of this div we want to get
every anchor
tag and we we want to extract the hre
attribute of it so you can write
attribute and write H hre like this then
extract at the
end and right now we are not extracting
titles anymore we are extracting H
shs and what we needed to do is that we
needed to follow this website we needed
to follow the link and go to the other
page like these 10 hit combo and then
start
crawling so we can have
Scrapy dot request which is making
another request to
the Naruto fandom.com
slash then the href so we are going to
have
this plus
href like that and then um we can have a
function to call
uh when we have this request and let's
call this function porse jutu that takes
in the uh HTML page uh that of the hit
of the U ninja attack and then we can
start it and crawl the relevant
information that we
want so the output of P Jutsu is going
to be a dictionary I'm going to have it
as a dictionary so we can write
extracted data and this is a dictionary
so we can just replace it by
this now all what's left is that we want
to write the parse U2 function so let's
create it so create
purse purse Jutsu and you can uh like
delete the suggestion uh those
suggestions are from um from GitHub cop
pilot so yeah if you're if you're just
wondering what it is uh so yeah uh
basically it's not that accurate because
I wrote this code before maybe it just
memorized it so it it just um has a
little bit of uh like um a hint of what
I'm going to write uh write uh but yeah
because I wrote this code before in the
uh preparation for this uh for this um
for this tutorial uh so GitHub copilot
is uh a bit smarter than
usual so yeah so the first thing we want
to do here is that we want to extract
this title so you can go back again
right click inspect again I'm using
Chrome I'm using Chrome here so um
you're going to find it in Firefox and
you're going to find it in another
things uh but it might have a different
look
so yeah so just
highlight the title so if you highlight
the title you can find that it's a span
that has a class of MW page title Main
and we just want to have the text of it
so just copy the class name go back here
and then write
Jutsu name
response this is the response which is
the page uh then we can say that we want
to have a CSS selector that is going to
choose a span that is going to have this
uh class
name and what we want from this uh span
is that we want some text the text of it
and we want to extract it and only get
the like the uh zero with element
because there is uh only one of it so no
need for a the list and don't forget to
put a dot here so it's do
extract um now some uh Jutsu names might
come with trailing spaces and um some
spaces at the end so in order to remove
it we just write juu name. trip and this
trips it from any leading or trailing
spaces
now the next step is going to find the
uh uh this we want to extract this and
we want to extract the classification as
well uh the hard part here is that it's
in both are in the same div so you're
going to find MW parse output is the
main div that has both and we want to
extract this uh this classification and
we want to EXT extract this without this
trivia
section so let's first get the contents
of this div and then we can find ways to
uh extract this relevant uh
data so let's call div
selector it's going to be response.
CSS and it's going to be
div and we are going to give it what
class we choose so it's going to be MW
PSE output
class and because it's also one div in a
page so we can just write off zero then
let's extract the HTML of this uh div so
we can have
div HTML equal div
selector do extract and this extracts
the HTML of the selector that we
have uh now in order for us to choose
and to filter out the HTML uh
efficiently we want to use a library
called Beautiful soup so you can just
come here just write pip install
beautiful soup to get the beautiful soup
uh pip install uh function uh just copy
it paste it right here then press enter
and it should install the beautiful soup
I'm not going to do it I already have it
but uh yeah uh install it if you
don't and uh let's import it so
from bs4 which is beautiful soup import
beautiful
soup and we can initialize a beautiful
soup um a beautiful soup object by just
writing soup equal beautiful soup then
give it the div
HTML like that and write find div and
this gets it the first div that it has
in this
HTML so let's return back to the uh page
right here and let's see what this is so
this is called an aite section and it is
another HTML component and in this aside
section uh we have sections like this so
This section this section this section
um and inside of the sections you can
find divs also where each row right here
is going to be a div on its
own and in this div it's going to have
an H2 that is going to be this which is
the name of the attribute and then the
attribute itself so in H2 and then
another div uh wait um going to
be yeah sorry it's going to be an
H3 uh and then it's going to have
another div with the value of it so uh
yeah the h21 was the title of the
section so let's try and uh first get
the aside section and then get the div
or the H2 that have the classification
class the classification text this one
so you're going to find that it's sorry
about that it's H3 so it's H3 and then
we want to get the div inside of it so
we Loop over the divs that are rose
um and then uh choose the one that has
the H3 that has
classification and if we and if that is
the case we are going to take in the uh
classification here uh of the
div uh note that when I'm highlighting
things in the um in the HTML it's also
highlighting here so yeah uh so make
sure to look at the highlighted text it
might help help you understand things a
little bit
better so right now let's uh get this
aside section
so if
soup do find aide so if there is an
aside section then we are going to
process it if not then we are going to
skip it because there is no like there
is no classification for this jutu so
just skip
it uh write aside which is uh going to
have
soup do find aside and this extracts the
aside section and then we want to Loop
over each
row so let's uh loop over each row and
like we said each row here is going to
be a div um and uh this div has a lot of
classes so let's choose the Pi data
class like
that so let's have
four cell in
aside dot find
all and then uh tell it what do you want
to find we want to find a div uh with a
class
of a class of Pi data
and then we only want to take in the uh
the the div that has an H3 that is
called
classification so
if uh the
cell dot find H3 so if there is an
H3 uh then we are going to start
processing it and getting the cell name
so cell name equals
cell dot find
H3 and then we want to get the text and
then we want to strip
it and then if we have if this cell
name is equal equal to
classification then we want to get the
value of the preceding div uh which is
going to be
uh this one um so right now We're
looping over each row we're calling it a
cell and uh then we can get the Jutsu
type then
Jutsu uh so it's J2 type is equal to
cell
doind and then uh write div and since we
are in the same cell that is in the
classification then uh this is the
corrective that we are
having uh then write. text to extract
the text and then strip
it and in order for us to choose a Jutsu
type like to get the JSU type outside of
this if statement just initialize this
Jutsu type at the beginning with an
empty string like
that and right now we just got the Jutsu
type like this JSU type classification
right now we got it now the last thing
that we want to do is that we want to
get the description again it's in the
big div so we want to remove this asite
section and then we want to remove this
trivia
section so let's do that uh we can go
back again here write something that is
called
soup dot find aside so we are going to
find the side and then decompose it
decompose it is just going to remove it
and then uh we are going to have the
Jutsu description ready for us so we
just have the soup and then get the text
and then strip it but we also have this
trivia section and since there is no
like U div for the specific trivia
section then we are going to just uh try
and uh um um remove everything be before
uh trivia so rju description
dot uh
split write
trivia like that uh which is this trivia
so we are going to uh get the trivia
that U uh the trivia word and we are
going to get everything that is before
it so dot of zero and then strip it
basically and yeah this is the jutu
description right there we got also the
Jutsu name and we got also the Jutsu
type so let's just return it return back
the results we can return it in a dict
where Jutsu
name here Jutsu name is equal to the
Jutsu name that we extracted then Jutsu
type is equal to the Jutsu type that we
also extracted then Jutsu description is
equal to the Jutsu description that we
extracted and yeah this is the uh this
is going to Loop over the extra uh loop
over get the extracted data return it
back as a dictionary and then you're
going to find uh that it is saving the
output uh into a Json L uh um Json L
file so that we can refer to it so so in
order for us to run this uh you can go
back again here to Scrapy and you can
see that it runs by Scrapy run spider
then give it the pi. pi file and uh we
want to also uh like specify the output
path so that we can just put it into the
uh data folder so just write
Scrapy to run this file just run
Scrapy run
spider then give it the uh path of the
uh Pi file that we wrote and then uh
write o that specifies the output uh
output path then go to the data we are
going to save it in the data folder uh
and I'm going to save it as
jutus do Json
L like that then press enter I have
misspelled spider I have an r in the
wrong place so you can just press uh the
upward Arrow uh remove this uh extra R
then run
it and it might take a while for it to
finish uh running so uh just wait a
little bit for it and it should be
finished so it finished now and you can
go back to the data you can refresh your
folders right there and you can find
jutu Json L um this is a list of Json
objects uh and yeah you can find that
Jutsu name right here a Jutsu type so
Jutsu name a Jutsu type and a Jutsu
description and you can also find the 10
hit combo that we were having so a 10
hit combo then Tai Jutsu then the Jutsu
description and you can see that it
purched a lot of
jutsus so specifically it like crawled
2,920 so it's a fast way to get your own
data set and to have it uh ready for you
and into the structured format that you
need and yeah so right now you uh you uh
you knew how to crawl websites you knew
about HTML you knew about Scrapy and how
it works so this is going to be uh like
very beneficial for your uh CV and
resume and yeah and since we have our uh
data set ready now we are ready to get
our hands dirty with AI and
llms and yeah before we start with that
I am just going going to onboard you a
little bit on neural networks and Ai and
what is NLP and how did the state
of-the-art models like chat GPT and
llama uh how are they using Transformers
and how did the like uh did the research
World developed from basic neural
networks to the state of the art
Transformer models um so Transformer
models are just the models that are used
by the stateoftheart models like chart
GPT and llama like I mentioned and if
you don't know anything about neural
networks this is going to help you
understand what you're coding a little
bit and if you have some background in
Ai and NLP then feel free to uh skip
this section uh but it's going to be a
very quick recap about the neural
networks and NLP and how they even
evolved from uh just feed forward neur
networks to the Transformer models and
this Evolution I'm going to show you the
evolution of neural networks in in and
in natural language processing so if you
know also AI I encourage you to stay a
little bit so that you can know the
evolution of NLP from feed forward
neural networks to rnns to
Transformers and this will uh make you a
better uh candidate in the interview
process so that you can talk more about
the uh those
models so any AI or neural network
starts off with a data set to learn from
and right here we have a very simple
data set that is depending on the weight
and height as input we are going to
predict whether this is a cat or a dog
so we can just plot this data out for
example in the 9.6 as weight and 22.2 as
height so you can go like 9.6 then 22 as
height then instead of just putting a
DOT I put a cat to indicate that this is
a cut um I can go on so on and so forth
to put all those uh data sets uh
here now this is what's called a
classification data set where the input
uh depending on the input the AI or the
neuron network is predicting a defined
set of classes like cat or a dog and uh
if you give it a rhinoceros for example
it will also predict a cat or a dog it
doesn't have the ability to classify
anything else so the neural network um
we can give it a new sample like this
circle and basically tell it is this a
cat or a dog so we have the weight and
the height but we don't know whether
this is a cat or a dog again this is a
very simple data set but you can imagine
having it on more
uh complex uh problems um so as human
beings we can say this circle is closes
to the dogs and so it's basically uh
with good probability it's going to be a
dog so um we can say that I am going to
just put a line there right there and
say anything above the line is called a
dog and anything below the line is
considered a cat and and this line is
just um like represented by the simple
line equation which is y = mx + b where
m is the slope X is the x value and B is
the Y
intercept and we can have something
similar in this use case where uh we
have W1 uh time height plus W2 uh times
weight plus b which is the Y intercept
and W1 and W2 we can calculate them uh
as human beings but uh in more complex
problems we actually can't uh and this
problem is 2D so only weight and height
but you can imagine having an image with
thousands and thousands of pixels uh or
a natural language processing with a lot
of words so this becomes very complex
very fast so we can't reliably do this
and in order for the neural network to
know
what is the optimal W1 and W2 it needs
to start off randomly and when starting
off randomly it does errors so we said
anything that is above the line is
considered a dog and you can see that
those two dogs are misclassified and
those three cats are also misclassified
as dogs so this is the error uh but
what's beautiful is that through
statistics it can calculate this error
and then it can take one step into the
right direction to decrease this error
so you can see that it adjusted itself
so that this cat is now correctly
classified this is what we call training
training is the process of like having a
forward propagation where we predict
cats or dogs then we have something
called backward propagation where we
calculate the loss then try and take the
next step into making this model a
little bit better now not all the data
fits into memory uh some data sets are
millions and millions of rows so uh we
divide them into batches so we say for
example take those two dogs and take
those two cats and those two dogs train
on them and then adjust the model train
on the model and learn from it and then
take another two cats and another two
dogs and this is uh batches so we batch
uh the data set up into multiple
clusters and then we can train from
them um and when we Loop over the whole
data set when we Loop over the whole
batches we uh we do something called an
epoc and we might have multiple ooks and
uh so we can learn from one uh data uh
from one data sample multiple times and
after it finishes it just like gets the
optimal model
uh we get the weights so the weights
here are just W1 and W2 and B which is
the optimal parameters to make this
neural network has its minimal
loss uh now uh we can represent this
neural network in a different way other
than the equation uh by having this uh
way of representing a neural network
it's more
popular uh first we have the input nodes
weight height and one as for the bias or
the Y
intercept uh so you can find that this
is just the height number and this is
that the weight number we multiply it by
W2 W1 and B so we so we multiply B * 1
W2 * uh W1 * height and W2 * weight then
they meet in this output node and we do
whatever this output node does so right
now just summing so it sums up all those
factors together to give us the Y now
this neural network only has two layers
the input layer and the output layer but
more complex neural networks has more
layers like that and this is just a
three uh a three layer new network where
this is the input layer and this is just
going to be a an in between layer that
is called the hidden layer uh right now
we have more weights like you see it's
not it's not just only
three and um each one is going to have
uh a direction to the node so those
nodes have a something called a Rel
function which is a nonlinear activation
function so that we are not only limited
to um to have straight lines we can have
curves right now we can have like more
complex um more complex neural
networks and yeah afterwards we have the
output layer that is going to also have
a sigmoid activation function which is
going to limit the output between 0 to
0.5 so we can easily say from 0 to 0.5
is cut and from 0.5 to one is dog for
example and the more layers that we have
the more complex problems that we can
solve and the more weight that we have
also the more complicated the neuron
Network becomes and the more comp
licated the problems that it can solve
now let's switch to NLP so NLP basically
is some text and from this text let's
also say that we want to classify so
let's say that this is a comment and
from this comment this video is awesome
and then it classifies it as toxic or
non-toxic so it's also a classification
problem but the problem here is that the
input now is text
and you can see from here that those are
just mathematical functions like the
forward propagation and the backward
propagation and how are we going to
input those um those uh words into those
mathematical
functions so we are going to divide like
to divide a sentence into words or
subwords that we are going to call
tokens and Each of which are going to be
assigned a number so this number is just
uh a lookup table that says video is 36
is is
125 it's just a big dictionary that
assigns each word or subword to a
number then we take those numbers in and
put it again into as input as a neural
network into the neural network and it
was able to understand whether this
comment is toxic or non-toxic like it
was able to understand whether this is
is a cat or a
dog now the problem with this neural
network architecture is that you can see
it only takes in four words and um or
like we call it four
tokens uh a natural language input in
sentences may vary in size a comment can
be just one word or it can be a 100
words so we don't know actually how many
words the input should
be so that's why research
have defined something called an RNN our
current neural network that takes in
just one word as input but we have the
ability to scroll through the words one
by one so we can do forward propagation
words one by one while it has the
ability to remember what the previous
words
were so we can input like 42 which was
the word this and it outputs two things
which is the output and the hidden layer
or the hidden State this hidden state is
just the memory of the uh of the
previous
words so you can run in
42 and then you can scroll through to 36
and 36 is going to have like uh the word
the word uh the word 36 is going to have
this is the next input but it also takes
in the previous hidden State as input so
that it can remember what the previous
words were and then it can scroll
through the all all the words so that it
can output at the
end and this is an unfolded version of
the same neural network uh again this is
the same model so uh this is what time
is it and you can see that it takes in
the word what then at time it takes in
the hidden state and it takes in time to
produce the next uh the next state and
at every state it outputs an output but
we can ignore this output and only take
it into the last like from the last
word now what's limiting here is that um
this
RNN is uh going to limit us into the
number of Weights that it uses because
we are using the same weights uh that a
for every word so for every word we are
using a limited set of Weights that we
are having and this neural network is
becoming harder and harder to train it
has uh problems like exploding gradients
and Vanishing gradients which basically
means that the learning steps are
becoming too small or too large for the
neural network to learn anything and
that's why people have actually went to
create the state ofthe artart model that
is called
Transformers so let's see how this uh is
done I am going to use a tutorial by
jelmar to explain this he have very good
visualizations for it so I'm going to be
utilizing them so jalmar starts off by
explaining neural machine translation
which is translating words from one uh
one language to another like uh this is
translating from French to English and
an encoder is just an RNN like the one
that we had um and we are going to take
its last hidden State and put it to the
decoder which is just another RNN but it
takes in the hidden state of the encoder
as the first input and that is just the
difference of it so you can see the
visualization right here so J has come
like has been feed forwarded to the
encoder then it has the first hidden
State then the hidden state of one and
the second word which is s um come
together to produce the second one and
then we have the third hidden State and
this hidden state is the input of the
decoder so that it can output the I am a
student which is the translation of the
French sentence you can see that this is
four words as output and the input were
only three words so it doesn't have have
to be the same amount of
wids and you can also see it as an
unfolded
version so uh encoder at hence 2 then uh
output then the this encoder is going to
the decoder and then it's going to have
the I am a
student now this was working fine with a
moderate amount of accuracy but in order
for us to increase the accuracy see we
needed uh to add um something for
attention because by when the sentences
become uh longer uh the decoder RNN
starts to forget what it's trying to
translate so we need to have something
called attention which is a couple um
like um more weights to the
model so instead of having the hidden
the last hidden state only uh like fed
to the decoder we are now trying to feed
the whole like the all the hidden States
together uh into the uh into the RNN but
in order for us to do that uh we will
need to also tell the model which hidden
states to focus on so this is what we
have as attention so we take in the all
the hidden States from the input from
the RNN uh encoder then we have just a
set of Weights that can score those uh
score those um hidden States together
then it sums those hidden States and it
has at the end the attention
Vector so let's see it from here so this
is the whole three hidden States they
are multiplied by a set of weights you
can see it right here then they are
sumed together then they are added into
the input uh into the uh hidden State
and then there is the output of
it and if you can see the attention for
the second word is going to mainly focus
on the second attention
place now it doesn't need to attend to
it incrementally it's doing it right now
like I said uh number of words as input
is not going to be the same number of
words as the output so we need to have
the uh the neural network pick and
choose what it's attending to so that's
why uh we have a set of new like uh
weights that is actually choosing it and
we're not just having an index that it's
choosing the uh height uh like the
hidden state that we want
now this was having an increased
performance on that uh but after that
Google has released a paper called
attention is all you need so basically
it's going to take in the attention and
throw away the RNN so here you can see
the input and it in it's it's going to
be fit forward to a multi head attention
without the RNN now losing the RNN here
means that we lose we lost the ability
for it to uh run on varying sizes and
this is not a big issue since the
Transformer model takes in a minimum of
512 tokens and the new one stakes in
thousands and thousands of tokens so in
most use cases you won't be able to
surpass that and this is going to be
more than enough for you but the
accuracy gain here is a lot and and it's
worth having this
tradeoff but what if we want to have a
number of input that is less than 52 or
the maximum number that the Transformer
can have um we just have a padding token
so look at this example my dog is cute
and then the rest of the input is just a
padding token a padding token is just
tells the model to ignore this uh output
and to ignore this in the train meing so
that it doesn't get confused you can see
that we have also something called a CLS
token and this is just called the start
token so this uh indicates the start of
a sentence and we also have a separator
token which indicates the end of a
sentence now how is this model trained
how does it know language and how does
it actually understand the different
fields that it can answer to so if you
ask chat GPT about anything it's going
to have an answer about it so what we do
is that we have something called
semi-supervised learning where we give
it just any text any text from the
internet and we randomly mask 15% of the
tokens so this is an example right
here that is a
sentence the original one is have let's
stick to this improvisation in this kit
and it masked the word improvisation so
right now as input the model doesn't see
it and then we ask the model to uh
output the word improvisation so that
now it can understand language and you
can also think about it as also
understanding different concepts so
let's take an example from a biology
class for example and this sentence is
called the heart pumps blood to the body
and let's say the mask has uh like is on
the heart so the then mask pumps blood
to the body then the neural network must
understand that the heart must like
needs to pump blood to the body so it
now has a
biology uh information in it so by this
it can gather a lot of a lot of data it
can understand it it can store it and it
can understand a lot of um language as
well now the last thing that I want to
show you is that the Transformers
enabled us to actually reuse it so big
companies use a lot of data with
millions and millions of RADS and spend
a lot of money training those models
with big
gpus and then we can reuse those uh
models for our use case and then uh
train it to have classification and
things like that so if you want to know
how classification is like uh is done
using Transformers we usually take a
trained Transformer and then find unit
which is basically training an already
trained model on a specific task and
then we can input this uh sentence you
can imagine it as having as the sentence
that we have for the comment so you can
enter the comments right here then we
take the output of the CLS token to so
the output of the star token we can put
it right here and you can feed forward
it to a neural network normally which is
the one that we have right
here that we have right here uh so we
take the output of the CLS token we
output it right here and the neural
network is going to learn through
backward propagation
normally so this is what neural networks
are and what NLP is and I already also
told you how the big models like CH GPT
and llama are made what is the
underlying neural network that it uses
so this is a lot of good information for
you in the interviews and it's also
going to help you also understand what
you're coding and I think we can start
on by coding up our theme
classifier so now we can move forward to
our first module which is theme
classification so you're going to input
some themes that is comma separated like
friendship hope sacrifice battle
self-development whatever you want here
uh but make sure that that they are
comma
separated and then it will tell you how
much of each theme is occurring in this
uh in this anime using the subtitles so
this is the uh first module that we are
going to make and and for this module we
are going to use something called zero
shot
classification now for the normal
classification we knew that a neural
network needs to have a defined set of
classes in order for it to classify
output but you can see here in the zero
shot classifier we can input any
arbitrary number of classes and anything
that we want so and anything like we
want so uh my my themes doesn't need to
be your themes doesn't need to be anyone
else's themes so in order for us to do
that we need to to do something called
zero shot
classifiers now this is a special type
of classification that is called zero
shot
classifiers and in the zero shot
classifiers we take in two inputs the
premise which is the uh the text like I
love this product this is an example the
hypothesis which is the class that is
going to be positive feedback so we are
classifying whether this is a positive
feedback or not and the output is going
to be three distinct classes which is
entailment uh and contradiction so this
contradicts the class entailment that
this is actually the class and neutral
that this is something in
between so the neural network at the end
is outputting three classes but we were
smart enough to put the class in the
input so that we can have as much
classes as we want now this is the zero
shot classifiers and we are going to use
something called hugging face uh which
is a library uh that have a lot of
Transformer models that we can use and
utilize to uh do a lot of NLP and uh llm
tasks so we can go back again to our
codebase and create a new folder let's
call this theme
classifier and inside of the them team
classifier I am going to create a
notebook class a notebook file so that
you can uh follow along and you can
understand what's happening and then we
can move this code to the py file so
that we can have it in a structured
format so let's create a new file let's
call it
theme
classification
development
ipmb uh then you can run and it will
tell you to choose a python environment
just choose the one that you
want and then uh we need to install
Transformers so for that we can create a
new file that will have all our
requirements so that we can have a
requirements in one place so you can
have
requirements.txt
and we can go ahead and run and write
transform
forers and equal equal
0.433 and this is the exact version
sorry about that it's 4.
44.0 this is the exact version that I'm
using and you can go back again to your
Google and write pip
install
Transformers so you can understand that
you need to copy this and put it right
here if you didn't write it and you can
write whatever version that you like
this is the version that I used so that
you can replicate the results that I'm
having I am also having something called
hugging face Hub and this allows you to
push um to push uh things uh to push
models to the internet to the hogging
face and you can download it and the
exact version that I'm using is
0.245 and in order for you to install
the requirements just pip
install dasr then write requirements.txt
like
this um so I'm going to stop it I
already have those so yeah you can go
back again here and you can install the
hugging face and you can import it by
having from Transformers import pipeline
now Transformers is the name of the
hugging face library that I was telling
you about and yeah we are also going to
use nltk which is another NLP Library so
you can install it by writing
nltk and equal equal
3.8.1 and yeah don't forget to pip
install your- R requirements like this
so that you can install the nltk library
as well
and you can come here and you can also
import it so from nltk import and what
we want to import is a sentence
tokenizer to tokenize to like separate
sentences uh separate text into multiple
sentences
and yeah the we also have uh we also
want to install uh a library in nltk so
nltk to got download and download
punct uh make sure to import it first so
import
nltk and make sure to download
it now let's first in like load the
model load the theme classifier model
and tell you how it works so we can
write a section called load
model and then we can go to hugging face
so you can go to hugging face right here
um and you can find a lot of models on
the hugging face
Hub like this and those are all models
like here so you have models in computer
vision you have models in natural
language you have models in audio and
what we are going to do is that we are
wanting to have a model in zero shot
classification it's also known as uh
neural natural inference and uh so you
can have
Facebook
SLB
large and
mnli so yeah so this is the model that
we are going to use uh it's from
Facebook it's called Bart so just like
ber that I showed you before b is
another Transformers model um large we
have large medium and uh and small and
large has the highest accuracy but of
course it consumes the largest amount of
ram um and the
mnli which is a Multi natural language
inference model uh just another name for
zero shot
classification so you can go back here
and write model name equal and paste in
the Facebook part you can just copy it
from here and and paste
it uh then we can uh set the device
whether we are using a GPU or a CPU I
don't have a a GPU on this machine so
I'm using a
GPU and I am using a torch so basically
torch can be like it will be installed
with Transformers so you can just import
it so import
torch and say zero if torch. Cuda is
available else then I am going to put
CPU so it will choose the zero with uh
GPU which is GPU number one and else I
am going to use a CPU and like I said I
am using a CPU right here so you're
going to find that the CPU device is
been
set uh now let's create a function to
load the model so it's Define load model
give it a device which is the device
that we want
and then we can have
theme
classifier equal
to uh pipeline which is the Transformers
pipeline right
there give it the uh task that you want
to have which is zero shot
classification then give it the model
name like that then give it the
device and just return the theme
classifier now note that I am like
reading the model name from a global
variable uh because I am going to have
this into a class so I'm going to refer
it to self do something like this so I'm
just leaving it like this but it is not
uh like a good guidelines to have it
read from a a global u a global variable
like
this uh we can then call this class so
have
theme classifier equal load model wait a
little bit for it to install the model
and uh put it into memory and then we
can have a theme uh list whatever list
we want like the themes that we want to
classify uh we can have it here uh you
can go back again to
your um visualization and
GUI and you can go here and paste them
so make sure to have
them in a list of
strings I am just uh making
it with codes like that and this is the
list of themes that we are going to have
and in order for me to classify anything
uh with the zero shot classifier you can
just call it like this so theme
classification then write the text that
you want to classify so um I gave
him a right hook um then a left job this
is
basically like a fight scene uh like a
fight uh text so I want it to have like
a battle uh theme so you can also give
it the theme list like this and you can
say that it is able to have multi-
labels so it can be battle at the same
time it can be self-development and
things like that so you can run
it and you can see the output right here
so it has the label of battle with 0.9%
confidence and the maximum confidence is
one and you can see that it has also
self-development and more uh so on and
so forth
so this is the output that we have now
the next step in our exploration would
be loading the data so just write load
data set like this and we are going to
be loading the subtitles data set which
is this one so this has multiple uh
files and folders actually only files so
just write from glob import glob and
glob helps us to get all the file path
that we
want so just write files equal glob and
inside of glob uh go back uh one folder
write data which is this
one uh this data then then have the
subtitles
folder like that
here then say that we want to get all
the files that we want using the store
that end with ass because the subtitles
end with asss so that is what we
want and just run it and maybe just show
the first uh five so you can find that
those are the files that we want right
here and we're going to Loop over them
one by one and open them and get uh the
data that we want so
with
open files of zero let's open the first
one and this is opening a file and then
we can read the lines of this by files.
read
lines and let's open the subtitles again
together so we have a couple of meta
data at the at the at the top till uh
line 27 so what we want to do is that we
want to remove all this and keep
everything underneath line
27 so we can have this by writing lines
lines of uh 27 so start from 27 till the
end um and
then we can see here that every line
after this is comma having has multiple
commas so it begins with the format then
it has the start comma then start comma
then end comma then style and but the
end of at the end of the day we just
want the text and know that the text
might have a comma
also so what we will do is that we will
split by uh the comma and remove
everything that is uh before the uh this
comma basically
and this is the ninth uh this is the
ninth comma so one uh 2 3 4 5 6 7 8 and
N9 so till the nine comma we will remove
everything that is before that so let's
do that here so I am going to do a on
line for Loop and if that confuses you
feel free to separate it out but you can
write four like this
for line in
lines and now in this line you can just
TR line dot split with the comma then we
want to remove the first nine commas and
then take everything
afterwards and after this we just want
to join it again using a comma um so
this is going to return uh list um of
sentences um and after this we are going
to combine this list of sentences with a
uh comma like
that so you can run
this yeah I forgot to write dot join
like that you we need to have it do
join and yeah you can have l
L of for example the first
two and those are the first two lines
that we have a long time ago then the
comma right here a power for demon then
this this is the second line so on and
so
forth you can see we have a weird SL sln
in this place so we can um clean this by
removing it so lines equal
for line in lines and then line.
replace we are going to replace this SL
sln like
this with a
space and let's display again the first
two and you can see that SL sln is now
removed now we can combine different
sentences together into one big
paragraph so let's do that so we can
write like let's join them with a space
so join lines of the first 10 and it
will be joined together in one sentence
this list will be joined again in one
sentence and it is separated by a
space now this is the text that we are
going to feed forward to the neural
network to the uh theme classifier and
since the theme classifier has a maximum
of 512 tokens we cannot feed forward the
whole subtitles so we need to divide
them into batches of 10 or 20 or
whatever so that it just can fit into
the model and then we can run it one by
one now what we also want is we want to
uh also extract the uh episode number so
we can do that by getting it from the
file name or file path so
files of zero this is it and we can just
get uh the last uh bit which is uh
split and we are going to split by this
so that we can get everything that is
afterwards so split
by that and do a negative one so that we
can get the last one
then we want to split by the dot to
remove the ass so
split by dot then take the zero with
element and then we have the
01 uh we can then strip
it to remove the uh beginning space or
any even triling
spaces and at the end of the day we can
just
cast it to an integer so that it can be
an
INT now this is uh now this is how we
can get the episode version like episode
number uh and and let's put all this
logic into one big uh function so that
we can copy paste it
easily so right here let's create a
function called Define
load subtitles
data
set we give it a data set
path then we get uh we run the globe on
it
so we call this
subtitles
path and then for path in subtitles path
like that
uh then we want to uh after we want to
after we do this we have the subtitles
path we want to read it like this and
then um get the lines and then clean
them so let's copy paste the
reading so
read uh lines
and instead of file zero we can just add
the path right
here and then uh this way we read the
lines now we can clean them by removing
the SL
sln like
this and then we can put the whole
script into one big text by joining it
so join lines
um now this is the script we read in it
success like we read it in successfully
then we can just get the episode
number we can go here copy
this paste it right in make sure to
write the path inside the file
zero then we want to put this into a
list and also put the episode number
into a list so
scripts like this and then
episode num which is also a list so
scripts right here do append
script then we have the episode number
do append
episode and this is the red data set uh
the last thing that we are going to do
is that we are going to put this into a
pandage data frame
uh pandas data frame is just a way to um
like um display and deal with different
types of structured tabular data so you
can read it in by having
import pandas aspd if you don't have it
you can just uh pip install it uh any
version will do here so we don't need a
specific
version and to put those data sets into
a uh like a table data you can have PD
dot data frame then uh tell it
from
dictionary then create the dictionary
that have the like the column name as
the key so
episode this is the column name then
what values we want to have it inside
which is the episode number this is the
list of episode numbers that we have
then we want to have another column that
is called
Script that is going to have
scripts let's put it into a variable
called DF and let's return this variable
right
here so let's uh try it out so data set
path equal to backpack
data
subtitles slash
D store
ass uh this is going to be the data set
path uh we don't need the uh SL as we
are going to write it at the
top
uh so yeah we are we are not using the
data set path right here so make sure to
use it so just uh delete this right
there add this
here and this is the data set path
so you can just run this and here WR DF
equ will
load load subtitles data set give it the
data set path and then hope that it
won't uh have any errors yeah so this is
the header uh header is just displaying
the first five rows of this tabary data
so we have episode 1 2 3 and then have
the scripts um so at the at the
beginning at the beginning of each
episode starting from episode two it has
a similar start but note that those are
like different uh different episode with
different text if you looked into
it now before closing this notebook I
want to show you how you can run things
on uh Panda's data frame uh so let's run
model
and just write script like this which is
equal to DF do iock ilock is a way to
get um a row number so you can write
iock of
zero then tell it to I want to have the
script column like
that so let's display the script and
you're going to see that it is a lot
long text so we can divide the script
into multiple sentences so that it can
fit into the
NLP um token maximum so we can have
script
sentences equal to send tokenize which
we imported from
nltk and this is going to divide the
script into sentences so let's display
the first three
sentences it is a column like this and
now you can see that it is now divided
again back into
sentences so we can put the sentences
into batches of 20 so batch
sentences and
sentence batch size is equal to 20
so for index in
range zero till length of script
sentences like
this uh and we want to run these
sentence batches so this Loop is going
to start from zero till the length of
the script sentences and it's going to
increment by 20 so it's going to be 0 20
40 so on and so forth it's not going to
be 0 1 1 2 3
4 so sent which is the sentence is equal
to uh going to be the whole 20 uh
sentences batched together into one big
uh
sentence so it's going to be script
sentences of index till index plus
sentence
batch sentence batch size
and you can then uh run it and uh get
the output of it but let's yeah let's
break this so we can just run on one and
see the sentence output so this is the
20 sentences batched together into one
big sentence uh you can remove
this and let's put the those uh new
batch sentences into um a script batches
script batches list that just appends
the sentence right
here like
this and let's display the first two in
the
list so this is the first 20 sentences
and this is the second 20
sentences now in order for us to run it
through the model we can have the theme
output equal theme classifier like we
did before gave it these script batches
theme list and multi-labels but what's
new is that we can actually run it on
multiple uh inputs at one time by giving
it a list so let's have this and see the
output uh it's going to take a while
because it's running on two samples
right
now and here it is so this is the first
this is the first um classification of
the first batch and this is the
classification of the second
batch now before proceeding we can just
triangle this data set so that we can
have for example a battle like this or
like betrayal or anything like that we
can have it like battle and then a list
of a list of scores uh one by one so
that we can just easily put it into a
structured uh table or data set and we
can do whatever we want it whatever we
want from it there so let's
strangle uh output again what we want to
have it is that we want to have for
example
battle and we want to have its input as
this is the score for the first batch
this is the score for the second batch
and so on and so forth uh that is what
we want so let's have
for output
in
theme
output like that then what we are going
to do is that we are going to Loop over
the labels and the scores together uh at
the same time so for
label score in zip and this is how we
Loop over two lists at the same time so
output uh of labels and output of
scores and then
if label not in
themes um and themes here is going to be
a dictionary
this is the output dictionary that we
want so if label is not in themes then
we have the theme. label is equal to a
list otherwise and afterwards we are
going to append the score so let's run
this and let's display the themes right
now and see how it
goes so this is dialogue then it has the
score for the first batch then it has
the score for the second batch and so on
and so forth
worth and yeah this is uh we are almost
done with this so before just proceeding
let's put this into one big function
then try and call it into pandas and
yeah we will be done with this so
Define a function called get
themes
inference put a script as input
like
that uh then let's first batch the
script into sentences like we did before
so what we do is that we sentence
tokenize then we batch the sentences
together so let's sentence tokenize it
first like that then we batch
it then we batch the sentences into uh
20 sentence
increments uh then we want to run
model and the way that we run the model
is also up here so you can just copy
it paste it right here uh note that we
will not we will need to remove this uh
tool so we will need to remove uh this
because it Transit on the only uh two uh
two samples but I going to leave it for
now because I'm going to um like run it
locally uh then we are going to Wrangle
the
output and we also have the code for
wrangling the output right here so you
can just copy
it paste it right here
like
that note that every theme right here
has more than one score so let's just
get the mean of the score we can get the
mean by importing a library called numpy
This is a matrix multiplication Library
it is usually installed with pandas so
you don't need to have a separate pip
install for
it then what we want to do is that we
want to Loop over each theme so four
theme in themes like
this uh then we want
to make this into a NP
array then we want to have the mean of
it and have this as
themes so let's run this uh it has an
error
so the mean here is not mean but
actually
NP do mean like
that so yeah so this is not uh this is
not an array this is a dictionary so
just write do items right here make sure
you are looping over the key and the
value the output is also going to be a
dictionary where the key is the same
name key but the value is going to be
the mean of the uh of the array so like
that now with TR I can show you the
output so it's going to be dialogue and
then just one number which is the mean
of the uh previous themes that we uh
have so you can just copy this go back
down
here paste it right in in then return
themes like
that you can just run it and now uh we
want to run it into uh the mo like the
data frame so you can just have DF equal
DF do head and this will take the first
uh two rows only now I have a CPU so I
won't have a full run on that because
it's going to take a lot of time but we
are going to move this codee to Google
collab and there we can run it uh on the
whole data set if we
want so you can display the DF you can
see that it only has two rows right now
and we want to run this function above
on the script on every row on the script
column for every row so uh for us to do
that we can have the
output themes
and we also have a very convenient way
to run a function on all the rows for a
specific column that is called
apply and we can just give it the
function name which is get theme
inference and let it run for a
while then let's also have it right here
and this is the output so the first uh
row is going to have the dialogue and
then uh the score for each theme like
this like a dictionary where the uh
where each uh where the key is going to
be the theme and the output is going to
be the theme score the mean theme
score and we can also change this into a
structure data set uh column data set so
what we can do is that we can just have
the PD data
frame then give it output themes. two
list and then it will be uh a table like
that so let's call this
theme
DF like that
and yeah let's see it so this is going
to be the score for each row that we
have in our data frame right here so the
first row is going to be this row and
the second row is going to be this row
and before we do anything the last thing
that we do any in this is that we are
going to combine those two together and
we can have this by writing DF Dot
theme DF
dot columns so it's saying add those
column names here and what are we going
to add we are going to add the theme DF
in those column names and let's display
this uh let's display it right now so
you have the episode script and then you
have the themes that we want to
classify so this is the theme classifier
or
overall and this is how it works it's
pretty simple it uses the hugging face
library and as you can see it just uses
the uh theme classifier from the hugging
face we give it the input we give it the
theme list and we give it the
multi-label is equal to true and it
outputs it so what we're doing is just
is just we're wrangling the data set so
that it's a format that we can use
easily and yeah so let's try and make
this code a little bit cleaner for us so
let's create a new folder called
utils inside utils let's create a new
folder that is called Data
loader
py and inside this data loader we just
want to have the function that loaded
the data for us because we're going to
use it into the um Neer and the uh
character Network project so we don't
have to write it again so you can just
copy this function that we wrote before
that is called load
subtitles then you can go back here and
you can import the missing inputs which
is globe and basically the pandas so
from Globe import Globe then import
pandas
pandas
aspd and this is the load subtitles data
set has been put into the utils folder
and in order to expose it we create a
fold file called uh like underscore
uncore
init in it then uncore uncore
dopy then say
from dot data loader
import what we want to import is this
function so this is how we exposed this
function outside of the utils folder so
yeah we can just close it right here go
back to the theme classifier and then
write uh a new file that is called
theme classifier
py now the theme classifier py will have
the class that is called class theme
classifier we are going to have an init
function that is called when the class
is being initialized it takes in self
and it also takes in the theme list that
we want to
have like this let's pass it for
now and it also has the function that is
called Define load model and if you
remember that we also have the load
model in the ipnb file and let's do it
step by step let's do the init first so
self
model name and we specify the model name
to be Facebook uh B this one so just
copy it paste it right here
then self.
device and we also had a little bit of
logic for those here so it chooses a CPU
or a GPU depending on what's available
so we don't need to hardcode it so
import torch like
that and then we want to specify the
theme theme list so
theme list is equal to theme
list um and then we want to uh load the
model so
self.
theme
classifier equal to self. load model and
give it the
device and we also wrote those function
this function so you can go here just
paste it right in add the
self make sure that it has the correct
indentation then for the model name
right self do model name then for the
pipeline right here we imported it from
Transformer so you can write from
Transformers import Pipeline and this is
how we load the uh theme
classifier now we also have a function
that is called uh get theme inference so
let's copy it also and paste it right
here I'm scrolling through to find
it so yeah you can just copy it when you
find it right here and then paste it
right
in you will need to also adjust the
indentation add the
self and then uh make sure to add the
missing requirements which is from nltk
do tokenize import sentence
tokenize uh there is also theme
classifier so we can just refer it from
the theme uh classifier self then add
the self. team list go back again you
can find that the model needs like this
function needs npy so go back again
import numpy as NP and where we at it
import
pandas as PD because we're going to need
those so if you remember this batches
the data runs the model and then
wrangles the
output now the last thing that we are
going to do is that we are going to have
a function called get
themes that runs this get themes
inference on in the whole uh Panda's
data frame uh which is the whole data
set so right
self it takes in a data
set path to read the subtitles from and
it also takes something called a safe
path that has a none and I am going to
after finishing processing everything I
am going to add uh to save this uh
processing into a safe path so that I
can have some sort of a stub where or a
checkpoint where I don't need to run
this whole model again to find the
output I just can read it from this stop
so let's uh load the
model so it's DF equals uh then we want
to use the load subtitles that is in the
utils so if you scroll back again up we
want to uh import it here so we can
import first import OS
like this then
import
system then
import path lib and all this is because
I want to go back one file and import
something from here so what we want to
do is we want to get the folder path
first that the the current folder that
we are in so write path
lib dot path then give it the underscore
uncore file give it the uh parent and
then write
resolve this is the folder path and
let's append this folder path to our uh
to our system so system. path. append uh
then write folder path and then go back
One Directory so that we can refer to
the
utils and right from
import load
subtitles data set like
that and if you go back again here you
can
write load subtitles data set give it
the data set path and right now we're
going to have the pandas data frame now
we want to run run the
inference like this and like we did
before we are going to use the apply
function so Panda so output
themes like this is equal to DF of
script then do apply then give it the
self. get themes
inference afterwards we want to Wrangle
the output to add it into the same
Panda's uh data frame so if you remember
here we also merged it together into one
big data frame uh like this uh right
like here so that is what we're going to
do so
themes DF equal pandas data frame output
themes. two list then
DF of themes DF do
columns is equal to themes the F then
what we want to do at the end is we want
to save the output as as Tob so if save
path is not none we can save it as a CSV
file which is a format for tabary data
so DF do CSV save path and index is
equal to false
false now before closing this we also
want wanted to install a couple of uh
libraries nltk libraries like this nltk
punct and in this actually you just
needed to have it one time you just
needed to install it one time so um we
are going to install it here also so
nltk Punk download and let's also have
the punk
tab now one thing to add here is that
this is was C to an Str Str it is
actually an Str Str but we uh instead of
having the plus and this is going to be
problem mating because if we have
slash uh if we don't have a slash it's
going to bug because it needs to have
the folder PR slash then whatever we
want and if we have a slash and then add
a slash here it's also going to have
double slashes so it's also going to
crash so the best way to do it is have
the os. paath do join
then give it the path like this and give
it the what you want to join and it
would uh add it quite easily so the
utils here have a squiggly line which
basically means that it is not detected
uh it might be just the vs Studio thing
or it might be an error so we'll figure
it out when we run it and let's now
create uh the uh GUI that is going to
run this so for the GUI we are going to
use Library called
gradio so
gradio
app.py and you can have a function that
is the main function then write print
hello world make every make sure that
everything is working fine write
if M
if name is equal equal to main we can
run the main function so you can run
this and you can find the hello world
right
here uh so let me on board you on grade
you quite quickly so right here the
grade you app is a very simple um a
simple way to create machine learning
applications and web guis you can see
that it can input images it can input
audio it can input a lot of stuff and we
are also going to use this for our uh
for our uh
uh project so go back again to the
requirements to add the gr application
so go here write
gradio then write equal equal
4.36 point1 this is the exact version
that I'm using so you can close it again
and you can go back to the your gradio
app and you can start writing the uh GUI
and how it looks so let's import gradio
first so
import gradio as gr then here right with
gr do
blocks as I
face and this initiates uh gr uh blocks
and and we are going to uh structure it
with rows and columns so let's first
create a row let's here tell you what
I'm going to do
I am going to create a row with this and
I am going to add the theme
classification which is going to be just
um an H1 HTML tag then I'm going to add
a column with this output then I'm going
to add a column with this input so let's
first add this uh
gr dot
row like that then I am going to add a
gr. column like this
and go gr.
HTML
HTML like that and
write H1 write some normal HTML which is
going to be uh
theme
classification
zero uh short
classifiers and this is going to be the
HTML that is at the top right here like
we're
seeing and then we are going to create a
new row so gr do row and we are going to
start by the output uh plot so we are
just going to write it plot gr dot uh of
bar plot it's not going to be a plot bar
plot
and then we can move
this uh we can also have um like this is
the uh this is this is in uh column so
gr.
column like
that and this is the output Place let's
also add the input place and the input
has three different uh inputs so it's
going to have the theme which is also
just a string a subtitles or a script
path that's the uh that's the folder
with the subtitles which is this
one and the last bit is going to be uh
the save path that we want to save the
model in so uh save the output in so
let's start by having the
theme list is equal to
gr. text box give it a label
that is called label like this that is
called
themes then let's do the same thing for
the
subtitles and let's also add the gr of
textbox like
that and let's give it also a label that
is
called sub
titles
or
script
path now the last bit is going to be the
save path so
save path which is equal to also gr.
text and you can write also save path in
the
label now if you see here we have also a
button so let's add this button that is
called get themes
and you can write this button as get
teams
button which is equal to gr do
button of uh
get
themes now uh now this here uh is
runnable so let's run this and see how
it looks so um before running it we just
want to call the uh interface and uh
launch it basically so we can have iFace
do launch where share is equal to
true now let's save this clear the
output and then run
it so here's the output URL you can just
copy it go here
paste
it you can wait for a while for it to
load but you can see here that here's
the plot here's the three different
outputs that we have and here's the uh
button and I think the output should be
in a in a in in its column so I think
there is an error or an issue with the
columns and rows so let me check it and
come back to you real
quick so right here I did a small
mistake where I uh did not indent this
into the column of the theme
classification so all you have to do is
that you can just tab it right in and
close this clear it and then run it
again you can go back to your uh Local
Host and then refresh it and you can see
that the plot here is in the correct
place um now the uh idea here is that
this button does not do anything we want
it to train and actually uh get us the
output and put it into the plot now
before we
continue uh we save the output here and
if we want to also have the output to be
readed so we
read uh saved
output if exists so if it exists I can
just read this in and not run it again
saving it a little bit of saving me a
little bit of time so save path
is so if the safe path is not none and
os. path. exist so this path actually
exists I am just going to read it in and
I am going to return it so yeah so that
is it you can uh come to your terminal
press contrl C to close the current run
clear it and then go back again to your
gradio app and then we want to specify
what this button does does when it is
being clicked so you can go here get get
themes dot click write
get
themes like this where the inputs are
going to be the theme list
the subtitles
path like this and the safe path like
that and the outputs are going to be uh
the plot so the outputs is going to be
just the plot now this function is not
defined yet so let's go and Define it so
Define get themes where the input is the
theme list the subtitles list and then
the substit path and then the save path
so the first thing that we are going to
do here is we are going to get the
theme
list uh currently it's comma separated
so this is the theme list St Str it's a
it's a string we can split
it like that with comma and this is
going to be the theme list uh let's also
initialize the theme classifier so theme
classifier and let's initialize the
theme
classifier and in order for us to expose
it outside of this folder you can create
a new uh file called init
doore
py then
from like here dot theme classifier
import theme classifier make sure that
we are spelling everything correctly so
you can come here save it and then you
can go here in the gradio and make sure
you have the correct spelling and we
write from theme classifier import theme
classifier like that so after this uh
let's go back again to the uh notebook
and let me show you how we are going to
visualize it so we can go here and write
visualize
output you can see here that for every
uh theme we have a number like this a
numbers like this and uh I am adding
also something called a dialogue theme
and this is just normal conversation
between any two because not every words
are going to be classified into those
themes some of them are just just normal
conversations and I need to put a like a
class where I can classify this so that
I can drop this if I
want so in the visualized
output um I can just uh first of all I
can drop the dialogue so I can have this
so
drop
dialogue let
me uh copy paste it where AIS is equal
to one and this removes the dialog
column so you can have it like this and
then we have one number per episode uh
per uh theme and what we want is that we
can uh just uh get the mean of those uh
for all the episodes together so that we
can uh understand it or we can just sum
it up so uh let's
drop the
uh
episode and the script we don't need
them here
anymore where
axis is equal to
one then we want to sum up uh the others
uh the other columns uh Al together so
let's see how it looks so this is the
summation of all the teams together and
if we want to have it again back into
the uh data frame which is a table you
just write reset index like that and you
can see that it's now a table but it has
some weird columns so we can just rename
the columns together so just write uh
theme
output and write tee output do
columns which is equal to theme and
score and then uh display the theme
output and there we go this is the
output um like output table that we want
um afterwards we want to convert this
into a visualization so in order to
convert it uh to a a beautiful
visualization we need to import two
libraries which is
importing Matt plot
lib. pip plot as PLT and make sure to
pip install it and also uh pip install C
as SNS and cbor just makes uh the plot
from M plot lib a little bit neater and
uh visually appealing so we are going to
use this and yeah make sure to have the
mat
plot lip spelled correctly and
yeah so in order for us to so let's
visualize it right now so
SNS do
barplot we can give it the
data which is going to be theme
output uh
then there's an extra P right here so
make sure to remove it uh then I have
the
X which is equal to X theme this is the
x axis that is going to be the SE theme
while the y axis is going to be the
score uh then we are going to have the
PLT Dosh show to show the plot so that's
the plot here right now it shows you
that batter is the most sacrifice is the
second most so on and so forth and note
that they are overlapping a little bit
so in order for us to deal with this
overlap you can just have the PLT X
sticks which is those rot rotate them by
45° and this is going to be how it looks
right now a lot neater and we are going
to copy paste this code uh into the into
the gradio uh get themes so that we can
have it right here so here we want to
just run the model after we initialized
it so let's have the output DF which is
equal to the theme classifier to get
themes and then uh we want to remove the
dialogue if we have it so remove dial
dialogue uh from the theme list and then
we can have it like that um let's have
it theme list like this uh where we Loop
over each theme list and if the theme is
is equal to dialogue we do not take it
but we take everything else and then we
have the output DF takes in uh all the
theme list right now and we assign it
again to the output DF so that is how we
choose the theme
columns now like we did in the ipnb we
want to Summit or get the mean or
whatever so let's do that so let's have
it like here so output
uh DF is is equal to going to be the
output DF of uh theme list which is uh
like that
one then we write do sum and then we
reset the
index and after resetting the index we
knew that we had a couple of weird uh
columns so we can write it as uh
this uh and at the end of the day we
want to visualize it but we will not be
using M plot PL or caborn we will be
using gradio so output chart is equal to
the gr dot bar plot gr is gr View and
then you give it the output
DF then you give it the x x uh which is
going to be the
theme then you give it the Y which is
going to be the score
then you give it the title which is
going to be
series
themes then you give it that tool tip
which is going to be uh the theme and
the
score and then uh we want it to have it
vertical like this if we want it to have
it vertical like this and not horizontal
then we specify that vertical is equal
to
false um so we yeah so we want it to
have it sorry uh this is horizontal so
we want it to have it vertical so we
specify vertical uh is equal to false
and we can specify width which is going
to be 500 pixels and a height which is
going to be uh just 260
pixels and let's return back the chart
like this and we can run it locally
first when we run it locally we just
want it to run it on two or three
samples because I don't have a uh GPU so
you can have this DF equal DF do head2
and this just runs on the first uh two
rows and if you remember we have the
script batches we run on only uh two of
them so make sure after this run we uh
remove it and we remove this head equal
to so we can go here and just run
it so you have the link right now so you
can copy
it paste it right
here then you have the themes that you
want to choose and the themes that you
want to choose is here so you can just
copy paste them you can also enter a
subtitle script path so so the subtitles
uh script path is going to be this one
so we can copy path and just paste it
right
in and uh we also want to have an output
path so let's also mention that the
output path is going to be
stubs and this is going to be the uh
path of the output so let's also paste
it right in and we can call it here
theme classifier
output.
CSV and let's run
it we're going to make sure that it
trans first and then we can save it and
then go and run it on
collab so we got an error and looking at
the error I think that we made a small
mistake in the theme classifier we did
not return the uh DF at the end so make
sure to return it so return DF here you
can find that the theme Here is
uppercase and this is lowercase so make
sure to have the theme and the score
both in uppercase so you can close it
right here clear it run it and we can
then
um yeah open this up again and run the
model and there you go this is the
distribution of the series but don't
forget we only run it on the first two
so we can go back again to the themes
right here remove this de
head and we also remove this um uh two
right here which is the first two
elements of the list and then we can
save it now in order for us to run it on
collab we will need to put it on GitHub
so that we can easily uh get to push the
code there and we can pull it there so
you can just close it using contrl C
click it and then go to your GitHub
right
here and you can create a new repository
so press on the plus press on create new
repository so first we're going to write
our repository name I'm going to write
it analyze series with
NLP and I am going to also add a
description and this can be an optional
description I I'm going to write this R
who builds an NLP system that analyzes
DV series with NLP and even create a
character chatbot and you're going to
find a little bit uh of the description
right here then uh leave everything as
is and press create
repository uh make sure to choose an
owner so I chose mine and then write
creating
repository so it gives you the command
to actually make the repo so let's do it
right here and let's first create a dog
ignore file
to ignore a couple of files that we
don't want into our
GitHub so the first one is uh the pyc
which is pi cache we don't want any
cache in our um in our uh GitHub then I
don't want to have any cache regarding
also python notebooks so checkpoints and
I don't want to have the environment
variables that I'm going to put in
because they are going to be secret and
I don't want
them to be exposed
anywhere and afterwards I don't want to
have also pi
cach and this is just removing the whole
caching in the uh like from the
GitHub uh you can then uh close it and
then you can go here uh follow the first
uh command which is get in it this
creates a g
repository uh then we want want to add
whatever we want which is all of the
things that we want here so let's get
add
crawler so it now added the crawler we
can get add also the uh the uh theme
classifier we can get add the
utils we can get add the uh dog ignore
file
let's get added sorry about that we can
also get add the requirements we can get
add actually we can add multiple stuff
if we want like example HTML we can also
add the gradio
app.py by adding just a space and yeah
uh make sure to write get ad like this
clear it then write get status to see
which files are left and which file are
on staging you're going to find that the
data and the stubs are on the are only
the two things that are not pushed so
let's have a new file right here
STS stops folder. txt U we can remove it
uh later but uh I am going to add it
right now so get stubs and it's going to
be stubs folder. txt
and we can Commit This by adding get
commit
dasm and we can write
initial
commit then you can go back here into
the GitHub and you can see that uh we
can we after our first commit we need to
create a branch like this
one so create a branch then uh add it to
the uh remote get repository like this
one and afterwards you can just push
it so this is going to be
it and if you went back again to your uh
remote repository here and refreshed it
you're going to find that your code is
now in the uh GitHub link now let's go
to Google collab and in Google collab
right here let's go to your
uh first right here and then go to
collab notebooks if you don't have this
folder just create it and let's create a
new um Google collab folder Google
collab
file let's call it
analyze
your
favorite series
development and the first thing that we
are going to do is we are going to clone
the repo so write
clone
repo and go back again to your
repository just press on this uh code
button uh copy the link and then go back
again to your uh uh file just get clone
and then paste it and to run any
terminal command you need to put an
exclamation mark in front of it then uh
you can run it then we need to install
the requirements so you can here write
install you can install the requirements
and you can install the requirements by
um like changing directories into the
analyze series NLP uh after cloning it
you can find it by just refreshing it
right there and you can find analyze uh
series with NLP then uh you can just
write pip install D Rd
requirements let's run it so we did not
find the requirement uh the
requirements. TX the requirements. txt
uh and because it is the requirement
it's only one I think that is a spelling
mistake so you can go back here change
it to requirements then get add
requirements.txt
then you can commit it
edit and make sure to have the get
status first and this is it so you can
commit it edit
requirements folder you can get push it
and now the code is pushed so you can go
here again and the beauty of GitHub is
that you can just um you can just pull
the results so you can have get pull and
that is
it so now the the file is updated its
requirements and you can see that we
have also the requirement right here so
if you have the get status right here
you can see that the delete is not
staged so in order order to do this you
can write git RM requirement.
txt git commit DM
remove old
requirement then get
push and let's also here get
pulled so you can see that it deleted
one file you can refresh it and you can
see that the requirement is been has
been removed
and you can install the requirements by
having the uh like the command that we
Wroten before so uh run it right now but
before running it make sure that you
have the correct run time on so you can
have the change run time make sure that
it is a T4 GPU run it right there then
save
it it's going to switch machines so we
need to clone it again so clone it
remove this uh selected cell which is
the pull then uh run the
requirements.txt uh it will take a while
for it to download so while it's doing
that we can just write the code for the
run app which
is run app and what we are going to do
is we are going to
CD analyze series with python uh with
NLP then uh write uh python gradio
app.py and this is going to be uh this
is going to in like uh download the uh
this is going to run the gru
application so you can open it right
here and you can see it right there so
what's left now is that we want to
upload our data set so you can just
create a new fi
folder called
Data inside of this data create a new
folder called
subtitles then inside of this you can
just press upload then go to your
subtitles uh right uh press control a
then press open and say okay to this
because it says that after the session
is completed or closes this data set is
going to be removed which we have no
problems with so we're going to wait a
little bit for the uh data said to be
uploaded it's just going to take a
minute or
two and at the same time we are just
going to run the gr application so let's
run it
so you're going to find that we have the
public URL and we are going to use this
one while on collab and not the Local
Host one so you can go
here and you can find that the
application is running so for the themes
we are going to use the same themes that
we used before like this
one for the uh for the data we are going
to use this path so copy path just paste
it right
here and for the uh stops we are going
to use this path so you can copy the
path here and write theme
classifier output. CSV and then you uh
press on get
themes so you're going to find that it's
running right now so just make sure that
everything is working and yeah just
leave it till it finish it's going to
take a little bit of time because it's
classifying all the subtitles that we
have all like we have more than 220
episodes so it's going to classify all
that so I'm going to cut the video and
return back when it's
finished so this is the result after it
finishes and you're going to see that it
has the uh the whole themes that we
listed and it removed the dialogue uh uh
correctly and yeah this is it so so you
can go back here you can refresh the
folders and you can open up the stubs
and you're going to find the theme
output classifier and you can download
it wait a little bit for it to finish it
downloaded so you
can uh uh just close down the GPU so you
can just write manage sessions close the
GPU because you have a limited amount of
hours per day and we're going to need
them into the other modules as well so
you can terminate it close
it and then uh go back to your folder
right here go to the stops folder then
remove the old classifier that we have
like this one then go to your uh
downloads folder cut this one and paste
it into the stops folder and
yeah uh go back to your uh code right
here and you can click
the output and then we can run it
again so you can go to gradio and run it
and hopefully this time when we run it
it's going to read from the Stop and uh
not take a long time uh running
especially because we don't have a
GPU so uh just go here run it on Local
Host uh list down the themes that you
want so let's uh list them down from
this
one like that then we don't need to
provide a subtitles or a script path
anymore uh but we can we need to provide
the stops path so let's he copy path and
then open this up right here and press
on get themes and you can find that it
read them correctly and it displayed
them also correctly so that's good news
we are now done with the uh get tees
module and are ready to move on to the
character network
module so for the character network uh
we are going to use the same subtitles
data set so let me show you what I mean
so the subtitles data set is going to be
just this uh text that we saw before and
then we are going to use uh to split it
into sentences first and then for each
sentence we are going to use a named
entity recognition model to extract the
names for each sentence so like this so
for each sentence this is going to
extract the names so the names are in
Japanese so it might be confusing but
those are actually names so Kakashi
Sensei is a Name Naruto is a name so on
and so
forth and if there's no name in the
sentence it's just an empty list so this
is the output that we want to have a
list of lists where the list is uh
sentences and the list inside of it is
going to be the ne RS inside of the
sentence then we are going to uh count
the number of times that uh two or like
two characters appeared next to each
other within like 10 sentences so
Kakashi Sensei and Naruto appeared one
time Kakashi Sensei and SAS appeared two
times so we can count how many times
each two characters appeared within 10
sentences and from that we can then
convert this to a character Network like
this using py Vis and network X and this
is going to be easy for us so this is
the plan for our character Network and I
am also going to show you to show it to
you in Python notebooks and then switch
from the python notebook to a uh file so
that we can make it more organized so
before starting we can just close down
all those folders up right here all
those files and folders and we can close
those up here and then we can create a
new folder that is
called
character
Network and make sure you uh write it
correctly character
Network then uh create a new file that
is called
character Network
generator do ipynb so it's going to be a
python notebook choose the uh python
environment and then let's start with
named entity
recognitions so named entity recognition
is just a normal classification model
but instead of classifying a whole whole
sentence it classifies word by word so
each word it will classify whether this
is a named entity and which named entity
it is so for that we are going to use a
library called Spacey so you can go here
pip install
Spacey Spacey like that and uh you can
press on this and you're going to find
the PIP
install uh the PIP install command
so just copy paste this P install
command and just paste it here and run
it and it should be working fine so
afterwards you just run
import Spacey to import it then we also
want to have the sentence tokenizer from
nltk so from nltk import
sentence
import from nltk import sent tokenize
like
that and afterwards let's go to the
spaces n models so one of the models
that we are going to choose is
Spacey
en core web and trf model
so this is the spes in uh core web trf
model that is going to
get our uh NS and let's also have it in
the
Spacey so the first link here is Spacey
so this is also a hugging face model
that is pushed on hugging face but
Spacey makes it really easy for us to
use so you can just click on Ian core
web trf and you can see here that here's
the download command so you can go back
here and just run uh this command
here it's going to be faster on my side
because I already have
it
and yeah so let's load the model so load
model we can Define the model like this
load
model and we can call it like that so
NLP spacy then load then give it the
um the name of the model and this is how
we load it so
NLP NLP model is equal to load model and
this is how we load
it quite simple now let's also load the
data by the same way that we loaded it
before so load data
set and let's import OS let's import
system and let's import path lib we are
going to utilize the function that we
have in the ues so
folder path is equal to
path
lib do
path then a
parent then dot resolve
like that then we are going to CIS do
path. append then give it the
os. path. join give it the folder path
and then uh go back one uh folder then
say from
utils
import load subtitles data
set so so let's load the data set
together so let's have a
data data
set path which is equal to backpack data
then uh
subtitles like
this and let's have the DF equal load uh
data set path and let's wait so this is
going to be the data set load again this
is what we saw before so nothing new
here and uh let's have one script so
let's have just one script so
sample script is equal to uh the F of
ilock ilock is going to be the choosing
of the row of script and let's uh
display it and this is the script uh
just like we saw earlier then let's uh
convert it into sentences so
sentences which is equal to going to be
sent tokenize and give it the sample uh
script like that and see the sentences
it's going to be a lot of sentences like
that and let's choose only the sentences
between 60 to 90 so 60
290 now I choose this uh like because it
has multiple uh ner um it has multiple
ner types so I wanted to show you those
multiple ner types and I want to show
you also how we can run this uh NLP
model like n r model on the sentences so
write sentence equal do
join so we are going to join it by a DOT
so dot join and give it uh
sentences and make sure to assign the
sentences right here and let's see the
results so this is the sentences that is
divided by dots and
yeah now let's run the model so run
model let's have it as
document equal NLP model of sentence
just give it the sentence that we had
above and to see the results just try
Doc
and and you see that those are the named
entities that we have Ninja fourth nine
Leaf Ninja Academy tomorrow Naruto and
one uh we have a lot of entities here uh
but as you can see Ninja Academy is not
um
is not a name for a person tomorrow is
not a name of a person but tomorrow is
time and Ninja Academy is a place so in
order to see this we want to see the uh
label of each one so four entity in
Doc and I am going to uh like print out
the entity and then I print out the
label so this is it so for the Ninja
Academy is an organization uh as you can
see here we also have tomorrow is a date
and we also see that N9 is Cardinal
which is just a number and then we have
the Naruto which is a place uh which is
a person and as you can see here we just
want to uh specify and take only the
named entities that are persons and
ignore everything else so let's create a
function for that where we can get those
NS so
Define get NS
inference then give it the
script like that uh then write
script sentences which is sentence
tokenize then we are going to have the
ner output as an empty list and we are
going to append on it then we Loop over
each sentence and then we want to uh run
the ne model on it so each document we
are going to run each sentence through
the uh NLP model get the document and
then we will Loop over each entity in
the
entities then
if entity
dot um
label equal
equal
person then we have the
full we have the full name which is
equal to the entity. text uh and the
first
name is equal to the first word of the
uh full name so if it had multiple words
we only choose the first one uh and then
we can strip out any leading or Trading
Spaces like this and for this sentence
we want to put it into a list of n so
any RS is equal to set because I don't
want any duplicates in in one sentence
so let's have this uh add first name and
after this we want to add the
NS to the ner so this is going to be the
sentence output and we are going to put
all the sentences together into this one
giant list and then we return it so This
Is How We Do It so again if you remember
this this is going to be the output of
this
basically this is the output of the step
so let's uh run
it and let's get the DF equal DF do head
of 10 let's just have the first 10 rows
uh let's display them and let's run the
ner on the uh on those 10 rows so DF of
NE R which is NE R column we are going
to create a new column called NS and we
are going to have the script do apply
then run it on the get n's
inference and we are going to wait a
little bit because it's going to run it
on the whole 10 rows and I'll come back
to you
later so now it's done we can continue
with this so we can see the results here
and you can see that this sentence has
Naruto and then it has others as well
but we can see the full uh result set
and yeah this is it now let's convert
this to the uh to the uh thing that we
want here to this data frame that we
want and then we can convert this data
frame again back to the uh the character
Network so let's create a new section
called character Network
let's
import pandas as
PD and we also want to import import
Matt plot li. pip plot as
PLT and then we want to have two a
libraries that is Network X and pis
so you can go back again to your
requirements here and write
Pi V which is equal equal
0.3.2 and this is the P ver uh Library
make sure to pip install it and it will
install the network x with it and if it
didn't just pip install it uh using the
normal Google uh like the command that
you find in Google so you can come here
right from
from Network X import as NX so sorry
it's
uh import Network X as n x then from PI
viz. Network import Network then run
this so we are going to create a
function called generate character
Network that is going to take in this
input that we have right now and convert
it to this input and then it's going to
be easy for us to convert it to a
network so for this function let's call
it Define
generate
character
Network and put DF in as the input then
specify that the window size is going to
be 10 so if two characters appeared
within uh 10 sentences then we increment
the um counter and then then the output
list is going to be called entity
relation
ship like
this and it's going to be a list an
empty list so
for uh each uh row which is going to be
for each episode in
DF of
anys for each episode we are going to be
looping over each sentence so for
each sentence in the
row uh then we are going to start our
logic so we need to keep track of all
the previous ners that happened before
so let's define a
previous
entities in
window and let's define it as an empty
list and for here uh we are going to
have the
previous entities in window append the
list of uh sentences so basically this
appends all the um um all the entities
that is currently in the sentence and it
puts them into a
list and right now this is going to be a
list of lists so it's it's going to be
like this so it's going to be list and
the first uh the first uh sentence is
going to have Naruto then the second
sentence is going to
have
SAS then
Sakura then whatever and it's going to
have like it's going to be a list of
lists where each one is going to be a
sentence so it's going to be a 2d list
and this is it so we are adding uh right
now this uh this uh the first one and
after this we just want to have the last
uh the last 10 of those so let's have
the last 10
sentences like this and let's not do it
in a hardcoded fashion let's have minus
window which is the last 10 sentences
like
this and then we want to flatten this 2D
as um this 2D list into a 1D list so
let's have this so
flatten
Tod list
into 1 D list and to flatten this you
can run the previous entities in window
like previous entities let's call
it
flattened and this was suggested uh uh
wrong so in order for us to make it 1D
you just write some previous entities in
window and then give it an empty list
like this and this will flatten it to be
like that so it's going to
be
Naruto
SAS and
sakur like
this so this is the 2D list that we this
is the one D list that we are going to
have then we can Loop over each entity
that we have in the uh sentence so for
each entity in the sentence and we can
also Loop over each of the entities that
is in the window which is the flattened
one
entity in
window in uh previous entities flattened
so we can say that if the entity is not
equal to the entity in window it's not
the same character then we can append
entity relationship which is this one we
can append The Entity and entity window
but before we append we need to sort
them
first and why we sort them because if
the first entity is
Naruto and the second one is Sask
and we append this it's going to
be it's going to be Naruto and Sasuke
but if we have the uh if we have the
same Naruto and Sasuke but the order is
uh the order is misplaced it's going to
also have the output going to be like
this so Sasuke then
Naruto and this is not going to be a bir
directional uh like it's going to be a
one directional character Network so
this variation is going to only confuse
us so what we need to do is that we need
to take those and we need to sort them
out so that Naruto and Sasuke can be
Naruto and Sasuke based on the alphabets
but SAS and Naruto can be also Naruto
and Sask if we sorted
them so this is the reason of sorting
it's making things more
standardized and make sure that it is a
list before we continue and and yeah we
are almost done with this so right now
we have the entities uh listed as much
times as they are repeated now we just
want to count them out so we can count
them out easily using uh pandas so let's
have this so
relationship DF is equal to pd.
dataframe and then give it the uh value
column and in the value column give it
the entity
relationship and we want to also
separate this between a source column
like a source a source character and um
a Target character so let's have this as
source which is equal to um relationship
of value then we need to apply Lambda
apply then uh get the zeroth element and
this gets the element number zero which
is this one which is going to be sorted
so it's uh going to be the first element
and it's going to be the source and for
the Target like
this let's also have it value and let's
take the element number
one and to count how many times they
occurred uh we can have a group by
statement with count so relationship DF
do group
by and we can Group by source and Target
together uh then we can have the count
count how many times they appeared and
then we can reset the index so that we
don't have any weird
indices and let's uh remove the name
part
here and for the last bit we just want
to sort them out so let's sort
values based on the value column because
it's going to count them and put them
into the value column again so where
ascending is false so that we have the
uh descending in place so this uh this
sorting is going to be descending so
that the most characters that appeared
are on the top and less significant
characters are at the
bottom so yeah so this is the
relationship DF fun function and now we
can just uh call it so let's call
relationship the F get character Network
and give it the
DF so I got an error right here and
right here it it made it extend and it
should be a pen because it's a list so
you can have it right there and yeah
let's check it out so you can see that
Naruto and Sasuke appeared 117 times
Sakura and S appeared 65 times so on and
so forth and this is similar to what we
have right here so this is very close to
the character Network that we have at
the end and all what's left for us right
now is that we are going to write the
code that creates this character Network
takes in this data and creates in this
character
Network so let's uh take this again
right
here and let's sort the values out uh
again like this with ascending is equal
to false so we had already this but I'm
just uh rewriting it to uh make sure
that we have it then let's take only the
first 200 characters because otherwise
uh things are going to be very uh messy
and it's showing a lot of characters in
the network and we are not going to be
able to visualize it quite well so
limiting it to the most important
characters uh is going to help help us
have a cleaner neural network to
see then we can transform this into a
network by using the network X Library
and you can have this by having NX Dot
from
pandas Edge
list like this uh we want to give it the
relation
shdf like that we want to provide the
source which is the source column we
want to provide the target column and we
we want to provide the attribute column
um and then we want to provide an engine
create using nxg graph and uh then so we
want to change this into a PIV Network
because it's more visually appealing to
seos and network X visualizations are
mess especially if you have 200
characters to see and it's not even
interactive so let's change that to
network which is the network that we
imported from pis we can specify that
the notebook is going to be equal to
True uh with is going to be equal 100
pixels 1,000 pixels sorry about
that height
is going to be equal 700
pixels then uh I am going to also
specify a background color of uh a
blackish color uh then I'm going to
specify a font color of white uh then I
am going to specify the
CDN uh resources equal remote
then we can specify that the node degree
which is the node
uh uh the node how big the node is is
going to be from
g. degree and we can specify that this
degree is going to impact the size so
nx.
set node attribute G and give it the
node degree and then uh make it a affect
the size then net do from Network X and
give it the G then
net Dosh
show then
Naruto dot
HTML so this is going to show the
network if you're using the uh python
notebooks normally it will show up but
if you're using the vs uh vs notebook
like the one that I'm using it might not
show up right here so you can just
refresh it and you can find the naruto.
HTML has been generated so we can go
ahead and open
it just wait a little bit for it to load
and this is how it looks so you can see
that it's interactive the main character
which is Naruto is the biggest node the
second which which is SAS is is right
here we have also Sakura and how thick
the line between those is is how close
those two characters are from each other
and how often they occur with each other
and yeah this is it so you can just uh
save this uh save this python notebook
and we can go ahead and write it again
in Python files so the first thing that
we are going to do we are going to write
the the
Neer uh
named
entity
recognizer so we are going to split this
into two files one for named entity and
one for character networks and let's
have the class
named
entity
recognizer and let's remove all this and
write just pass let's give it the self
and in the self just load the model so
NLP model which is equal to self. load
model like that and we can go ahead in
the python notebook again and we have
this uh we have this function so just
copy
it paste it right here make sure to add
a self like
this and make sure to Al import
Spacey then we have the get
NS which is going to be this
function so this is the get in N
function and let's also make it take
self and make sure to add self into the
NLP model like that and right now the
sentence token is not imported so from
nltk nltk tokenize import sentence
tokenizer and at the end let's create a
function called
Define
get n RS that has the self that has the
the data
set path that has the
save path which is equal
to none
and like we did before we're going to
have a stub that is going to help us um
uh that is going to help us uh read the
output if we run it before so let's load
the data set
first and to load the data set we are
going to use the same things that we did
right here so just copy this and paste
it right
here and let's use it here so let's have
DF equal load data set and give it the
data set path then we can
run uh the
inference so DF
of n RS is equal to the DF of script.
Applied and. get n RS uh get inference
then if the save path is not none then
we can just save it as a CSV save path
and
index and if we have this if the
save path is not
none and the OS path
exists um by the way it has the an
underscore in between them like this so
what we do is we want to read it so DF
do pd. read CSV save path make sure to
import the pandas uh
Library P
pandas as
PD and since we are reading a CSV csvs
do not uh handle lists as column values
as well because right now we have a list
as a column value let me show you
to again and REM mind you about it so
this is a list as a column value so it's
going to save it as a string and we need
to uh like again like shift it back from
a string to a list and this is how we
are going to do it so we are going to
have it as any
RS and then we are going to have a
Lambda
function by the way Lambda function is
just a oneline function where X X is the
input and X is the row uh row value of
this uh of the ne and it's going to Loop
over it row by row and we are going to
use also a library called from
a import this does not need to be
installed it is in the default packages
so you can go from as import literal
eval and you can come here literal eval
and give it X and if X if
the is instance of X is an Str Str then
we are going to uh make it again into a
list and then return back the
DF so this is our named entity um this
is our named entity file and it is quite
simple and we are going to have a same
like a a similar file for the character
Network generator so let's do this
and make sure to spell it correctly so
there is an a right there so yeah just
write
class
character Network like this generate
Ator Define an
init and in the init we are not going to
do anything so let's just pass it for
now and let's uh generate the character
Network so we have this function also
ready for us so generate the character
Network just copy
it go back again here just paste
it and go go here and import pandas as
PD make sure that nothing has quiggly
lines and nothing is
broken so everything looks good right
now then let's have a function called
Define draw character Network so
Define draw
Network graph and take in the
self uh take in the relationship DF and
and you can just remove this so write
relationship to DF and let's sort the
values based on the uh number of
occurrences so we can do that easily by
doing
this so just copy go back again to your
character Network
and paste it so sort and take the first
200
values uh then we want to uh make it
into a Network like the one that we did
before like
this and we want to import the network X
and P visz so you can go up a little bit
till we have the Imports which is the
network X and PES those two go back here
import
them and the last thing that we do not
need to save it into an HTML file right
now so uh we can just get the HTML of it
so we can have it like this
HTML equal to net dot generate
HTML and uh let's clean the HTML a
little bit so that HTML dot
replace so it has single columns uh
single commas so every single comma that
it has uh we want to make it into a
double quotations uh to not break the
code and then we are going to Define an
output HTML that is going to be an
iframe that is going to have our hosted
HTML right there so let me go and get
this if frame and paste it right in so
right here so we can paste it um you can
just copy paste this and this is an
iframe that is going to display HTML
inside of it and and you can see that it
just uh has a couple of attributes and
then it paste in the HTML as it source
code the HTML for the network as it
source code and then we can just return
it back output
HTML now in here we want to expose both
outside of this uh folder so we want to
have uh init and init.py like
this then you can go here from named
entity recognizer import named entity
recognizer and from character Network
import character Network and this is how
we can uh expose them outside now we are
ready to uh have it into the gru app and
run it so you can go back here then you
can copy paste this section right here
so copy it then right here paste it
right in and uh have a small comment
that says this is the character Network
section so in the character Network
section let's call
this
character
network uh with
ners and
graphs and the output here is not going
to be a plot anymore it's going to be
some HTML so let's have it as
network uh
HTML as gr. HTM
ml like this and we can also have a
small comment up up here that is called
theme classification section then let's
have it as uh let's have the inputs uh
so let me remind you of the inputs that
we have it's going to be a subtitles
path and the n's path and that is it if
we have any so
subtitles path is equal to gr. textbox
and give it the
subtitles
or
script path like this and uh for this we
can uh uh for this one we can delete
it and this one we need to put it as n
r path and the label is going to be any
ours
save
path let's get the network so
get
network graph uh
button like
that and let's have the gr. button and
uh this is the get character Network
button so get character
Network and we want to also specify what
it does when it gets uh when it gets
called so we want to have the get
character Network function get called
that we didn't write yet and we want to
have the inputs as
the subtitles path and then the
ner path and for the outputs I want it
to have Network HTML path now this is it
so let's just comment out the click so
that we can run it and just see the uh
how it looks and there is no error in
gradio and then we can write this
function and see the functionality of it
so clear the output go here run it and
wait a little bit for it to
finish copy the uh URL go here paste
it so this is the seam classification
bit and this is going to be the
character Network bit so everything is
working fine let's go ahead and write
the get character Network
function so here let's define
get get character Network function that
takes in the subtitles and the N path
and for the ners let's import Let's uh
have the named entity
recognizer and let's import them so
from character Network import named
entity recognizer and we want to also
import the character
Network then let's run the ner model let
run the ner class so
ndf is equal to n. get n RS this is the
function that we wrote then give it the
subtitles and the N
path afterwards we want to have the uh
character Network
uh character Network generator so um
like that and we want to have the
character
Network generator like
this then let's get the let's get the
relationship DF so you just write the
character Network do generate uh
character Network U the character
Network function and let's go back and
make sure that we have the correct
spelling for it so it doesn't have the
self so make sure to add it and yeah
everything is good so just copy it go
back again to gradio and paste it right
in and this is the n path and after we
get it we want to uh just draw it so
character network. draw graph and give
it the relationship DF then return back
the
HTML now the idea is also that we are
only uh we are on a CPU machine and it's
going to take forever to run it on all
of that so let's uh def let's let's
limit this to DF equal DF do
head of 10 and we can remove it later
and let's make sure that we are not
limiting anything else I don't think
that we are and yeah so this is the only
line that we will
remove so let's uh let's stop
this contr C clear and uh save this and
make sure that in gr you also save it
and make sure that you have the button
uh this button is um not commented out
and also you can see that this get
character Network graph is not used
because I did I made here the get themes
button so just press this and make sure
to remove the get uh themes button save
it and then
run so I made a small mistake in this uh
in renaming this so you can go back here
and uh you can just uh write it
correctly which is character uh
Network like this uh generator then you
can copy it paste it right here make
sure that the init has the same file
name as the uh or original file name
just uh close it clear the output then
run it
again so it's it still has an issue uh
just make sure to rename it like copy it
make sure to paste it right in right
here uh you're going to find that it's
now colored with green so I think we're
good right now and uh run it again so go
back to gradio and run it
so go to the link that is
provided so you have the subscript path
and the aner path so let's give them
both so the uh script path is going to
be this one which is the subtitles path
so copy path of that go back here uh
where is it so yeah can go back here and
the output path is going to be in the
stops so go to the stops folder copy the
path go
here paste in the
stops and write n
output.csv
and you can just click on generate
network uh so I received an error here
and again I did the small mistake of not
returning back the output that I was
processing in the
any RS entity recognizer so make sure to
return it and go back here make sure
that you are returning back the outputs
so you can close this contrl C cleared
and run it
again you can go back here and uh you
can uh Run It Again by clicking the
button and now we have it done so look
at this again so we have Naruto we have
Sakura we have Sasuke it's interactive
we can zoom and because we only we only
run on a couple of uh on on 10 rows only
you can see a couple of um couple of
Side characters right there it should be
removed when we run it on the full data
set because uh the first 200 characters
would be very important so yeah and yeah
so now we can just commit it put it to
the
put it to GitHub and then we can run it
on collab to have a full run on that and
before that I have found like it's not a
mistake but something that annoyed me is
that I put the entity. text in full name
I did not use full name here so just
write full name right there just
annoying that I put it and did not use
this
variable so you can close it contrl C
clear then write get
status like that that uh you can see
that the requirements has been edited so
you can just so you can just get diff
you can see the difference of it so you
can find that bit has been added and
there's a new line in the gradio so you
can just add it right
there you can write git status again to
see what changed so the gradi you app of
course because we added another element
so make sure to add it and before we do
anything we have the uh head here we
want to remove it so make sure to remove
it go back again to your grade you app
make sure that we have no uh limitations
on the run so there is no limitations
right here so you can save it um and
right now we just want to add the
character Network so add the character
Network and write get
status so everything here seems to be uh
added correctly so you can just get
commit dasm and then call it
add
character
Network like that then get
push so let's go to our Google collab
again and clone it uh and make sure that
you're not a robot that's fine and then
you have the pull we don't need it right
now then you can install the
requirements and then we have another
requirement so in the Spacey and don't
forget to download it so just copy it
right here and go to the cell that is
underneath the requirements and just
paste it right
in and then we can run the gradio
app and while it's downloading the
requirements make sure to create a new
folder call it
data then create inside of it a new
folder called subtitles
then upload your
subtitles just
upload code
live like this go to your data subtitles
then choose all of them and press upload
and it will be uploading
it so we can wait a little bit for it to
finish
awesome so now it's done the uh we got
the uh URL right here and we also
uploaded the subtitles so you can go to
the URL paste it right in and we can get
the subtitles path like this so you can
uh copy the path paste it right in here
and you can go to to the NLP stops you
can just copy the path of the stops like
here and write any R output.
CSV and you can just press on the cat
character
Network so this is going to take uh a
while for it to run on the 220 episodes
so I'm just going to cut the video and
come back when it's done and make sure
that it's uh not crashing or anything
so now it's done it run on the whole
data set and you can see here that this
is a better character Network you can
see that Naruto is the main character
you can see also Sasuke is a big
character in this and you can see the
interaction between them is a lot and
yeah you can see other characters as
well and if you know the anime you can
go into the Integrity detail of each and
every uh character and it is quite
interesting for you to play around with
and yeah congratulations on that so uh
for so for for us to continue on that
you just can uh go to the stops make
sure to refresh the folders first go to
the stops then download this uh Neer
output which is the stops for the
ner it's going to take a while because
it's a a heavy uh file
and it now downloaded right here so go
to the change uh go to the manage
sessions uh like like here and make sure
to close the GPU because we have other
modules to run so close it then go here
and um go to the tubs and delete the ner
output that we had before and go to your
download get the N output then paste it
right here so this is it and we can also
run it locally so you can go to the
gradio app and then you can just run it
right
here it's going to run from the
N uh stub and not run it so that's why I
am testing it so you can go right here
and you can just get the path for the N
output which is copy path then go here
paste it you don't have to uh uh get the
subtitles anymore so you just run
it and there we go it's also working it
takes a little bit to load so yeah there
we go so Naruto SAS and everything and
everyone is here so that is it in this
section you learned a lot about what ns
are you learned how to Wrangle stuff you
learn to also how to put it into a
beautiful character Network and how you
can make connections with it so yeah so
moving on to the next section it's going
to be for the text classification
section so basically it's based on the
uh like the data set that we calleded we
are going to paste in the name and the
description of a Jutsu which is a find
fighting technique and we are going to
put either Ninjutsu genjutsu or Tai jutu
and we are also going to save this model
into our own hugging face um Hub so that
we can download it easily in other um in
other places and other servers like for
example uh gradio or like the collab
that we're using here so yeah a lot of
good stuff right here so let's get to it
so let's create a new uh let's first
like close down all this
and start on a fresh plate and let's
close down this let's create a new
folder called text
classification like that and let's
create a new file in it that is called
um Jutsu classifier development. ipnb
jutu
classifier classifier
development do
ipynb and this is going to be a notebook
to just also show you what we're going
to do and how are we going to Wrangle
the data and how we're going to use the
model uh for that so yeah let's do
this so let's have the first thing which
is load model load sorry
data data
set right here
and let's have a data
path of back back data and it's going to
be the jutus Json l so it's going to be
this
path and we are going to read it with
pandas also so DF pd. read Json and give
it the data set path uh tell it that
this is going to be uh lines equal true
and have the DF do head and before
running it make sure to import it so
import pandas
as
PD uh make sure to uh choose an
environment and this is the data set so
it's going to be a table with the Jutsu
name and the Jutsu type that we have and
the Jutsu description the first thing
that we notice is that we only want to
have Ninjutsu and genj Jutsu and Tai
Jutsu we don't want to have all of
this K Genai Ninjutsu tautu we only want
to have like either nutu either tautu or
either genjutsu so let's do a function
for that so we'll create a function that
is going to simplify those utus so
Define
simplify
jutsus and it's going to take a Jutsu
and
if there
is a
genu like this if there is genjutsu in
uh the Jutsu then we are going to return
gutsu then if we have the Ninjutsu like
that inside Jutsu we are going to return
n Jutsu and if we are having Tai Jutsu
make sure to spell it correctly return
uh tautu so this is the function that we
want to uh run on all the uh rows for
the Jutsu type and we can do that with
the with the normal pandas function that
we have the normal apply function so DF
of uh
jutu
type
simplified is equal to the jutu type do
apply and give it a simplified Jutsu uh
we can just turn it have the DF do head
on it like
this and now we have the simplified
Jutsu which is ninjutsu Ninjutsu and Tai
Jutsu uh so that's that's an easy way to
simplify the jutsus and make it into
different buckets and let's now see how
much we have for from each uh from each
type so let's have the Jutsu simplify do
value
counts it's uh values counts uh value
counts I read it uh wrote it wrongly so
we have
2,225 200 uh two 200 2,255 for Ninjutsu
300 something for tautu and 100
something for
genjutsu and this is what we call a skew
data set where one class has
significantly more samples than the
other um and this is going to add
complications for our training set but
uh at the end of the day we are going to
handle it and it's going to be in your
tool belt that you trained a model that
has a skew data set and if your model is
not skewed uh then you can just uh have
a a a better and like um have a
simplified way of training it so let's
continue with this wrangling of the data
set let's put the uh name and the
description in one column called text so
let's just have the Jutsu name plus
space and you can just add a DOT right
here and you can add uh jutu description
afterwards then you can just write the
jutu which is going to be equal to the
Jutsu simplified uh column which is this
one and then let's only take the jutu uh
text and uh jutu column like that and
let's drop any n so any uh missing
values let's drop those
rows and yeah so let's get the head of
it and this is the text and the uh class
of it now uh for because we are running
it uh because we scrap this data from
the internet
uh sometimes it has like uh HTML tags
that slipped in and um things like that
uh in our case it doesn't but uh some
cases it does have some uh HTML
tags so uh we should create a function
called cleaner and in this cleaner it is
a good practice to have it it's not
necessary to have it here but I want to
also show you the good practice so we
can have the
init self this is responsible to clean
the text and we can have this so let's
have a function called clean that has
the self and text and the first thing
that we are going to do is that we want
to um basically put a line break after
each paragraph because paragraphs means
that after it there is a line break so
let's have this so Define
put line breaks so when we remove the
paragraph tag uh then we can like easily
have the same indentations in so what we
want to do is we want to replace a
closing paragraph tag like
this we want to have it like that so a
closing paragraph tag uh but after it we
are wanting to have a new line so this
is it and let's also remove HTML tags so
let's remove HTML
tags and when removing HTML tags we are
going to use beautiful soup so from bs4
import beautiful
soup and let's have the
clean text is equal to the beautiful
soup give it the text and uh have the
poer As
lxml and let's only get the text of it
and let's return
back the clean
text so in the clean function which is
the main function uh we are going to
receive text we are going to put line
brakes we are then going to remove any
HTML tags we are then going to strip the
output
so uh
strip and then we are going to return it
so this is the uh class that will clean
our text and will make it ready for us
to be used without any noise and let's
also specify the text column so the text
column here is going to be the text
column and the label
column is going to be label column name
and a text column
name and this is going to be an
underscore so this is going to be jutu
like this and let's also
clean the
text so cleaner is equal to cleaner DF
is equal to text
cleaned and then DF do text column name
so uh we are going to clean the text
column name which is this text column
then we are going to apply ID the clean
function on
it uh so I received an error because we
did not initialize the cleaner so this
is how you initialize it like this and
yeah so this is the cleaned uh text
right
there yeah we can also print out the
head so that we do not have too many
rows so only two and just like the input
of the neural network needs to be
numbers so that we need to tokenize the
input so that it can have the output uh
also as tokens uh also as numbers so the
output of the neuron Network needs to be
also numbers and right now the Jus are
in uh words they are text so we need to
make a a simple map that says njut is
equal to one genj is equal to two and
Tai is equal to three something like
that and one robust way of doing it uh
rather than doing it with if conditions
is uh using something called D encoders
that is in uh SK
learn so you can go back
up from here from skq learn import
pre-processing again if you don't have
it make sure to install it and you can
go back
down and initialize it basically so you
have the encode labels which is equal to
Le of pre-processing label encoder le.
fit and H give it a DF do label columns
do column name do uh two list like that
and this is going to uh have for each
for each uh for each Ninjutsu gutu Oru
is going to assign a number
so so we received an error here says
that Jutsu does not exist because it is
Jutsu so uh in the label uh column we
made it we can make it jutu then we can
go back here and run
it I see that uh jutu is also missing so
you can see here that Jus was uh
misspelled from the beginning so uh you
can go back up to where we uh tried and
did that so we can just run that again
from the
start make sure to put the Jus right
here and then uh run
it then
clean and then the label encoder now
everything is working fine so for the uh
lab label encoder let's see the results
of it so
label
dict and it's going to Loop over each of
the uh elements that we have so
four index and
label name in L doore uncore
dict like this and we put classes in so
it's going to Loop over the classes that
we have fed into it and then uh we want
to uh make it to
list then we can enumerate over it so
that we return the index as well as the
class names so this will return the
index of it right there and we can then
uh map it into a dictionary um so like
this have have this up and write uh the
index and the
label
name and make sure to remove this extra
column and yeah so zero is genjutsu one
is nutu and two is tautu and this is how
we did
it uh and this is a oneline for Loop
that returns a dictionary and a on line
for Loop that returns a list is going to
be this so for index in blah blah blah
so this is a list and this is a
dictionary now to transform all of this
uh all of this uh uh all of those utus
into the numerical uh type what we want
to do is that we want to have a label
column that will have the numerical um
class and we are going to run l dot uh
transform and give it the label column
and give it the tool list and yeah this
is it so DF do head and we are going to
have one twos and threes all ready for
us to start
training now one step before that is
that we want to uh divide this into uh
training and testing splits so what we
want to do is that we want to dedicate
80% of this data set to be uh to be for
training and 20% for it to be testing
and we want to be have 80% of the
Ninjutsu in the training and 80% of the
taiu in the training and 80% of the genj
in the training so that we don't have
like uh most of it in the testing and
none of it in the training uh especially
because those are skewed data sets so we
need to uh take care of that so one easy
way to do it is that we can um import
supporting function from sklearn
so so from sklearn model selection
import train test split then you can go
back again down and write
DF train is equal and DF
test is equal to train test split where
you give it the DF you give it the test
size to be equal to
0.2 and you give it a stratify
and uh the stratify is going to be the
label so stratify basically tells it to
make sure that each of the classes 80%
of it is in the testing and and 20% of
it is in the chaining and instead of
putting it like this 20% we can also put
it like the test size is equal to 0.2
then feed 0.2 right here since we are
going to have some parameters in the
class and yeah so let's make sure that
stratify worked fine so if you can have
value counts you can find uh whoops you
can just uh call jutus right there and
yeah you can find that 80% of the
classes are dedicated to
training now let's see how we can
tokenize output and we can tokenize text
so that we can also prepare the text to
be um fed forward into the new Network
so let's have the model name is equal to
U and we have a model name right here
um we are going to use something called
dist still
BT also distal bir is another uh is
another model that we have let's have it
distal birt
base uncased it's also a Transformer
model
so just copy
it paste it right here it's also very uh
very easy to load with just just a
couple of gigabytes of uh RAM that we
can load it in so that's why I'm using
it and we are going to use llama for the
for our chatbot it's a very big so we
won't be able to run it
locally and we can have the
tokenizer is equal to AO tokenizer from
pre-trained and the motal name and make
sure to also import it so you can go
back up autot tokenizer is in the
hugging face
Library so from Transformers which is
the hugen face Library import
oo Auto tokenizer you can remove the
auto uh sequence
classification and you can go back down
and this is how we load the
tokenizer now let's create also to the
function that tokenizes the text so
let's have the
preprocess function which is takes in
the
tokenizer and takes in the
examples like that and it returns back
the uh tokenizer and we can have the
example of text cleaned then truncation
is equal to true so if something that is
above the 512 tokens it truncates it so
that it doesn't break the uh
model uh now we want to run this on the
uh on the whole data set uh we can do
this with the apply function but we can
also do it with the hugging face data
set so go back up and write
from data
sets import data set uh this might need
a pip install so don't so don't forget
about it
and let's convert this uh pandas data
frame to a data set hugging face data
set so
convert uh
pandas
to uh hugging face data set and let's
call the train data set right here is
equal to data set from do from P does
give it the train and we can also give
it a test right there
so test data set and we can also
tokenize it right now tokenize the data
set so
tokenized train is equal to train data
set do
map and what are we going to map we are
going to have a Lambda
function that is going to take examples
then call the pre-process function uh
give it the tokenizer that we uh
loaded and then give it the
examples like
that uh so make sure to remove this plus
and have the
underscore and uh yeah also the last
thing is that we want to have it batched
equal true so that if it's out of memory
it doesn't
U crash uh because of memory issues now
let's have the same for test so just
have the
test and test like this and just run
it uh data set is not defined I just put
it up there and did not run it so make
sure to run it uh come back
down and just uh run
this now we are ready to write our own
text classifier here so the first thing
is that we can uh make the cleaner
function so the
cleaner uh cleaner. py like this and we
can go ahead and copy paste it so scroll
up copy and paste it right in so this is
our cleaner function and it's put in its
dedicated file so that everything is
neat then let's create a file called
jutu classifier py so let's create a
Jutsu
classifier
py and you can just initiate the class
so
Jutsu classy
fire like that create a init
function and we can make it take uh some
inputs so some parameters some inputs so
we can uh control it with only the init
so let's also have the model
path right here uh let's have the data
path which is the uh data that we are
going to train on and the model path is
going to be the uh output uh path that
we are going to save the uh model in uh
that we
trained then we can have a text column
name is equal to
text like this and we can also have a
label label column name that is equal to
U2 like
this let's also add a model
name that is going to be the distal
birth model that we uh that I showed you
before like this
one and those are just called values
that you can overwrite by simply uh
passing it through when calling the
model uh then test size is equal to 0.2
like we did then number of labels we
know them uh to be three and a hugging
face
token uh that is going to be none so the
hugging phase token is just um the token
that hugging face gives you so that you
can upload data sets to their hugging
face Hub and uh yeah it also identifies
you uh uh if if you have like uh special
access to some models and not and what
not so uh you can go back again here and
let's put it into the self variable so
self. model path equal model path data
path is equal to data path uh text
column name label column name model name
test size
uh then number of labels and then we
want to have the
device uh we want to have it uh Cuda if
torch is available else it's going to be
CPU and let's also
import the uh torch then uh let's now uh
do a hugging face uh let's assign the
hugging face token so self. hugging face
token equal hugging face token if self.
hugging face token is not none then we
need to log in so we can import import
hugging face
Hub and you can have the hugging face
hub. log in and give it the token uh to
be hugging face uh token and you can
remove this token
keyword and just make sure that you have
hugging face Hub in your requirements
and you installed it uh so that it works
then let's create a function to load the
uh tokenizer so self. tokenizer equal uh
self. load
tokenizer and have the load tokenizer do
self and now we want to check whether we
already uh trained this model and saved
it to the hugging face Hub so we're
going to use the model path else we are
going to choose the model name and then
train on this so if hugging face
hub.
repo exist so if it exist uh the model
path if the uh if this exists then we uh
load this uh tokenizer else uh we load
the tokenizer from the model
name like that then at the end we return
back the tokenizer and don't forget to
also import it so from tokenizer Import
Auto tokenizer and this is how we load
our tokenizer then let's also uh have
this condition in inside of the uh init
so if we see the model path then uh if
if we don't see the model path then we
are going to train it uh and then we are
going to load it let's first check uh if
the data path is provided
and if data path is none we can raise an
error so raise an error data data path
is required to train the model uh
since since the uh model path does not
exist in hugging case Hub then we want
to have a function that loads in the
data set so let's load it in so train
data test
data equal to self.
load data and give it self. data
path so that's the data path that we are
going to load the data from and now
let's create this function define load
data is equal to self and it takes in
also a data path and right now we want
to read in the Json so read Json we also
want to have lines equal true like we
did
before
lines equal true and make sure to import
the pandas uh Library so import pandas
as
PD and we can also run the simp simplify
JSU function that we did before so we
can scroll up and just copy this
simplify uh simplified juu function like
this make sure that it has the
self and at the end uh let's not return
anything so that is it returns uh if it
uh just hits the if
conditions and we can run this by just
having the same uh call like the one
that we did
before and then we would also need to
add the texts like that like this uh
make sure that it is working
good and you can see here that this
requires a self so add it and then we
want to clean the data I am just
brushing over this because we already
did that here and I'm just copy pasting
code
so we have the uh clean text so just
copy it go back here and uh just paste
it right in the cleaner will need to be
imported so you can go back
up from dot cleaner import cleaner so
you can go back down and for the text
column just write self. text column
name now we want to encode the labels so
like we did also before we are going to
go back again right here uh just copy
this paste it right in it would require
us to import the
pre-processing and it would require us
to have the labels so we can go back
up and let's get the train test split
and the pre-processing and the also the
data set why not go back
here and paste them right all in and
this autot tokenizer is duplicated so we
can remove it go back down and now we
have the label encoder
ready uh then go back here then see what
we did after the label encoder we have
the label dick so just copy it and you
can delete
this and uh for the labels you can just
copy this add it right here add the
self. label column name
and afterwards we have the train test
split so let's go back again right here
and write
train test split and just paste it right
in have the DF and they have the test
size and uh call stratify is equal uh
tool that
label and uh after this we can convert
to a hugging face data set and then
tokenize the output like we did before
so like uh like we did before we can
convert
it convert that GF train convert that GF
test and have the pre-process function
we don't have it here so we just can
copy it paste it right in and add self
in
it like this and make sure to call it
with the cell function like
that and the two tokenizer also has the
self in it we loaded it at the
top and that is the tokenized train and
the tokenized test and now we have
successfully loaded the data set so you
can return back the tokenized chain and
the tokenized
test and I have spotted something here
that is wrong uh I have read the data
into a data variable and you have to
read it in the DF variable like that so
we can go back up and now we have the
load data
set and afterwards uh now because we
have uh a skewed data set uh we need to
uh penalize the uh function because uh
we need to tell it that if you made a
mistake in genju which only has 100
samples uh multiply this error by like
for example uh 10 or 20 so that it can
focus on genjutsu more um
and at the end of the day we can have
more of a balanced data set and skewed
data sets are tricky because for example
let's have let's take this scenario like
90% of uh the cancer lung cancer for
example data set is or even more like 95
of it is going to be negative samples
and 5% of them is going to have only the
um uh only the uh cancer in it and the
uh model can reach 95% accuracy by
simply predicting that all of the
samples does not have any uh cancer so
the idea here is that uh that model is
basically doesn't do anything and we
want to have it focus on the cancerous
and not the non-cancerous actually so we
can give it class weights to tell it if
you made a mistake with a cancerous
sample then this loss is going to be
multiplied by a big factor so your loss
is going to be a lot and this is what
you're trying to minimize so you need to
focus on the cancerous samples and get
those rights to actually make uh the
model
good and this is what we're going to do
is that we are going to uh get the uh uh
get those uh class weights and then
multiply it with the loss when we have
the chance so let's first get the class
weights and to get those uh we can
convert the hugging face data sets back
again to uh Panda's uh data set so let's
have this data DF which is equal to
train data dot to pandas like that and
let's have the same for the test
data and let's put it uh in one big data
frame called all
data uh so pd.
concatenate and give it the training
data set and the testing data set then
reset index don't drop index is equal to
true then uh right class weights is
equal to
get class
weights and give it all
data now the idea here is that when
we're getting class weights it's
preferred to run it on all the data set
that we have but uh we can also run it
on the training data set so that's why I
just converted it back to pandas and
concatenate it into one big data set uh
because it's preferred to have all the
data when we are getting the class
weights so uh let's now get the class
weights so let's create a new file
called uh training
utils py and let's create a function
called Define get class weights that
takes in a DF and returns back a set of
classes uh one function that we can
utilize for this is that we can have it
from
escar uh Dot utils
dot class
weights import compute class weights so
this is going to be a function that
simplifies for us the calculation and we
can call it by having this we have it uh
balanced so we want to have a balanced
uh uh classes and the
classes is equal to be uh the sorted
version of
DF of label so it's going to be the
012 do unique we are getting the unique
so this gets the whole column then
unique gets the unique values then we
switch it to a
list and then we sort them and put it
into the classes variable and at the end
we give it the column of the DF label so
DF label
like this then we give it the uh column
as a
list uh so like that and this returns
back
class weights like that and we can
return it uh like this you can go back
here and you can import the get class
weights function so
from dot training utils input get class
weights you can go back down and you can
find that it doesn't have a Squigly line
anymore then what we want to do is that
we want to self.
train model we want to create u a
function that uh has the train model
that takes in the train data test data
and class weights trains the model and
outputs it to hugging face Hub then we
want to load the model so that we can
have the self. load model
we still didn't alterate this but it
takes in the self. model path and yeah
that would be it
so if we don't have the path we train it
we train it right here and save it and
at the end we load it and if actually we
have it then we skip this if statement
this big if statement that has the
training code in it now let's write the
training code for that so the training
code is going to be a little bit EAS e
here it's going to be just
configurations and just um like calling
some functions that are already made on
hugging face so let's do that so let's
define train model let's give it
self let's also give it a
train data let's give it test data let's
give it the class
weights and and let's load the model
which is going to be Auto model for
sequence
classification uh from pre-trained and
give it the model name and the number of
labels and we can also want to give it
the ID to labels so we want to give it
the um like uh each label what id is
going what is it going to
be so uh right here uh we are going to
scroll back up in sorry scroll down to
the load data and for the label dict you
can see that it's not used so let's
initialize it right here and let's put
it like
this and the auto modif sequence
classification let also import it so
it's next to the auto
tokenizer and yeah so yeah you can find
there's a DOT here to make it um a comma
and then we can continue so uh we need
to have a data
collator and uh this uh pads the data
set so data collator with padding and we
need to also encode it we need to also
import it so let's just copy this uh go
back here and in here we can uh just do
it in multi-line by adding brackets so
adding data collateral right
there and we also want to have something
called training
arguments like this and let's go back
down and see how it goes so this is the
data collator right there so this is the
data collator right there and let's now
uh initialize the training arguments so
training arguments equal training
arguments then we can close it and let's
just specify the things that we already
have uh like in the initializing
function
so output
there is equal to
self do model path then we have the
learning rate which is how big the steps
are while learning it's going to be uh
2-4 and 2 E4 then per device training
batch is equal to 8 and then per device
testing batch is also going to be equal
to 8 and this is the batch size that I
told you about before that is going to
handle big data set so that it can fit
into RAM by dividing it and then uh
training it one by one uh then the
number of training EPO like I also
mentioned what our EPO before uh is
going to be five and uh this is the
number of iterations that I'm going to
go through the data set before uh like
quitting the uh
training then weight Decay is going to
be
0.01 and this is essential to make the
training uh at the beginning not lose it
like not lose and not forget the uh what
the model was uh was trained on before
uh so it makes the changes at the
beginning where the loss is very high uh
makes it uh less uh uh less um less
drastic then we are going to set an EV
valtion strategy which is after each
Epoch and we are going to have a logging
uh
strategy uh
logging uh strategy which is also going
to be after each ook and we are going to
push to the hub so at the end we want to
push it to the uh hugging face Hub so
that we can install it from anywhere
anywhere that we
want let's then Define the trainer which
is going to be trainer right now we want
to define a custom trainer that takes in
the uh that takes in the class weights
and then uh multiplies those class
weights with the actual loss so so that
it can uh penalize the classes uh
correctly so you can go here make a new
file called
custom Uh custom
trainer. py
then we can
import torch then
import uh then from torch import
NN and from Transformers import
trainer and if you're wondering what
torch is it's just a neural networks
library and it's one of the initial ones
uh there was tensor flow and there is
also torch and yeah um so those are the
underlying uh libraries that the models
are being trained uh like being written
on even hugging face uses transfer flow
or Transformers to run its models and to
train on them so you can write class
Custom
Custom trainer then give it the trainer
uh class that we imported from
Transformers then we need to comp Ute
the
loss give it the self give it the model
give it the inputs and then it give it
the
return outputs as false uh then we need
to get the labels so
labels is equals to
inputs do get and then get
labels uh forward pass is going to to be
like this so
forward so uh the forward propagation
and then we follow it back with backward
propagation so the outputs is going to
be model and then we pass the inputs on
it then we get the logits of the output
uh then we
compute the uh custom
loss and uh we have the loss function as
uh categorical CL and tripy loss and we
take in the weight so the weight is
equal to going to be the weight is equal
to
torch dot
tensor then give it self do
class
weights then to device then set the
device to uh like this set the device to
device so we have now a device and we
have the set classes weights that is not
in the classes so we are we need to make
uh Setter functions for those so the
last thing is that we are going to
calculate the loss so we give it uh we
call the loss function that we
initialized above we give it the logits
and we um Wrangle the data set a little
bit so that it can fit in um so self.
model.
config DOT number of
labels like that and then the labels is
going to also have some wrangling uh
which is going to be View
then1 and then we return back the loss
and the outputs if the return output is
going to be true else we are going to
just return the
loss and yeah we just need to define the
class weights and the device so those
are just simple Setter functions so set
class weights equal to class weights and
then set it right here and then we can
also set the uh set device and this is
how we do
it uh you can close this back and you
can go back up and from here you can
write from do custom trainer import
custom trainer go back down and we are
going to uh initialize our
trainer so
trainer equal custom trainer
then give it the model give it the
arguments which is training arguments uh
give it the uh training data let's
delete those give it the training
data which is going to be the training
data then give it the uh eval data
set which is equal to the test data set
then give it the tokenizer
tokenizer equal to self to tokenizer uh
then give it the data
collector then give it the compute
Matrix
compute uh
Matrix and this is a function that
computes uh the accuracy of the model so
we can go back again to the training
utils and here you can just import numpy
as NP and then import evaluate and
evaluate also needs to have a library to
be installed so you can go here and you
can install it by writing
evaluate which is equal equal
0.4.2 and yeah go back again to your uh
training
utils and write metric
is equal to evaluate uh do
load
accuracy and then write def Define
compute metrix then give it the eval
predictions then from the eval uh then
separate the logits and the labels get
the maximum logits as the prediction
then you can compute the uh compute the
accuracy by running the uh compute
function giving it the predictions and
giving it the
reference and yeah this is it so you can
just copy the compute metrix you can go
back up and from the training utils also
import the compute
metrix you can go back here and you can
see that compute metrix does not have
this quiggly line
anymore now we need to have the trainer.
set
device and give it a device trainer
class which is equal to class weights
then we need to start training so
trainer. train and then after training
we need to uh flush the memory so flush
any Ram flush any unused Ram or unused
GPU memory so this training by the way
is going to push to HUB after it
finishes training so yeah we don't need
to do anything special to save the model
so uh flush memory and we are going to
delete the trainer and we are going to
also delete the model then GC do collect
which is the garbage collection and you
can go back up here and
import
GC then go back
down right there and then
if
self. device is equal equal Cuda then
Cuda empty cache we're emptying the GPU
cache as
well now the training code is now done
and what's left is the uh loading of the
model so Define load model we take in
the model path and we want to import all
to Pipeline and pipeline is a like is a
way for hugging face for us to uh for it
to run the um uh for it to run the token
ER for us then it runs it through the
model then after the model is finished
it takes the numerical output and Maps
it to the uh text output so that we can
uh do this in one uh like convenient
function and don't have to do all those
steps uh by hand so you can call model
then uh call
pipeline then tell it that it is going
to be text classification then give it
the model path then uh mention that we
want to return all scores which is equal
to true and then return
model and that is it we have the load
model we have the train model we have
the load data set also right there and
the only thing that is left is an
inference function so let's also do that
so let's close all those functions and
let's create the inference function so
we're going to call it classify
juu like this we're going to make a take
itself and a text which is the text that
we want to classify then we want to get
the model output so self. model and give
it the text and then we want to have the
predictions which is going to be
self. post process and then model
output and and then return the
predictions so post process is not there
so let's write it so Define uh post
process and take and let it take the
model output and then we can write the
output is equal to an empty list and for
each prediction in the model
output we are going to get the maximum
uh prediction so the maximum score so
label
is equal to maximum because we are going
to have a score for Ninjutsu genjutsu
and Ninjutsu and the one that was the
maximum score this is going to be the
classification basically so we are going
to have the prediction we are going to
give it the key uh Lambda X and then
give it the x of score so that is where
the score is
stored and take the label of it and and
after we finish we just create output.
append label and then return the
output and this is it this is the
classified Jutsu
function and yeah so everything here is
uh is working good so what I need to do
right now is I need to expose this
function this this Library so underscore
uncore init
um like this
py and we only need to
import
from from
juu let's copy paste it it's not showing
up in the suggestions so
import JSU classifier like that and make
sure to put the dot so this is how we uh
expose it then we can go back to gradio
and we can write this
section so let's go back to gradio right
here and let's now just copy paste uh
this
again but now we want to have a text
classifications with
llms and with row then column and then
we can write whatever H1 tag we want so
text
classifications with
llms and then uh we want to have the
output as just text so
text
classification output as just a gr text
output box and it's going to have a
label of text
classification
output and then we are going to give it
uh a path for the model and the data set
path and the text to classify so let's
do that so
text
classification
model like that uh we are going to put
in the gr do uh textbox
we are going to give it a
label and then we are going to give it
also a
model path like
that uh we are now also want to have a
data set path so let's have this so
text
classification data
set data path let's call that data
path and let's call this the data path
now for the text to
classify we are going to just copy paste
it and have it the classify like the
text input just call it the
text
input now we are going to have a button
also for the uh for the classification
so let's
classify right here uh text
button then it's gr button. classify
text so let's do that
so
classify text and then
JSU and in the class text classify
function we need to also uh trigger it
and give it a function to classify on so
classify text then give it the input
which is uh text classification model
then the text uh
path um and for the output and the text
uh to classify right there and for the
output let's have the text
classification if we can spell it
correctly so text classification as the
output right here now we don't have this
classified text yet so just uh comment
it and run it make sure that everything
is fine before we uh can proceed
so let's uh copy this put it right here
make sure that the text classification
looks fine it does now the button
doesn't do anything right now so we can
go back close this contrl C clear
it and we can write the classify text
function so you can go back
up here you can write
Define classify text that takes in the
text classification model textt
classification path and the text to
classify we can then load in the jutu
classifier and uh the way that we're
going to do that we can also have it
from text classification import jutu
classifier the jutu classifier is get is
going to get the model path so
model path like this and uh the path is
going to be this one uh then it's going
to take in the data
path and the data path is going to be
this
one so make sure that the classification
path is correct and the last thing is
going to be the
hugging face uh repple uh the hugging
face token so if you can go back again
you can find the hugging face token
right there just copy it paste it right
here but what are we going to assign it
to so uh yeah before we proceed uh this
is uh I think this is the correct one
but just remove this uh suggestion and
we can get to back and we can get uh to
it later so where can we find this token
so that we can push the model to the
hugging face GitHub so you can log into
hugging face it's free then you can
press on this icon and then press on
your uh uh name and then press edit
profile uh press access
tokens and those are the tokens that you
want to have so I am going to create a
token for uh like with you guys so let's
call it tutorial token and it's going to
have right so make sure to have the
right condition on and press create uh
you can copy this token and press done
so I am going to remove this token after
I finish this tutorial so please uh make
sure to create your own token so that it
can work for you
guys and since token is going to be a
secret variable uh let's also add in a
Dot N file thist n is going to have the
variables that we want to have secret
and not push to the hugging face
basically uh or to to the
GitHub so uh right now this is going to
be the hugging face token so you can go
back to your environment and just try
hugging face token we can also have have
a EnV example so you can tell people
what to put in the uh EnV uh folder
because we're not going to push the NF
so you can put it right here hugging
face token and tell people to uh add it
uh there so you can go back to your
gradio application scroll back up and
say uh from. EnV import load. EnV then
you can call uh load. EnV and what it
does is that it takes in all the
environment variables in the nend folder
and uh put it into as environment
variables so you can go back here and
write os. getet um
NV and say that you want to have the
hugging face token basically so this is
it uh so there's a comma right here that
I forgot and Os is not imported so make
sure to import it so import OS and N
here is uh is needed to be uh installed
so so you can go back again to your
requirements right here write
python uh dot
EnV and write equal equal
1.0.1 like
this so python uh sl. EnV and write uh
0.0 like 1
1.0.1 now uh you can just pip
install. n like this and you can see
that to install it you can just have the
python sl. NF and that's why I wrote it
like that so yeah never use your like
memory to write it down just make sure
from Google that it's the correct one
that you are downloading so make sure to
pip install it pip install the
requirements and now we are ready to go
so uh that should be uh good yeah so
before we uh do anything we need to uh
run the classifier on the text and then
get the output so output equal juu
classifier
dot
classify
jutu and then give it the uh text uh
text to classify
and yeah this is it so we can run the
gradio application make sure that
everything is running and then we can
test it out on Google
collab so we got an error right here uh
from text classification actually it's
not text classification it's text
classifier actually no it's text
classification so just uh from text
classification UT jutu classifier uh so
to make sure that we are spelling
everything
correctly yeah I misspelled classifier
but I uh yeah there's an I here so yeah
that's why it didn't work so just uh
missell this one also so that it works
and everything is good so let's let's
have it know let's have it the correct
way so let's have the classifier this
way and then we can open it here right
add the I and we can open the also the
uh JSU classifier and write it
correctly go back to grade you make sure
that everything is good and yeah this is
good so you can clear it run it again
and see how it
goes so this is right now working fine
so you can copy it paste it right here
and you can see that uh if you opened up
my hugging face right
here uh you're going to find that I have
a jutu classifier ready uh but I'm going
to train a new one from scratch from you
guys with you guys right now so let's
have a model path which is juu
classifier 2 then we are going to also
have a uh data set path which is going
to be the uh J so Json l so copy this
path and paste it right here and let's
also add in a description for uh jutu
which
is just uh renun
description so yeah I write Ren gun
description and uh just copy
this and paste it right
here where is it
yeah just copy and classify so yeah we
got an error so let's see what it
is so I fixed a couple of stuff in the
uh self. label uh column here it was
jutsus and uh also here it was Jutsu so
uh just replace it with label. column
name and then in the per device testing
batch size make sure that it is eval
batch size so it's Val and in the end it
was here uh training data in the custom
Training it was training data set so now
it's train
data so yeah that is it and one more
edit in the custom trainer just in the
logits make it make sure that it's uh
you add this line logits equal logits do
float to convert this into a float so
yeah uh you can just save it go back to
gradio and uh clear it run it again
go here and press classify
jutu and yeah so right now you can see
the uh you can see the outputs right
here of
this and it will run for a while so yeah
uh we need to move this to Google collab
and train it there so let's uh close
this down and train
it since it's now working locally I can
now start and uh push it to GitHub and
then pull it and run it on Google collab
so you can write get
status and you can find that we have a
couple of edits in gradio requirements
and and we also have test
classification uh that needs to be
pushed so let's just have the diff of
get gradio app make sure that nothing
nothing's weird going
on um so everything is looking good just
get add
this then get status see what's up get
the uh get add the requirements as well
then get add the text classification
get status and uh yeah so those are all
the uh files that we want we can also
add the end example so get add. n
example and you can just get
commit
DM uh add text
classifier get
push and let's now go to uh the Google
collab and you can go here and you can
just run
it uh no need for us to pull so just
install the requirements and install
these crepy requirements we won't need
it for the TX classifier but just in
case we want to run
it and now if you remember we have a end
file that we did not push so we can push
it and make it here
on the uh on the terminal side so you
can just have here
CD uh analyze the uh analyze series with
NLP uh then uh you can just have the
environment variable created right here
in the
terminal and we can just
Echo the uh hugging face uh the hugging
face token right there so you can just
copy it paste it right here make sure to
put it between codes and then you can
say that we want to uh put this in the n
f uh file and you can run it and this
will create a end file and it will have
one line which is um this environment
variable um and yeah we can then run the
gradi
application so uh yeah it will take a
while for it to install the requirements
so I'll cut the video and come back when
it's done
so it's now finishing so you can add a
new folder call it data then inside of
the data folder you can just upload the
Json L that we have uh so go to your uh
data you have the J JSU JNL uh just
upload it while this is being finalized
it will uh upload the data set so you
can just copy this paste it right in
right here you can find the data jutu
has been uh updated so you can just copy
the path wait for this to finish then
paste the data path right here the model
path is going to be um so I have a model
path right here when I Was preparing for
this uh tutorial it was a doar which is
my name then uh Jutsu classifier so I
won't override that but I will make a
new one for you guys so we can start
from scratch so I will have Jutsu
classifier uncore 2 and then the text is
going to be just the recent gun
description which is one of the ninja
attacks that we are trying to
classify so just write Rend gun
description and it will appear to you
guys here so just copy
it paste it right in then press classify
Jutsu and yeah if things don't break
then it would take a while for it to
finish to train the model then push it
to huging face and then it will load it
back in and then um like run this text
classifier input on it uh this uh yeah
and yeah so I will return back when it
finishes and see you
then so now it's finished and you can
see the output here is in the list so
we'll need to uh make that of zero so to
get the first one but other than that
everything else is worked uh has worked
fine and you can go back to your hugging
face refresh the screen and you can see
that we have the Jutsu classifier
or2 and it correctly classified the ren
gun as a Ninjutsu which is that is the
correct thing and yeah you can go back
to your uh Jutsu uh classifier you can
go to your files and versions and you
can see all the tokenizers and the
weights right here uploaded for you guys
guys and you can download it uh
normally so the one that I uh will keep
is I will keep the abdull Tark Jutsu
classifier um model I will remove theore
2 because that's just a duplicate so
yeah so if you want to remove it just go
here and I understand and delete this
model also one more thing to uh note
that if you run into any issues or any
um like uh training uh training issues
that you have here uh mostly you're
going to find that it will save the up
like most up to dat model so when you
run it again and uh you are trying to uh
like pull this uh pull this model in uh
it might give you an error because not
all the files has been uploaded so make
sure to go and delete it and then start
from uh have a a fresh start so you can
delete this uh model and I am keeping
for you guys this one so if you want to
play around with it uh so yeah make sure
to uh use this one and not the
underscore
2 so yeah we can go back again uh
locally from here and you can go to
gradio again um and go to your text
classifier make the in output as output
of uh zero because now we're we like
returning a
list and one more thing let's uh run it
it locally and see how it goes we won't
uh train it but we would just make
inference on it so you can clear this uh
get status uh we have one edit which is
the zero that we made so let's add it
here um make the
output uh make output as string not list
commit then push uh we don't have to
train again since everything works fine
it's just this small uh thing so you can
just uh run it right
here wait for it to
launch and there you go so just copy
this uh go back to your uh website or
browser just go to your text
classification and paste in the model
that you have which is Abdullah like
whatever you want like the juu
classifier one then you can uh just add
the uh text input which is we had the
renun
description and like this and you don't
have to provide a data path since the
model path already exists so you can
just classify the Jutsu and it should be
uh there so yeah you can see that it
finished quite quickly and the output is
ninjutsu and everything is working fine
so now we can move on with our next uh
module which is the character chatbot
module so the character chatbot module
I'm going to show it to you guys uh this
is the uh module for the chat for the
gradio uh all of it is um like ready
made so you can write whatever you want
here and depending on the character it
would uh like act as the character and
uh like copy his behavior and his
response uh and his response uh behavior
and then uh respond to you as if uh it
is this character so uh yeah so you're
just imitating as if you are just
chatting with the character that you
like from your
Series so I'm going to write
what's your
dream so you can see now we have some
good animations right here uh you have
the uh your message and then the output
message from the chat bot is going to be
right here and you have a loading screen
right there so everything is uh
everything right there is ready made
from gradio so we won't uh need to do it
from scratch and yeah the response takes
a little bit of time because every time
we load a huge model uh in Ram and if
we're doing it on production uh this
model should be always on RAM but I
wanted to make sure that um we have
enough memory to run the text
classification the character Network and
the text and the team classifier so
after each run I just just um like in
inside of each function I just
initialize the model and then at the end
of the function this model is going to
be um put into the garbage collection so
that it can free up some space for the
other models to run and yeah I'm going
to wait a little bit for it to uh finish
but afterwards uh I'm going to show you
the output and then we can code it
together so now it's done and you can
see that it responded like uh like it's
Naruto and its dream is to become hoki
which is actually Naruto's dream and
yeah this is it for this model we are
going to be using one of the
state-of-the-art models and it's a big
one it's called a llama um llama model
that is from meta and yeah it competes
with Char GPT and competes with
state-ofthe-art models and it's also in
the leaderboard so this is one of the
state-of-the-art models that we can use
and we are going to use it for chatting
with a character and you can have as
many by the way you can have here as
much uh messages as you want uh you can
then respond and then build on this
messages that are from
above and yeah it will keep on piling up
till the uh till it has like the memory
limit and then it will uh truncate any
any messages that is above it and yeah
this is it uh we are going to be using a
meta Lama 3 uh 8 billion parameters uh
instruct tuned and this one is going to
be uh it needs to have access so if you
just go here I'm going to show you also
what it looks like if you don't have
access to it uh right there it it would
tell you that this is going to have a
license agreement and you need to log in
and then press on uh agree or something
like like that here and then it would
give you like this like it will be like
this so you have been granted access to
this model it might take a couple of
minutes for you to get granted access
after you press the button but
afterwards it's going to be good and we
are going to use the same token that we
have and the token the hugging phase
token that we have is going to see that
we have access to the meta 8B um
instruct tuned model so it so we can
download it easy
so let's move again to the code and
let's clean up all this uh you can uh
close down all this close it close it
and um close all
this like that uh then we can create a
new folder called um new folder right
there called character chatbot so
character
chatbot and inside of it let's create a
notebook that demonstrates how we are
going to Wrangle the data and what data
do we want exactly for this character
chatbook to work so we can just write
character
chatbot
development do
ipynb then it would ask you to add the
um python environment variable here it
didn't but it might and we can just
import
pandas and yeah you can just uh load the
model start fing the model so load the
data sorry so load data or model uh data
set like this and the data set that we
are going to use is going to be the
transcripts data set which is the
naruto. CSV I'm going to show you it so
so pd. Tre CSV then we can go
back like
this
data and then write
naruto. CSV I don't know why it's not
coloring so let me oh yeah so it's a
text uh it's a text uh it's a markdown
uh cell so you can just add code cells
put it right there now uh you can have
as PD then you can run it like this
DF do head and yeah you can see this
right now which is going to be the name
and then the response of the character
so this is uh the character is talking
but there is also some sort of action
that is in between brackets so we'll
need to remove this uh remove those
since a chatbot does not output actions
it only outputs um text so uh we'll
we'll do that using grx uh which is um a
way to select um uh characters or like a
sequence of characters based on some
rules and yeah so we can go ahead and
write um let's call this Naruto
transcript
transcript uh. DF and let's put this
into a data
path then
um let's just copy it put it right there
and let's have the head right
here afterwards let's write the code to
remove those everything that is between
parentheses so let's just copy it so
let's just uh have a
remove actions from
transcript then create the function
which is
remove parentheses
then give it the
text and uh right now uh the the Rex
library that we are going to use is
called re so this does not need to be
installed I think it's from it's in the
default python libraries so you can have
the re do SUB then open up R which is
going to be Rex and uh we are going to
say that everything that is in between
brackets so starting with a bracket then
um dot that means uh one or more uh like
any like any character that we want uh
then it's going to be a star that says
uh this is going to be zero or more
characters and then excl like a question
mark that says this might or might not
appear Then followed by a parenthesis so
this is basic basically telling you um
this is basically telling you this and
it's telling you that anything that
starts with a bracket has any characters
in between and then ends with a bracket
uh this is going to be selected by the
Ric
Expressions so yeah so you can just uh
say that we want to replace this with an
Mt string and then uh we want to process
this on the text uh variable that we
have we have right there then we return
back the
result uh now let's uh process this on
all of the lines here all of the rows
and the way that we're going to do that
is that we are going to also use the uh
apply function so let's have the line
where Naruto of line do apply then
remove parenthesis then run
that so the line here is capital make it
small just make sure that yeah I think
it is just run it it's now working so
you can just have the head of two and
you can see now that we had this
laughing and this turns away now we
don't have it here so everything is
working fine right
now um afterwards what we want to do is
that let's remove this to and let's uh
only choose the Naruto we want to choose
the Naruto responses and we want to make
sure that it's not something that is
very small like more like this we want
to have at least like an X number of
words uh so that we can see like
characters like the Naros um or the
characters uh personality in those words
um and yeah so we want to have also
Naruto responding so we are going to
exclude the first line here uh and
anything that is below that we can just
take it so let's have this uh so let's
write those words and let's first count
the number of words per line so we can
have the Naro
DF let's count the number of words so
number
of words which is going to be equal
Naruto doline apply then um what you
want to do here is not apply we I'm
going to show another way but we can do
it through apply
also write Str Str which is basically a
string then
split and this is going to split words
from each other then you can write uh
Str Str again just make it in a
string um sorry this is going to be
strip and then uh split it and this is
going to be a space so right now we are
going to put in the number of wids
the um uh the a list of words basically
in the line let's also now count it so
we can count it through apply so you can
have Naruto d f of number of words like
that here and you can have dot apply
then Lambda X and then have the length
of X so make sure to just have the this
one as a DOT and you can run it and now
we can see the results so we just copy
the head and then paste it here and you
can see that it now counts the words
quite correctly so we can now create
another uh another row that another
column that is called Naruto response
flag so that's going to be just a flag
that tells us whether or not we can uh
we should take this row or not so we can
just uh have it like that which is
Naruto response DF and we are going to
have the
Naruto
response flag and let's set all of them
uh to zero right now and afterwards we
can just look which is location like we
can find the location of and give it the
Nar todf like
this of
name which is going to be equal equal
Naruto so it's the name is going to be
equal Naruto so we are going to take the
rows where the name is equal to Naruto
then make an an um and also take the
Naruto DF where the number of words is
equal to five at least five so uh number
of words is going to be greater than uh
five and then what we want to edit is
the Naruto response flag so just put it
right there then write equal one so
anything that has the Naruto and also
has the number of words greater than
five it's going to be equal to one so
just copy this Naruto transcript DF
right there and right here you can have
like you can see that this is one and
this is going to be zero because it has
one word only and yeah so on and so
forth but the only thing that is left
right now is when we're picking the
indices to choose or the row indices to
choose we should exclude the first uh
the first uh row because it's not a
response it's just like initiating
conversation so we can write here
indices like
indexes to
take and uh we can just have a list of
Naruto
transcript of going to be uh Naruto
transcript again
like that and we are going to put the
Naruto
flag this
one is going to be equal equal 1 and we
are going to also set the IND index to
be like greater than zero so we can just
write it right here so
Naruto DF do index is greater than
zero and yeah so this is it and at the
end we just just want to get all the
index of this data frame so just uh run
it and we can see the indexes to take
just put the first three and those are
the first three indices to take so right
now we want to create the prompt that we
are going to feed through the chatbot so
we are going to give it the system
prompt that introduces it to the task
that it is going to act like Naruto and
Naruto is from an anime character and so
on and so forth then we are going to
give it the
question or statement that is set to
Naruto and then we are going to give it
Naruto's response and this way the
machine would understand that what how
Naruto is responding to multiple
questions and multiple statements and
though it can imitate it so let's build
that right now we can build the
system prompt and we can write something
like this
you or uh
Naruto from the the
anime then write
Naruto like this uh then tell it you
your
responses should
reflect uh
his
personality and speech patterns
and yeah that is it at the end just put
a new line and yeah we can just go ahead
and give it the um what was Naruto's uh
what was Naruto being uh said before
that whether it's a question or a
statement so you just have the
prompts that we are going to use and uh
run for each index in indices to take
like this uh what we want to do is we
want to initiate the
prompt as the system prompt and after
this we want to
add uh we we we're going to add what
Naruto was being uh like what was being
said to Naruto so just take in this like
here uh write iock and then of index
minus one and and then what we take is
we are going to take in the line so the
line
column uh then what we want to do is we
want to have a new line so let's have
this right
here then plus
equals and then have it as a new line
then have the
prompt like that um then plus equal and
then put Naruto's response and Naruto
response should be uh Dot ilock and
don't forget the see right here of
index and then it's going to be the
line column and afterwards we just add
this promp to the prompt list that we
have and this is the data set that we
are going to use and let me display to
you what the like one of the data sets
look like let me print it out so that
you can see the new lines so this is
going to be the system statement and
this is what was being said to Naruto
and this is Naruto's response and you
can have like another one and you can
have like this one H yeah so you can
have also multiple um like uh you see
like you have multiple situations where
you can see Naruto's response so you can
just uh print it out and yeah see how it
goes so before finalizing this just put
it into to a panda data frame and then
put it into a hugging face data frame so
that we can also train on it so you can
just write pd. data frame then give it
the um we can give it like from the text
instead of that so you can have like
this give it
prompt and give it all through the uh
prompts list that we had above and then
we can have the DF do head and you can
see the that here's are the prompts that
we have and right now we just want to
convert this into a hugging face data
set so you can go up and write from data
sets
import data
set like this and this is the hugging
face data set and you can go back down
and you can write data set do from
pandas and give it the DF and then WR
just trade data set right
there so now we're done with the data
wrangling and now we want to uh create
the model train it and then use its
inference so we are going to jump to the
py file and training the model is going
to be also some arguments that we want
to pass but the logic itself and the
code for training is going to be on
hugging face so yeah we won't have to do
any heavy lifting here except for the
fine tuning and the parameter tuning and
we are going to do one more thing in
this model which is this model is huge
and it does not fit into either my Ram
or the collabs ram so we want to have it
um we want to have some hacks so that it
can decrease in size one of those hacks
is that instead of each weight number
taking uh 64 floating points like 64
bits uh we can make it take only four
bits it would lose some accuracy but it
would fit into memory um and also we
would have a faster way of training
which is called Laura and this adds in a
couple of weights to the model that
fine-tunes it and learns uh and learns
the uh what the task is and then it
enhances the model accuracy on this task
and yeah it's a faster way to edit like
to train those large language models and
we are going to be using both so just
save this uh notebook you can go back to
character chatbot and you can create a
new file that is called
character chatbot dopy then you can just
uh write here the class which is going
to be
character
chat
bot uh then you can write the Define in
it like that then add the
self and add the model
path then also add the data
path which is going to be uh the data
pip that we are going to have on collab
uh because uh like you said like you saw
here um we don't uh like you saw here we
don't have the option whoops it's not
that one it is going to be this one so
we don't have the option to out like to
put any more data like the the model
name or the uh data set path we only
have the play for the messages so we are
going to uh write them here as inputs so
let's go back to the data path and write
just
content uh SL content SL
dat and then we are going to put the
naruto. CSV in it uh make sure to edit
this path if you are having a different
model but otherwise you are good to
go and yeah at the end we want to have a
hugging face token so let me uh get it
from here the hugging face token and we
can initiate it with
none like that so that's the init so
let's have uh the self. model path equal
model path the usual stuff then data
path is equal to the data path and then
we want to have the hugging phas token
equal the hugging phas token then what
we want to have is we have a base
model path and this is the original
model that we are going to train on and
if you open Llama here again uh like the
hugging face again and you just copy
this uh path to the Llama model and we
can paste it right
here then we can have the of course
self. device and it's going to be Cuda
if torch is available not if it's going
to be CPU and we can have the import TCH
right
here then let's continue on if we have
the uh hugging face token so self.
hugging face token uh is not none like
that then what we want is we want to log
into the hugging face Hub so let's
import the hugging face Hub so Port
hugging face Hub right there then go
back down WR hugging face hub. log in
and you can give it the self.
token huging P
token like this and then we want to see
if the um like the model that we have
the model path that we provided exists
so if it exists we just use it if it
doesn't exist then we train it save it
and then use it uh just like we did with
the text classifier so if oops sorry
about that go back here if hugging face
Hub uh. repo
exists uh then we can see what rep we
want which is going to be the model
path uh then else uh sorry uh here we
are going to load the model so self.
model is going going to be
self. load model and then give it the
self do uh model
path else what we want to do is that we
want to train it and then load the model
so let's have it here like a print
statement that is called Model not
found in hugging pH hub
we
will train our own
model then we are going to have the
train data
set and we are going to have the
self. load data like this after we uh
train we after we load we then train and
then after training we load the model so
load
model of course we don't have the load
model yet and we don't have the load
data yet so let's create those and then
uh come back to training and then
loading the model right there so let's
start with the uh load model function so
uh sorry load data function so Define
load data and give it the self and then
uh we can just copy paste most of it
from our notebook so you can scroll back
up and you can uh read it
first uh pandas is not imported of
course so make sure to import
it and uh let's create a space right
here then this data set path needs to be
self. data set path um afterwards let's
drop any na a so drop any non values and
then we can apply the same uh functions
that we applied before so just we can
just copy paste this right
there and import
three so this is the function that
remove the parentheses and we can go
back here and we can just remove the
parenthesis like
this then we want to calculate the
number of words so the number of words
is going to be those two
lines uh then we want to have the
response flag so you can go back down
and see the response flag that we have
right
there then we want to uh choose the
indices to take so let's uh choose the
indices right here and afterwards we are
going to build the prompts like we did
before so just copy it paste it right
here make sure that the indentation is
correct like
this and yeah so right now this is uh
this is correct and we can just add it
in the DF and make it a pandas data
frame and then make it as a hugging face
data set so like just like we did before
we don't have to write it I was going to
but we already have it so I wrote it
here and then you can just like create
it as a data set right there and return
back the data set of course the data set
is not imported so make sure sure to
import it first so go back here in
from from data sets import data set and
now the load data set is
done and afterwards we just want to have
the train function so let's train the uh
let's have the train function and then
uh continue with the load model uh so go
back here and write Define train
and it's also going to take a couple of
parameters so it's going to take the
self then it's going to take the uh
model name or path which is going to be
uh this name which is in the hogging
face uh hugging face name this one uh
then you can write the output
directory where you can save uh your uh
where you can save your
weights and you can have the per device
train batch and set it equal to one
because it's a huge model and we might
not have more uh memory for like a
bigger batch and we want to have also
the eval batch is equal to one and then
we want to set the
Optimizer um which is going to be going
to be
paged
Adam W
32bit and this is a little bit
lightweight on memory on CPU then we can
have the save steps and we can save
every 200 steps and afterwards we want
to have the logging so logging steps is
is going to be after 10 uh steps so
logging
steps is equal to
10 then we want to have the learning
rate uh learning rate is going to be
equal to 2 e
-4 and let's have the
max grad uh Norm is equal to
0.3 uh then let's have the max steps is
equal to 300 let's only make 300
iterations
and let's also have a warm-up ratio uh
warmup uh
ratio is going to be equal to
0.3 and last thing is going to be the
Learning grade schedular type it's going
to be constant so we don't uh change it
over time and yeah this is going to be
the training arguments it's a lot but
it's all what we are going to need and
like I said before we are not going to
load the model uh like normally we are
going to make it four bits and then load
those so that it can fit into memory so
we are going to lose a little bit of
accuracy from this but it's going to fit
into memory and we don't have to uh look
for bigger machines or something like
that so uh for that we are going to use
something called bits and bytes config
so uh let's import it first
so you can go back to Transformers like
from the input so
from
trans
M
import then
bits and bytes config we want to also
like um put the
auto uh model
for casual
llm and this is the Casual language
large language model and then also
import the tokenizer uh then we can go
back down and start initializing those
so we can have the bits and bytes config
and then we can have the
load in four bit which is equal to true
so we are going to be loading only four
bits and then we can we want to um
specify what algorithm we want to have
it to make it for bits and so for that
we are going to have BNB then uh specify
the qu type is going to be
nf4 and U we are Al we also want to have
the compute D type which is the
computation uh when we're doing
computations what is the data type that
we are going to use uh we are going to
make it 16 bits for that so let's have
the compute D type which is equal to
torch Dot
float and it's going to be 16 and this
is the bits and bytes config that is
going to make the model um weights 4 b
instead of 64 or even
32 then let's initiate the model so we
can have the model equal Auto model for
sequence classification then we can give
it the base model and after the base
model we want to um we want to also give
it the bits and bytes config so it's
called Quant
ization quantization config equ will BNB
config and the last thing is that we
want to
trust
remote
code code equal true and let's not use
any cach if we have it so let's have the
have It Like get it from the huging face
Hub if it can so config do use cash is
equal to false and then let's import the
tokenizer so
tokenizer is equal to O2 model tokenizer
Dot from
pre-trained and then give it the
base model or name I think I've
misspelled it yeah so it's called Uh
model name or path let's call it
base model name or path just copy it
make sure to put it in the pre-trained
when we're loading the model and then
make sure to also have it in the auto uh
model tokenizer and I think I copied it
wrong so copy it uh paste it right here
and also paste it right
here so we can go to
tokenizer and we also want to uh specify
the padding token uh so we can have the
padding token is equal to the end of
statement padding token
and now we want to have the low configs
that enables us to have some weights in
additional weights next to the model
that is going to be trained and is going
to enhance the model abilities instead
of training the uh full model and taking
a lot of time and also resources so
let's have the Laura
Alpha is equal to 16 then we are going
to have the
Lura drop out and and it's going to be
0.1 and Aura R is going to be
64 and uh for the Laura config we need
to install uh something in the
requirements that is called uh PFT so
you can go back again to your Google
write
install PFT then uh go to the first link
which is the huging face link and then
you can find here that it is installing
it using git so you can just copy it uh
paste it right here like this and you
can write dog
afterwards and then it also requires you
to install something called TRL TRL so
TRL is equal equal than
0.9.6 and also we know we need to also
install the bits and bytes config uh so
bits and so bits and
bytes and also give it the 0.
43.3 those are the exact uh ones that
I'm using so just save it make sure that
you install it so right here you can
just clear this and pip install
requirements actually- R requirements
make sure that you have all those
libraries in and you can also have the
Lowa config right here so we can go back
up and uh import it
so you can have from
PFT
import
Laura uh Laura
config and PFT
model and also from crl
import sft
config and sft model and sft trainer
sorry like that so this is what we're
going to use here so you can scroll back
down and in the lower section and we can
start initiating the uh Lura object so
from here you can have the
PFT config which is equal to the Lura
config and then basically give it uh the
things that we initiated Above So Laura
Alpha is equal to Lura Alpha and then
Laura Dropout is equal to the Lura
Dropout Lura R so this is just called R
here so it's going to be equal to the
loraa r then have the bias is equal to
none and then have the
task type is equal to uh
casual um
LM and yeah this is how we initiate the
L configs then let's initiate the
training arguments and for that we can
have the
training
arguments which is equal to the
sft
config and we are going to specify the
output d as the output D
per per device uh train batch is equal
to the per device chain batch size and
then we have the per device eval batch
is equal to the per uh actually we don't
need this so we are going to have the
gradient accumulation steps which is
gradient accumulation steps is equal to
the gradient accumulation step that we
have above and we don't have it above so
just have it right here gradient
accumulation steps is going to be equal
to one and this eval we don't need so
you can just go back here and just paste
it right in then you can specify the
optimizer equal to the optimizer and
then you can save the uh specify the
save steps uh let's close the bracket so
that it uh let us uh have the auto
filling save steps then uh logging steps
is equal to the logging steps learning
rate is equal to the learning rate uh
fp16 is equal to true so we are going to
make this floating Point 16 uh to fit
into memory and then we can have the max
grad norm and then we can have the max
steps then we can have the mor up ratio
then we can have the
group uh by length uh just to make the
training uh more optimized to have the
similar length closer to each other then
the SCH uh the schedular type is going
to be equal to the sched type and we
already have all those defined in the
parameters above so that's why I'm
skipping like skimming through them then
report to
report to and then we are going to
report to none we don't need to report
to um anything like d like weights and
biases and things like that and make
sure to have this as the correct uh
bracket and yeah I see no more squiggly
l l so we can proceed with that so after
this we can have the
max
max
sequence length is going to be equal
512 and then we are going to have the
trainer which is equal to the SF trainer
and we can give it the model equal to
the model then the training data set so
let's have
the training train data set is equal to
the data set that we
have data set doesn't seem to be uh here
so let me scroll back up and see if we
have it so we don't so just have this
data set like
this and let's continue from here then
it's going to
be PFT config is equal to the pep config
uh data
set text field is equal to the
prompt and this is the prompt uh column
that we had Max sequence
length is equal to Max sequence length
and then tokenizer is equal to the
tokenizer as well and uh the last thing
is going to be providing the arguments
which is equal to the training arguments
that we specified
Above So after this we just train so
train train then we want to save the
model locally so save model then trainer
do save uh
model like
that then we want to have it in final
ckpt and let's also have this for the
tokenizer so let's save the tokenizer
also then we can just flush memory slush
the
memory and the way that we are going to
do that are going to
delete the
trainer and we are going to delete the
model then we are going to garbage
collect so GC is not installed uh is not
imported so we can go back up and write
import GC scroll back
down and gc. collect now is done so we
can have uh so now we just want to read
the model then add to it the ckpt
weights that we saved and yeah so from
from here uh actually I did a small
mistake so trainer is trainer.
model do save model do
save
pre uh
trained like
this then for the tokenizer we can also
run the save P trained on it
then for here we just want to have the
base model which is equal to the oo
model for sequence for casual llm then
we write from pre-trained then give it
the model name or path then we uh make
sure to uh
return dict is equal to True uh then we
can have the quantization
config is equal to the BNB config then
we can have the torch
uh
type torch D type is equal to the torch
float 16 and then we can have the device
uh map is equal
to the self. device that we
have like that and yeah this is the base
model so afterwards we want to also load
the tokenizer so let's have the to
tokenizer equal to the auto tokenizer
from pre-trained and then give it the uh
self. base model
path um and we can also have it like the
the one that is we sent to it so it's
called base the like I think it's going
like it's going to be the same uh value
at the end but we are passing this value
to the function so why not use it and
then we have the last Model is going to
to be the PFT model that we have that we
imported uh then from pest model just
write
from pretrained then give it the base
model that uh that is going to be the
one that we didn't have any edits on
then you can give it the uh the path
that has the trained model so that it
can combine both together then you have
the model. push
to HUB and then write the
self. model path and right now we are
going to push this to the hugging phase
Hub so that it we can download it and
use it quite easily and at the end we
want to have the tokenizer also pushed
to the hub so this is how we do it and
then at the end let's just delete and
the model and the base
model base
model and also gc. collect we don't need
it to we don't need to do it here since
we are already like uh like finishing
the
function and but yeah uh just a good
practice to have this let's also have a
comment like that and now we are done so
what's left here is that after training
we need to load the model so that it can
be used so if you go back up to
the
uh I am concerned that those are not
being
used oh yeah so you can see that there's
a squiggly line here and I have missed a
comma right there and right
there so you can just save and you can
go back up all of them are used right
now so all all
good and right now we have the uh load
model and train model so we can write uh
the train model first so
self do train then give it the self.
model Bas model path then give it the
train data set then at the end we can
load the model which is going to be
self do model equal to self. load model
and also give it the uh self. model path
that we
have and yeah right now we just need to
write the self. load model and also the
model does not will not fit into memory
so what we need need to do is also copy
paste the uh bits and bytes config just
copy paste it right here and then have
the we are going to also have a pipeline
so that we don't have to tokenize and
then um like run it to the model and
then convert the tokenized numbers into
words and so on and so forth so uh we
are going to use the pipeline here so go
back up make sure to import Transformers
we are not importing it so
import Transformers go back down make
sure to have the Transformers dot
pipeline then say it's text generation
this
time um then we want to have the model
equal model path which is the path that
we uh already trained and pushed to the
model like the hugging face uh hub
then you can have the model keyw uh
keywords or keyword arguments and it is
going to be the
torch D type is equal to uh float 16
then we are going to also have the
quantization config is equal to the BNB
config and yeah this is it at the end of
this we just want to return the pipeline
and the load model is now
done now the last function that is left
which is going to be the chat so just
take this Pipeline and run it through
the uh input that it's giving to you so
you can have
Define
chat that takes in
self messages so the message and then it
takes in the history which is a list of
messages with the history so let me show
you what history is going to be and
history is going to be like this um so
it's going to
be um hi how are you and this is going
to be from the user and the second one
is going to be from the system so I'm
fine I am
system and then we are going to have two
more so it's going to be like this so
it's a list of lists where the lists the
inside list is going to be uh two
strings only one from the user and one
from the um system and this is how
actually like gradio uh like wrangles
this data and puts it into this
convenient format it's ready made for us
and it's ready for the chat system so
we'll have to Wrangle it a little bit so
you can have messages equal to an empty
string then let's add the system prompt
add the system prompt and we can have it
as messages do append and you can write
the same uh
Naruto uh system prompt that we had
right here uh you can delete first space
copy this and then uh come back here and
append
it then for message
like this and
response uh in
history then what we want to do is that
we want to append
messages append where rule we are going
to add it as a dictionary so where rule
is going to be equal to the
user then the content is going to be
equal to the messages and response of
zero like that so this is going to be
the messages where the role is uh where
the like the messages from the user then
we want to have the message from the
assistant so it's going to be assistant
like this and like I told you it's going
to be zero and one where one is from the
assistant and zero is going to be from
the user
and afterwards we want to append this to
the uh like this is all appended to the
messages and at the end we just want to
append the final um the final uh message
from the user which is the current
message so messages like this do append
then give it the role uh of user then
give it the content which is going to be
message so just paste it right here and
and yeah there is an
issue so the issue is is in the
indentations I think there is some weird
stuff with the indentation so just I'm
going to fix it so it's right here right
there and I am going to have it like
this so everything is working fine right
now and uh we can also add Terminators
uh like if uh if the uh if the model
outputs any of those it can terminate
the uh it can terminate the generation
so it's going to be self. model.
tokenizer and is going to be the end of
sentence uh token that is normal and the
other one is going to be um also an end
of sentence token uh but we are going to
convert it so convert tokens to IDs and
also give it here the end of sentence so
it's going to be something like that
e o tore
ID so those are two end of sentence
tokens that we are going to generate and
at the end we are going to just run this
uh through the model so self. model then
give it the uh messages uh so messages
then pass in the maximum length so
maximum length is going to be max length
is going to be
256 uh we don't need a huge uh output
response and then uh we want to have the
end of sentence token ID so
EOS uh token ID which is equal to the
Terminators and then do sampling which
is equal to true so every time we run
the same thing we can have a little bit
of the different response and the
temperature is going to be
0.6 and we are going to have the top p
is equal to the 0 9 temperature is
basically how random the output should
be and 0.6 is around the half so yeah
this is going to be um like pretty
controlled
randomization so output
messages uh message is equal to the
output of this going to be zero then
going to be the generated text uh then
we have uh equal to 1 like it's going to
be we want to only get the output at the
end so output here is Miss uh Mis
written so make sure to have the correct
output and then return the output
message and we are now done so the
chatbot system is now done and we can
have the
init P1 y then say from
dot
dot character chatbot like
this
import character
chatbot and then we can go back to
gradio and write the uh UI for that
bit so uh go back to the gradio
application then scroll down and in here
uh you can have the uh
character chatbot section and we can
have with
gr. true uh then with
gr.
column then we are going to have gr.
HTML uh then we are going to have the H1
the normal H1 tag that
uh have the uh title of the
section and we are going to write the
character
chatbot and then we want to have the
gr. chat interface and this like builds
the whole chat interface and we just
give it the function so chat with
character chatbot like that save it and
then you can go back up and write this
function go back up here and Define do
character chatbot it takes in two things
it takes in a
message and history and uh actually Gro
is who's like it's providing the message
and the history and it's keeping the
history in memory so that every time it
calls it it uh like gives you the whole
history in and this is pretty cool so
that you don't have to have this logic
in and you can first like initiate the
character chatbot so
character chatbot is equal to the
character chatbot so let's import it so
from character chatbot import character
chatbot uh just copy this come back here
paste it right in and say that uh you
want to have this I already have
also um a model that I used while
training uh while preparing for this uh
tutorial and it's called Naruto Lama 3B
uh I am also going to train one from
scratch with you guys so it's going to
be underscore
2 and I am also going to provide a
hugging face
a hugging face token like the one that I
did before so just copy this and paste
it right in and now we can have the
output after this we can have the output
character chatbot do chat then give it
the message give it the history and then
we for the output we want to have the
output of content dot strip and then
return
back the output
and yeah this is it the only thing that
concerns me is this uh squiggly line so
just maybe copy this make sure that it
has the correct spelling make sure that
this also has the correct spelling copy
this put it right here then character
chatbot make sure that it also has the
correct spelling right
there and everything seems to be working
fine I think the squiggly line will go
away after some time
so just save it then get status get
add we can add gradio the requirements
we can also add the
character
chatbot and get status
again and this is it uh also I can see
that there's an edit that happened on
the uh python uh the python notebook for
text classification so you can just get
the diff see what it
did uh you can actually not see much uh
from the yeah you can see this so yeah
you can just add
it and get commit DM character Network
character chatbot then get
push clear and now we are good to go
let's go now to the uh to here and we
did not close it so that consumed a lot
of GPU time that we actually needed but
yeah let's uh stop it then let's go back
up so you can go here you can just uh
manage sessions just close this
terminate and have a fresh start so you
can clone this then install the
requirements like that then install the
P Spa like the Spacey requirements then
have the uh token and also have the
grade application
running uh also it's going to take a
little bit of time to initiate so going
to cut the video and come back when it's
done so now it's finalizing while it
does just create a new folder called uh
data like this you can also uh upload
the Naruto data set so you can have here
upload the naruto.
tsv and you can see that we also have an
error right there which is cannot import
character chatbot and this is what I
feared uh this uh squiggly line means
something so uh from here you can have
the character chatbot let me make sure
that the spelling is correct character
chatbot then the init.py
is
also uh might be correct so let's have
this character
chatbot and let's also get the naming
for the character chatbot
correctly like
this and here let me write the charact
ah so the character chatbot was
misspelled right there so this B was uh
small case it should be oper case and
you can just copy it it still has this
Squigly line so I'm not uh so I don't
think that I'm off the hook yet so you
can just save it get
status you can see that Gru right here
uh has the edit so you can add the
gradio get commit
dasm uh
fix uh the um chat
bot and that is it good put
push then we can go back up here we can
uh I think it has an error so we don't
have to stop
it then we can just pull
that we don't have to install the
requirements again since we didn't add
anything to the requirements go back
again to the gradio just uh run it
so now it's working good so we can just
copy this
URL and paste it right
in and we want to have this data uh so
this data is in place so we just have it
and we already we do we do not provide
it so it's going to be like it is uh
fixed in the par parameters of the
character chb so I can just write
what's your dream and right now let me
go back here and uh I have written that
I needed to push this at Abdullah tar at
Naruto LM Lama 3 and underscore 2 I am
doing an underscore 2 to train it with
you guys so you can have this also right
there I have the underscore because I
started before so let me delete
it let me delete this so you can go back
here you have this while I was doing it
with uh like the previous uh preparation
for the tutorial and now I don't have
the underscore 2 so it should start
training uh from scratch and yeah so let
me write uh submit it and see how it
goes
so you can go back here and see the logs
that it is now trying to uh download the
model so I can uh cut the video and
return back when it's
done so I got an error that as the
quantization error config does not exist
and I think I missed an a here so it
should be
qua so go back here
go back to your character
chatbot and make sure that you're
training the model and in the
quantization let me go back let me go
here in the quantization config where is
it yeah right there so it's
quantization config
and we are going to pass in the B&B
config so this
one so let me just uh make sure that the
spelling is correct so is qua
NTI Za a t i o n then it is underscore
config then it's BNB config so just save
it get status
uh go back to your get add then get
commit dasm just write fix CH
bot get
push then you can go back here stop
this and uh you can run get
pull it's now pulled think it as yeah so
it's now pulled you can go back here you
can run
it wait for the URL to
appear and then we can just write the
what's your dream again so this one
so now it is there so we can just write
what's
your
dream then it should load the model uh
faster this time since it has it into
the um
disk so yeah I'm going to cut the video
and come back when it finishes or
crashes so see you then
so I got another error that is called
Max seen and yeah make sure that it is
the correct one which is Max sequence
length and not Len so we can just get
add get commit get
push and yeah I think afterwards it's
going to have the training the they've
pre-trained everything should be working
fine but yeah uh I'm going to try again
so you can go back here stop this go
back up then get pulled then go back
down then go back
down and write the uh run this
again wait for the URL to appear
just copy this paste it right
in write here
what's your
dream then press enter it is running
and yeah I'm going to cut the video
again and um come back when it's
done so one so one more edit before it's
now done uh uh here it was uh just the
string which is the system prompt like
this uh just add it as a dictionary and
add the role equal system and add the
content I forgot to add this so if you
add it and and save it and push again
and pull it and run it again and you can
see here that the output is now done so
yeah this is the uh this is the
character chatbot and right now you
learned how to create your own character
chatbot on whatever task you want and we
have used also one of the state of the
art models and it's also a big one so
that is a huge Plus for us and it's very
good to put llama in your CV and yeah so
in this project you have learned a lot
so you have learned a lot about theme
classification character Network and
text classification so I'm going to
recap them I'm just going to put the
themes again and make sure that
everything is working for you guys H so
for the theme classification just just
copy paste the themes like this and say
that we have a safe path that is in the
tubs right here so make sure to use it
oh yeah so we didn't push the stubs so
we can do so um actually let's upload
them for right now and I'm going to push
the stubs for you uh when I have the
chance so I am going to try and push the
stubs and also the data to the GitHub so
that you can conveniently uh download
them and uh find them uh because last
time people had uh trouble finding it on
kagle so uh they have been uploaded so
you can just have have the theme
classifier output just copy it path put
it right here press this and for the
anyr path you can just copy
this put it right here and wait for the
text classification to
finish and also Let's uh go to our model
right there add theju classifier just
copy this uh also note that after
training uh right there after training
here here uh we have a new model that is
called Naruto Lama uh uh 3B 2 and I'm
going to remove this and only keep the
one that I originally made but yeah so
the model was also pushed to the models
right there and I am also going to edit
it in the uh gradio where it reads from
the not underscore 2 but from the normal
model so I'm going to make it I'm going
to remove this and push it to the
GitHub and yeah so those actually models
are not personal I think they're public
so everyone can use them so you can go
ahead and use them if you want and yeah
uh go back again to your visualization
you can see here that the uh theme
classifier is already done uh draw the
character
Network and the model path is the jutu
classifier let's also get the resend gun
description like we did before so like
this
make sure that the character network is
good so yeah that is good uh classify
the
text so yeah so that is beautiful so
everything now is working fine so we
started off by uh crawling our own data
set from the uh from the narutopedia
fandom uh website um and we used uh
Spacey for that which is a good tool to
have in your TV and then uh we learned a
lot about neural networks and the
evolution of NLP then we started with
the theme classifier and we learned a
lot about zero shot classifications and
we created our own zero shot classifier
on the and ran it on all the subtitles
and save the results we also have the
character Network so we used NE R and we
used a very good Library called Spacey
and in between use a library called nltk
to use sentence tokenizer and to use
other functions as well those two uh
those two uh libraries are very
important when it comes to neur NLP and
afterwards we trained our own llm and we
used here another uh model that is
called dist still birth so we gave it
any text and it was able to classify it
into three classes which is ninjutsu
genjutsu and and and uh Tai Jutsu and
afterwards we created our own chatbot
and we now can run our own chatbot and
we can actually have it um like produce
more conversation and we can ask it more
things and yeah so that is the project
if you made it this far then
congratulations you learned a lot about
NLP and you are more than qualified to
land a midlevel NLP job and this like
this project is Beast so make sure to
add it in your TV and you can also add
it like in three different or four
different uh projects together like have
it for different projects if you want or
just put it into one big project um all
those skills that you have learned this
uh in this all those skills that you
have learned in this tutorial are very
very important for NLP and in AI in
general so make sure to add them out the
only thing that is left for NLP right
now like you you learned a lot you
learned about CL classification zero s
classifiers chat Bots and also anys so
the the the only thing that is popular
that is in my head right now is using
chat gpt's API and if you haven't done
this already uh I have a tutorial online
on YouTube that is also uh using CH GPT
for text classification you can find it
it's U I think it's a quick tutorial
like 20 minutes so if you do that then
you have a full arsenal uh that you can
utilize for NLP and most uh most
employers will only look for those
skills so congratulations again on that
and yeah see you in the next tutorial
have a wonderful day