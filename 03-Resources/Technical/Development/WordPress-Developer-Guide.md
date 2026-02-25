# Become a WordPress Developer: Unlocking Power with Code (01j0thhj8jb8h1zjr5p4crh1jh)

Source: Become a WordPress Developer: Unlocking Power with Code (01j0thhj8jb8h1zjr5p4crh1jh).html

hello everyone this is the first three
hours of my 26 hour premium WordPress
course I hope this helps you get started
learning and experimenting with
WordPress have fun and I'll see you
around if you want to unlock the full
power of WordPress by learning about
code you've come to the right course
because I've spent the last 12 years
living and breathing WordPress PHP and
JavaScript and now I'm here to teach you
everything I know
here's a quick summary of what we are
going to learn we are going to create a
completely custom interactive site for a
fictional university in order to do that
we need to learn how to install
WordPress on our personal computer so
that we have a private playground of
WordPress to practice with the very
basics of the PHP language which is what
powers WordPress how to code a brand new
theme how to create custom post types so
beyond just blog posts and pages we will
set up post types like professors and
campuses and events and programs or
majors how to create relationships
between different pieces of content so
for example we can associate a professor
with the matching programs or majors
that they teach how to create an
interactive map powered by our campus
posts how to create a JavaScript powered
live search feature we will allow open
registration so anyone can visit our
site and sign up for a basic account we
will leverage the WordPress REST API to
create a my notes feature as well as
another feature that lets users like or
Hart a professor in real time on the fly
and much much more now I would love to
have you come along on this journey with
me and if you're ready to launch your
career as a wordpress developer I will
see you on the inside
hello everyone and welcome to the course
in this video I want to give you a
bird's eye view so you know what to
expect big picture the goal of this
course is for you to learn how to code
completely custom websites with
WordPress we are going to build the site
together for a fictional University and
along the way we will slowly but surely
become a wordpress developer first I
will have you install WordPress on your
personal computer so that you have a
private playground copy of WordPress
that you can practice and experiment
with next we will take our first look at
the PHP programming language this is
what powers the core of WordPress but
don't worry you don't need any prior
experience with PHP after that we will
learn how to code and create a brand new
theme after that we will learn how to
create custom post types there is an
entire world of WordPress beyond just
posts and pages for example let me show
you the admin dashboard for our finished
product in this course in my sidebar we
see posts and pages just like in a
normal WordPress installation but I've
also got campuses and events programs
professors notes
likes and each of these post types has
its own unique set of fields instead of
just a generic title and body field so
for example if I click on professors and
then if I click to edit my professor
named dr. barks-a-lot yes we do have the
generic title and body field but we also
have page banner subtitle and page
banner background image which if we view
this post on the front end those fields
control this background image that is
unique to just this professor page here
we see the page banner subtitle just for
this one professor and also if we scroll
down a bit we see this related programs
field
so in this left-hand column you can
choose from the
different programs or majors that are
available at this school and you move
them over here to say which one this
particular professor teaches and then
this relationship between professor and
program gets reflected on our front end
so on this professor page if I scroll
down we see subjects taught biology this
allows us to create relationships
between different pieces of content and
this opens up all sorts of possibilities
so for example if I click on campuses up
in the header we've got this interactive
Google map with pins on it and each pin
is a campus post so for example we've
got our downtown West Campus and if I
click on that it takes me to that detail
screen for just this one campus and if I
scroll down we can see programs
available at this campus math so long
story short custom post types and custom
fields allow us to programmatically
relate different content together in
really compelling ways ok after that
section of the course we will move on to
learn about JavaScript our first big
JavaScript project in this course is to
power our live search results so for
example I can either press the s key on
my keyboard s for search or just click
this search icon up in the top right and
that opens up this full screen
transparent overlay and my cursor is
automatically placed in this search
field so I can just start typing for
whatever I'm searching for and on the
fly in real time we get our search
results and not only that but they are
organized by the content type so I
searched for biology here we have any
related blog posts or pages programs
professors related campuses and even any
upcoming events that have to do with
biology now there's really two main
aspects to the JavaScript here part one
is the JavaScript to power the actual
user interface
right opening and closing the overlay
and responding to click events things
like that and then the other aspect of
the JavaScript is actually communicating
with the WordPress server on the fly in
real time right because when someone
searches for something we need to send
that search string to the server and
then on the other hand we also need to
receive this incoming data from the
server and all of this needs to happen
in real time so this is a great exercise
to learn all about JavaScript I think
you're gonna love this portion of the
course just a bit of a spoiler the
WordPress REST API is what makes all of
this possible and very elegant to set up
ok then in the next section of the
course we will learn about user roles
and permissions so if you want to have
multiple people help maintain the
website you do not need to give everyone
administrator access so for example if
you wanted to invite a friend or a
co-worker and the only thing you wanted
them to be able to do is manage the
event post type you could set that up or
if you wanted someone to be a campus
manager you could restrict them to only
be able to change those type of posts or
you can mix and match different
permissions maybe someone should be able
to post into the blog and manage
programs but that's it the possibilities
are endless and learning about roles and
permissions will really open up new
collaboration doors moving on in the
next section of the course we will allow
open registration so for example if I
log out I'm currently signed in with my
admin account but I can click logout and
then if I visit the website again you
can see that if a stranger visits the
website they can log in or even sign up
so with open registration any random
visitor can sign up for a basic account
and once someone with a basic account
signs in that gives them access to two
new features the first feature is my
notes and in this portion of the course
we really see
our teeth into the WordPress REST API we
basically create our own mini single
page application so if a student brings
their laptop into a lecture hall they
can take a note biology note number five
and take a few notes right lorem ipsum
class was amazing
click create note on the fly it gets
added here and saved into the database
they are free to create another note
math note number one did you know that
two plus two equals four it's true go
ahead and click create okay and then
from their existing notes they are free
to make edits they can click this to
change the title click Save all of this
gets saved into the database on the fly
and they can also delete one of their
notes in real time the other feature
that basic logged-in users get has to do
with liking a professor so maybe if I
navigate to the doctor barks-a-lot
professor page you'll notice this little
heart box currently it says 1 to
indicate that one other person has liked
doctor barks-a-lot and notice the heart
is hollow but if I click on it the heart
fills in to indicate that I personally
have liked this professor and you can
see their light count went up by one and
thanks to JavaScript and the rest api
all of this happens on the fly so if I
immediately decide that actually I don't
like this professor you can just click
it again to toggle or remove your like
and all of this data is getting saved
into the WordPress database after this
section of the course I show you how to
push or deploy your website live up onto
the web so that the entire world can
view it and if you don't have a web
hosting account to practice with that's
okay this course gives you access to a
free three-month educational hosting
plan and it really is free in the truest
sense of the word
you do not even need to enter a credit
card or any form of payment so there's
no way they can automatically bill you
at the end of the three months okay so
that way everyone has access to a web
host so you can practice deploying a
site live and it's not mandatory but if
you're familiar with the git version
control system you are really going to
love the automatic get deployment setup
that I can show you and finally we end
the course with a few extra credit
challenges so there's the bird's eye
view of the course I'm really excited to
get things rolling my goal for this
course is to give you lots and lots of
small victories each time we finish a
small little feature or section and
things work the way we want them to I
want you to relish that small victory
because each time we write code and
accomplish something with it we are
moving closer to our career goals and
that's something to feel good about so
let's get some momentum rolling let's
get things started and most importantly
let's become a wordpress developer hello
everyone in this lesson we will answer
the question where do we begin so
whenever I'm helping someone learn
WordPress development I always say that
the first step our first priority should
be setting up a dev environment for
ourselves so that we can work locally
now don't worry I do not expect you to
know what that means
in order to explain what that means
let's ask ourselves two new questions
what in the world is a dev environment
and what does working locally mean let's
start with a dev environment the best
way to explain what it is is to begin
with its opposite the opposite of a dev
environment is your real website that
the entire world can see so in the past
you might have purchased a domain name
like your own dot-com org and you might
have also purchased a web hosting plan
and used WordPress to create a website
in the industry we refer to that real
website that the entire world can see we
refer to that as your live environment
or your production environment
on the other hand a dev or development
environment is a separate copy of your
website that is usually configured so
that only the owner or developers of the
website can see it so a dev environment
is a private safe sandbox or playground
to experiment in and no one from the
general public can see your
work-in-progress website ok so that's a
dev environment now let's answer our
other question which is what does
working locally mean so local is the
opposite of the cloud local refers to
your personal physical computer so for
example right now I want you to picture
two things number one your personal
computer and number two a server that
lives a thousand miles away from you now
the files that make up a website usually
live on a server that a web host company
maintains the web host company leaves
that server computer on 24 hours a day
seven days a week so that people can
access your website around the clock and
that means that WordPress and our web
sites usually live on a server not on
our personal computers however it is
possible to install WordPress on our
personal computers and that will allow
us to create WordPress websites even
when we don't have an internet
connection now granted these won't be
real websites because no one else can
view them it would be like saving a word
processing file to the desktop of your
computer you're the only person in the
world who can view that word processing
file because it lives on your physical
computer ok but long story short that
process of working from your computer
instead of connecting remotely to a
server somewhere that process is called
working locally now if we put these two
things together if we work locally
within a dev environment it creates the
perfect conditions
for coding custom websites because if we
make a typo while coding it won't be a
big deal because no one will see the
error messages except for us all so we
won't need to constantly upload new
files to a server because anytime we
save a file on our computer our local
private websites are just immediately
instantly updated and then only when
we're finished coding our website only
then do we push our files up to a real
public web server for the whole world to
see ok so if we want to work locally we
need to install WordPress on our
personal computers but that's a bit
trickier than it may sound so here's a
metaphor or an analogy for you if we had
a tree that we wanted to plant we can't
just throw that tree anywhere right we
can't just throw the tree on cement and
expect it to live and grow a tree needs
a particular environment it needs an
environment with soil water and sunlight
well it's the same thing with WordPress
we can't just plant WordPress anywhere
on our computer WordPress needs an
environment with the following three
things number 1 PHP number 2 Apache or
nginx and number 3 my sequel or Maria dB
now don't worry I do not expect you to
know what any of those things are but
for now just know that our personal
computers need to have these things in
order for WordPress to run now most
computers do not come pre-installed with
these things so we need to go out and
get them but luckily these three things
are completely free and there are lots
of different tools out there that will
automatically install all three of them
for us right so all of the tools listed
on the screen right now they are free
and they all do the same thing they give
us the metaphorical soil water and
sunlight that WordPress needs in order
to run on our computer so we don't need
all of these tools we just need one of
them now if you've dabbled with
WordPress development in the past you
might already have one
these tools installed on your computer
if that's the case you can keep using it
you do not need to install another one
but if you're brand new I don't want you
to feel overwhelmed with all of these
choices so right now
why don't we install local by flywheel
together step-by-step this is my
favorite tool of the bunch and it's
super easy to use so in a new tab in
your web browser search for local by
flywheel as of this recording the
official URL is local dot get flywheel
com
okay then go ahead and click the big
free download button and proceed to
download the software you might have to
enter your first name or an email
address or basic info but the software
is completely free you will not have to
pay even a penny the download file is a
decent size so it might take a while to
download you might need to go grab a
coffee while you wait but once the
download completes jump into your
computers downloads folder and go ahead
and begin installing the program the
installation process should look
something like this and this could take
up to several minutes so be patient when
it completes it should then give you
this option to create a new site go
ahead and click that we need to give
this new site a name just to follow
along with the course why don't you name
it fictional university personally I've
already created a site with that exact
name so just for this demo I will say
amazing College
let's click continue we can go ahead and
use the preferred default options so
continue again and here you get to
choose your username and password just
choose something that you can remember
and also enter your email address then
go ahead and click add site I'm not
interested in setting up a default
password right now so I just click not
now and this might take a few minutes to
complete but when it does we now have
our own local dev environment copy of
WordPress up and running on our personal
computer so you can just click this view
site button if that's not available yet
you might just need to start your
website up in the top right corner but
once it's up and running just click view
site and here we have a brand new
completely fresh copy of WordPress up in
the address bar you can see that it gave
us our own fake local dev domain it
basically told our computer that if we
visit this domain instead of looking out
onto the Internet just look within our
own personal computer and this means
that you are the only one in the world
that can view your website if you shared
this domain with a friend or family
member they would not be able to see
your website yet cool so you've got your
own private playground copy of WordPress
that you can experiment with if you want
to log in as the admin of the site up in
the address bar at the end of this
domain just add slash WP dash admin
press enter enter the username and
password you chose just a moment or two
ago cool and here's your typical
WordPress admin dashboard now let's
pretend you've been working and
experimenting for a while and you're
done for the day to shut things down
just jump back to the local by flywheel
application we can click stop site up in
the top right corner ok and then you're
free to close the program now let's
imagine it's the next day and you're
ready to start working on your WordPress
site again just open up local by
flywheel
it could take several minutes to load
but once it does just click on your
website that you've created here okay
and then in the top right corner we just
need to click start site cool so now
it's running again so now back in your
browser you're free to use your website
again you might need to refresh and
remember that if you forget this URL you
can always just click view site right
here okay now there's only one more
super important thing that I need to
tell you right now before we move on I
want to show you where on your computer
your new website files actually live so
right here where you see your website
listed if you right click on that if
you're on a Mac you can choose reveal in
finder if you're on Windows it will say
show in folder or something similar
basically we're looking for the folder
or directory where the website lives so
click on that option and that will show
you the folder for the current website
that you're working on if you're
wondering where this lives it's inside
your user accounts home directory if
you're on a Mac within your home folder
you will now see a brand new folder
named local sites right and that
contains our projects if you're on
Windows you will have a new folder named
local sites within the base of your main
user folder so it would be sitting
alongside your downloads folder okay now
before we bring this lesson to a close I
want to show you where the actual
wordpress files themselves live so
within local sites within our project
folder dig into app and then public and
here we are we are going to be spending
a lot of time in this folder in this
course these are the system files that
actually power WordPress perhaps the
most important folder is named WP -
content if you look inside it we see
another folder named themes and inside
there is a folder for each theme
that you have installed now in this
course we are going to be creating our
own brand-new theme so very shortly we
will be setting up a new folder here and
that's where we are going to do a lot of
our work now at this point give yourself
a pat on the back because you've
completed the first step towards
becoming a wordpress developer you now
have a local dev environment but
remember that not everyone in this
course is using this same local by
flywheel setup so before we bring this
lesson to a close I just want to stress
one thing to you and that is that even
if in future lessons
my screen doesn't look exactly like your
screen that's ok and even if I'm working
in a slightly different folder like
personally in my case my websites live
on my desktop right in this lower case
local sites folder that's not important
so just know that throughout the entire
course when you hear me say that I want
you to jump to your project folder or
your WordPress folder or your theme
folder just know that you are in the
right spot for you I just want you to
open up your project within your local
sites folder jump into it then jump into
app then jump into public ok this is
really the only folder that you need to
worry about throughout the entire course
I'm usually going to tell you things
like now I want you to jump into WP
content cool now that's gonna bring this
lesson to a close and now that you've
set up a local dev environment for
yourself we can really start learning
how WordPress works in our very next
lesson we are going to get our first
taste of PHP which is the language that
powers the heart and soul of WordPress
this is going to be a lot of fun so
let's keep things rolling and I will see
you then
hello everyone in this lesson we will
get our first taste of PHP which is the
language that WordPress is written in
now working with a programming language
might sound intimidating at first but
that's why we're going to walk through
this together step by step at a nice
pace
so without further ado let's get started
okay in our previous lesson we set up a
local dev environment copy of WordPress
for ourselves and now the question
becomes how and where can we get our
first taste of the PHP language well in
our previous lesson we also learned how
to find the files and folders that power
this site so for example if you're using
local by flywheel you can just right
click on your site right here and choose
reveal and finder or if you're on
Windows it should say show in folder or
open Explorer or something similar to
that go ahead and click into that folder
then click into app then click into
public and these are the WordPress
system files that power your site now
before you and I worry about doing
anything useful like maybe creating our
own brand new theme before we get to
that let's first start simple for now
let's just create an experiment file in
this folder where we can try a few
simple tests and dip our feet into the
PHP waters now it's important to point
out that you cannot use a word
processing program to create a new PHP
file or make edits to an existing PHP
file instead you need a dedicated text
editor program now most computers do not
come with a text editor program out of
the box but luckily three of the best
text editors in the world are free to
download and use so if you don't already
have a text
program on your computer I recommend you
download one of the following three the
first is sublime text this is the text
editor that I will be using throughout
this course so if you want to use the
same program as me this would be the
choice for you however there are tons of
different text editor programs out there
and at the end of the day it doesn't
really matter which one you choose they
will all work perfectly for editing PHP
code ok so aside from sublime text
another great option for a text editor
program is visual studio code and
another great free option is the atom
text editor and again you do not need to
download all three of these any one of
them will do the trick so just pause the
lesson right now and go ahead and
download and install one of these three
text editors okay and at this point in
the lesson I will assume anyone watching
now has a text editor ready to use so go
ahead and open up your text editor
program and if you don't already see an
empty screen where you can begin typing
just click on file new or if you're on
Windows you can usually just press ctrl
N or if you're on Mac you can press
command n to get a new file okay so in
this blank canvas
why don't we type out this is a test
okay then let's go ahead and save this
as a PHP file into our WordPress system
folder so click file save or ctrl S or
command S and we need to save this file
into a very specific location we want to
save it into that folder where all of
the WordPress system files live so
within your user account home folder
click into local sites then click on the
name of your site then app and then
public ok and this is that same
directory that we've already seen twice
now with the different WordPress files
and folders so let's save our new file
into this folder in the name of
new file only matters in the sense that
we don't want to overwrite any of the
existing wordpress files so why don't we
name our new file experiment and this is
the important part dot PHP so save it as
experiment dot PHP cool so now in that
same folder with all of the wordpress
files if i scroll down to the bottom
there is our brand-new little experiment
PHP now let's try to view this in the
web browser so back in your browser if
you visit your local dev environment
copy of WordPress write your URL might
be a bit different if you're using
flywheel remember you can always use the
view site button but at the end of this
URL add-on make sure there's a forward
slash and add-on experiment dot PHP
press enter and you can see we are
viewing that brand new file that we just
created now I want to point out that
this is not how you add new pages or
URLs to a wordpress website so you would
never do this in the real world on a
live public web site we are only doing
this for educational and testing
purposes at the end of this lesson we
are actually going to delete our
experiment PHP file however for the time
being this is a great place to try and
write our first bit of PHP code so why
don't we jump back into our text editor
and let's delete the this is a test
message and instead let's write a tiny
bit of HTML so we can then see how PHP
fits into the equation so just as a test
let's create a heading level one HTML
element and say this page is all about
Brad and then maybe right below that I
want a less important headline that
reads all about Brad ok let's save this
and refresh the page
all right so nothing too exciting here
this is just a bit of HTML a heading
level 1 and a heading level 2 but
remember we are not editing in HTML file
we are editing a PHP file so if this is
just HTML
what does PHP look like and what can it
do well check this out maybe on a new
line above this code type this out with
me less than symbol question mark PHP
and then a space and then a question
mark and then greater than symbol so
what does this code mean well this first
chunk that I have highlighted right now
this begins PHP mode and this chunk ends
PHP mode okay so in between those where
my cursor is right now that means we are
in PHP mode now when we are not in PHP
mode like down here right because this
closes PHP mode this code down here is
just regular old HTML but up here while
we are in PHP mode we can write magical
beautiful PHP code so check this out
type this out with me echo echo is how
you output things to the page while
you're in PHP mode so echo and then
let's write 2+2 then let's save this and
refresh in the browser and there we see
for now you might be underwhelmed you
might be wondering what is so exciting
about two plus two equals four well it's
exciting because we could never do that
in regular old HTML HTML doesn't have a
brain you just type out exactly what you
want and that's exactly what you get PHP
on the other hand has a brain it is a
legitimate programming language we can
give it equations we can tell it to talk
to databases we can have it resize
images or send out automatic emails we
can make PHP do just about anything for
us and what's cool is that the general
public that's visiting our website they
don't see our PHP code they only see the
final
product so for example here in the web
browser if we view the source of this
page it's a view page source so here we
can see the HTML code but notice we
don't see 2 + 2 we just see for this is
because PHP is a server-side language
and that means that all of our PHP code
runs on the server and then only the
result of that code not the code itself
gets sent to the visitors of our website
so in other words the server is what's
calculating - plus - not people's web
browsers let's jump back into our text
editor because practice makes perfect
I want to show you that we can jump in
and out of PHP mode as many times as we
need to so for example maybe after this
heading level 1 but before this heading
level 2 so maybe in between those two
lines I want to drop in to PHP mode and
maybe echo out the results of 5 times 5
okay and that'll be sure to close out or
end PHP mode okay and if I save this and
refresh cool so in between the two
headlines we see 25 so back to the code
you can see that in a PHP file we can
seamlessly jump back and forth between
PHP HTML PHP HTML alright now before we
end this lesson I want to have you type
out one more PHP example alright so on
this page you can see that my name is
included twice here and here now imagine
I legally changed my name in the future
I would have to update my name in both
places
now just updating it in two spots isn't
too bad but imagine if the page listed
my name a hundred times or 300 times
updating it in all of those places would
be very time-consuming so it would be
nice instead of having to hard code my
name if we could just include a
placeholder for my name right so for
example if instead of Brad right here it
just said blank and instead of Brad
right here it said blank and then we
could somehow programmatically replace
all of the blanks
my name well there's no way to do that
with regular old HTML but we can do it
with PHP so check this out up here on
this top line right after 2+2 while we
are still in PHP mode let's add a
semicolon the semicolon tells PHP that
we are done with this task and that we
want to move on to a new task so we
could begin typing right here where my
cursor is but just to stay organized I'm
going to drop down to a new line okay
and right now I'm still in PHP mode and
what I'm going to do right now is create
a variable that stores my name so type
this out with me dollar symbol my name
equals quote Brad and then just to be
safe why don't we add a semicolon at the
very end of the line to tell PHP that we
are done with this task now let's go
over this code that we just wrote so the
dollar symbol is how you create a
variable in PHP and then this text that
comes right after the dollar symbol this
doesn't matter what you type I just made
this up there's nothing magical about my
name instead we could have typed unicorn
or pizza right it really doesn't matter
what we type here just as long as it's
something we can remember so this line
of code basically creates a sticky note
in PHP 'z memory with my name written on
one side and then on the back of that
sticky note it says Brad now what's cool
is we can reference this throughout the
rest of our page so now instead of
literally typing out blank here we can
just use PHP to reference this my name
variable so let's delete this first
blank so this page is all about and then
we want to output whatever the value of
my name is so place our cursor here and
then we want to enter into PHP mode okay
and remember echo is how we output
something onto the page when we are in
PHP mode and then we just type out the
variable name so dollar sign my
okay and then let's be sure to close out
of PHP mode cool so on this line we
start out with HTML then we enter into
PHP mode to get that variable value then
we close out of PHP so then we're back
into HTML mode so we can close out the
headline let's go ahead and do the same
thing for this line so let's delete
blank and then instead of typing this
out again let's just copy and paste it
so select this PHP section copy it paste
it right here
okay now if I save this and refresh we
don't see any difference because my name
still equals Brad but now if we change
this variable to equal John Doe and save
cool it gets updated in both locations
now again it's not very impressive
because it's in only two locations but
imagine if your page was way more
complex and that name was referenced
hundreds of times you get the idea and
that's actually going to bring this
example to a close now I do want to
point out that what we just did in this
lesson has absolutely nothing to do with
WordPress this experiment dot PHP file
that we just created is not in any way
connected to the core of WordPress
however WordPress is written in the PHP
language and at this point in the course
you are now familiar with the basics of
PHP right you know how to enter PHP mode
you know how to close PHP mode you know
how to create variables using the dollar
sign and you know how to output content
to the page using echo and with just
that little bit of PHP knowledge in your
tool belt you are now ready to start
writing WordPress code or in other words
you're ready to use PHP to tell
WordPress what to do and this is where
things get fun
so in our very next lesson we are going
to use PHP code to create our own brand
new custom WordPress theme but really
quick Before we jump into that
lesson I want to talk about our
experiment PHP file if everything in
this lesson made sense I encourage you
to actually go ahead and delete our
experiment PHP file you don't need to
delete it you can keep it for reference
if you'd like to I just want to make
sure that you're aware that it's not
normal to have random extra files
sitting in the core root folder of
wordpress like this we only did this for
educational testing reasons so i would
strongly encourage you to delete this
file but it's not going to hurt anything
so if you want to keep it there for
reference that's okay anyways i'm
looking forward to creating a theme with
you in the next lesson so let's keep
things rolling and I will see you then
hello everyone in this lesson we will
begin creating our very own wordpress
theme without further ado let's jump
right into the action okay so in your
web browser go ahead and visit the home
page of your local dev environment copy
of wordpress your local domain might be
different than the one you see on my
screen right now that's not important
but let's go ahead and visit the admin
dashboard of our website you can always
visit the dashboard by going up to your
address bar and at the end of your
domain visiting slash WP dash admin go
ahead and login okay and if we were not
developers one of the first things you
do on a typical WordPress website is
look for a theme that you like right so
you might head over to the appearance
tab and switch to one of the other
themes that WordPress comes with out of
the box or most of the time you don't
want to be limited to just these themes
that WordPress ships with so instead you
might click add new here and then you
could search through the thousands of
free themes or your third main option is
to use this upload theme button in case
you purchased a premium theme from a
party marketplace okay but in this
course we are not going to do any of
that because we are not going to use an
existing theme we are going to create a
brand new theme now I know at first that
might sound scary creating a theme from
scratch but it's not scary because I'm
here to guide you through it step by
step and believe it or not it's very
simple to begin creating a new theme so
for example if I click on the main
appearance tab again here we see all of
our currently installed themes and if we
want to create a brand new theme that
will show up on this screen all we need
to do is create a new folder in a very
specific location so let me show you
what I mean let's go on a little bit of
a trip let's look for the WordPress
themes folder the first step to finding
it is just navigating to that WordPress
system folder we've already looked at
two or three times so navigating to that
folder is a bit different depending on
whether you're using local by flywheel
or MAMP orbit Nami or xampp or vagrant
and VirtualBox but let me walk you
through the local bi flywheel example so
right-click on your site click reveal
and finder click into your folder and
then app and then public okay now
everyone in the course regardless of
what you're using for your local dev
environment software everyone is going
to have these same core WordPress files
now at the moment we are looking for the
themes folder which is located in the
wp-content folder so click in to WP
content and here we see a folder named
themes let's look inside that folder and
here we see one folder for each of our
currently installed themes right so this
2017 folder corresponds with the 2017
theme so if we want to create a new
theme all we need to do is create a
brand new folder in this themes
directory so new folder and we can name
it anything we'd like why don't we call
it fictional
University theme just something along
these lines doesn't have to be exact
okay now all we need to do is create two
new files within this new folder and
then we will have a real theme that will
show up on this screen and that we can
activate so let's go ahead right now and
create the two files that we need what I
like to do is open this entire folder in
our text editor on Mac I can just drag
this folder into my dock onto my text
editor program or once you're in your
text editor program you can just use
file open and there should be an option
to just open an entire folder instead of
a file now you don't need to do it this
way I just find it convenient because
now in my text editor here we have the
sidebar of the folder and I can just
right click on it and choose new file so
I have this completely empty screen but
now if I try to save this my text editor
automatically knows that I want to save
it within that new theme folder that we
just created so what do we want to name
this file well let's call it index dot
PHP okay and what do we want to write
within the file for now let's just add a
bit of placeholder text that reads this
is our amazing custom theme save again
all right so I said we needed to create
two files so we created one of the two
let's create the second file so I will
right click on my fictional University
theme in the side bar and click new file
or you could just use your text editors
file new file option let's save this
okay and what do we want to name the
second file let's call it style dot CSS
now normally a CSS file only has one
responsibility and that's to tell the
webpage what it should look like so you
don't have to type this out because I'm
just going to delete it in five seconds
from now but normally in a CSS file you
would say that like the color of all the
text should be orange right you style
the content on
Paige well we will do stuff like that as
well but in WordPress
this style dot CSS file has another
responsibility WordPress needs us to use
this file to give it a bit of
information about our theme and the way
that we give WordPress that info is up
at the very top of the file here we
begin a CSS comment so slash and then an
asterisk that's how you begin a CSS
comment and then on another line to
close out the comment its asterisk and a
slash ok now between those two lines we
can write whatever we want so first and
foremost WordPress wants to know what
the name of our theme is so let's say
theme name colon and we don't need the
semicolon at the end here and now we can
make up whatever name we want so let's
say fictional university you might think
that we already named the theme when we
created the folder name but in folder
names you usually want to use dashes
instead of spaces so this is our chance
to use capital letters and have spaces
in the name you get the idea now if we
save this file and I want to point out
that it needs to be named style dot CSS
it can't be main dot CSS or screen dot
CSS the name here is very important
WordPress is on the lookout for this
specific file name in our theme folder
okay but with this comment in place and
we save the file if we jump back over to
our admin dashboard and refresh the main
appearance themes screen here we see our
brand new theme and if we hover over it
we see theme details and if we click on
that we can see it looks a bit odd right
it says fictional University and then
version and there's no version number
and also it says by anonymous instead of
our name so to fix those two things back
on our text editor on a new line still
within our comment we can say author
don't need the semicolon but author
colon and then
you can just type in your name here and
then on a new line we can also say
version and then we can just make up a
version number
maybe 1.0 okay so if we save this again
and then refresh our theme screen and
click on it again cool so now we see
fictional university version 1.0 by Brad
now all we are really missing is a
screenshot or photograph or a preview
image of our theme right you'll notice
that all of the other themes have a
preview image here so to add a preview
image to our new theme all we need to do
is go within our theme folder right I
named that folder fictional University
theme and we just need to move an image
file to live within this folder and the
file should be named screenshot dot PNG
now I conveniently have a PNG file
sitting on my desktop here you can find
this same image file in the resources
for this lesson but I'm just going to
move this file into my folder and then
I'm going to rename the file to screen
shot PNG ok because WordPress is on the
lookout for this exact file name and you
can use your own image here instead of
this one ideally you want the photo to
be 1200 pixels wide by 900 pixels tall
all right but with this in place if we
refresh this admin screen again cool so
now this looks like a legitimate theme
it's got a preview photo if we click it
it's got the essential information and
now we can just go ahead and activate
the theme so you can click activate down
here at the bottom or if you close this
out from this screen when you hover over
a theme there's also an activate button
right here okay so let's go ahead and
activate the theme and now if we use
this link up here to view the front end
of our website cool so remember this is
what we typed out in our themes index
dot PHP file so if we go back to our
text editor and jump back into the
themes index dot PHP file maybe I want
to add the word completely here this is
our completely amazing custom theme
save it refresh our website awesome so
now that we have our brand-new theme and
we activated it and we can see it on the
front end of our website here we really
don't have any need for all of these
other default themes like 2017 2016
right our new theme is all we are ever
going to need and since we don't want to
ever accidentally activate one of these
other themes why don't we just go and
delete them right now
so back to the folder structure here's
our theme folder that contains index.php
style and our screenshot if we go up a
level okay so now I'm looking in the
WordPress themes folder we can go ahead
and delete the folders for those other
themes 2015 16 and 17 so just select
them and delete them cool so now if i
refresh this admin screen perfect we
just have one theme and it's the one
that we created
now before we bring this lesson to a
close I want to address a CSS concern
that you might have so if you're the
type of person who experiments with
lessons along the way you might have
already tried to do the following so
back in our style dot CSS file
underneath our comment lines you might
have tried to write a bit of normal CSS
so maybe you would target the entire
page and say color orange but you'll
notice that if I save that and refresh
the website nothing happens we would
expect this text to become orange but
that's not happening so don't worry I
don't expect the CSS to be loading yet I
will show you how to correctly load the
CSS on the front end of your website
very soon okay now having said that
looking forward to our very next lesson
we will learn how to do something
actually useful here instead of just as
boring placeholder sentence we are going
to look at the heart and soul of
WordPress and PHP which is functions if
you have no idea what a function is
that's okay that's actually good because
in the next lesson we are going to start
with the very basics it should be a lot
of fun
let's keep it rolling and I will see you
then
hello everyone in this lesson we will
answer the question what is a function
instead of trying to explain with words
what a function is let me show you
visually what a function is so let's
jump into our text editor and open up
the index dot PHP file that lives in our
theme folder let's try to write some new
code here together so delete this sample
line of text and then let's drop in or
enter into PHP mode so remember from our
first taste of PHP lesson to enter PHP
mode it's less than symbol question mark
PHP and then maybe down on this line
let's close out of PHP mode so question
mark greater than symbol and then in
between those two lines so where my
cursor is now we are free to write PHP
code so remember from a lesson or two
ago we tried echoing out a math problem
right we could say echo two plus two so
if I go ahead and save this and then
refresh my website fictional University
dev here we see the answer write two
plus two equals four okay so that should
jog our memory of working with PHP now
let's have our first look at a function
so let's delete this line and let's
create our very own first function we
don't even know what a function is yet
but let's create one so write out the
word function and then a space and then
we can make up a name for our function
why don't we call it my first function
right the name doesn't really matter
it's up to us to choose a name and then
right after that we don't even need a
space let's just open up a pair of
parentheses and then after the opening
close parentheses let's add a pair of
curly brackets these are the same curly
brackets that you use in CSS so you just
hold down the shift key and then press
the key to the right of your P key okay
and in between the two curly brackets I
like to drop down to a new line just to
stay organized okay and in between the
curly brackets let's write out our echo
to
- again now if I save this and refresh
the browser we do not see the number
four we don't see anything it's just a
completely blank page and that's because
this code here that we wrote is a
function definition so really all we did
here with this code is we took the task
of adding two plus two and we gave it a
name my first function so a function
definition like we have here doesn't
actually do anything it's just a
description of an action or a task in
order to actually run this function
right and actually evaluate two plus two
what we can do is below this function
definition so maybe on a new line like
right here
we just type out the name of the
function so my first function and then
include parentheses and let's include a
semicolon at the end of that line and
now if we save and refresh we do see
four so this is how you define a
function it's like the recipe for the
action that you want to take and then
this is how you actually run or call or
use the function now what's cool is you
can use the function again and again and
again you can recycle that recipe so we
could say it again my first function
save it
refresh it and now we see a second for
this is a little bit confusing because
it looks like 44 but really it's just
the number four and then there's no
spacing and then the number four again
so let's try something a little bit
clearer up in our function instead of
echo two plus two let's delete that and
instead let's say echo out a string of
text so give me double quotes and then
let's create an HTML paragraph tag right
so the opening and closing tag and in
between them let's say hello this is my
first function and let's be sure to add
a semicolon at the very end of this line
to let PHP know that we are done with
this action okay and now if we save this
and refresh cool we see it twice because
we are calling the function twice down
here so you only have to define a
function once and then you can use it
and
use it as many times as you want so if I
copy this and paste it again so there's
three of them obviously we see it three
times okay so now that we've learned how
to create a function and then run or
call the function let's go ahead and
delete all of this and try something a
little bit more advanced so first let's
give ourselves a goal let's imagine that
we want to create these two paragraphs
hi my name is John and my favorite color
is blue and hi my name is Jane and my
favorite color is green
now when I say that we want to create
these two paragraphs I don't mean just
type them out like we see here instead
what I mean is because these two lines
are so similar to each other and the
only unique parts are the names and the
colors why don't we try to create a
single function that can generate both
of these paragraphs so let me delete
these and try this out with me up here
and our PHP area let's create a new
function so to do that we just spell out
the word function and then a space and
now we make up a name for the function
why don't we call it greet okay and then
right after that we don't even need a
space open up a pair of parenthesis and
then after the parenthesis let's open up
a pair of curly brackets and then in
between the opening and closing curly
brackets let's drop down to a new line
and then let's echo or output a bit of
text so we want to wrap our text in
double quotes okay so in between those
quotes let's just begin an HTML
paragraph tag then let's close it out
and in between those we will say hi my
name is blank and my favorite color is
blank and then at the very end of this
line let's be sure to end it with a
semicolon
okay and now right below our function
definition here so down here let's just
call or run the function once for John
and once for Jane so greet parenthesis
semicolon that will run it once and then
let's just run it a second time so if I
save this and refresh in the browser
cool we see the two paragraphs so now
all we
to do is find a way to pass information
about John from this function call into
the function itself right because we
don't want it to say blank and blank so
check this out
when we call the function for the first
time in between the parentheses let's
say John and let's do the same thing for
Jane so in between these parentheses
let's say Jane okay now back up in our
function definition within these
parentheses let's add a dollar symbol
and let's say name remember from an
earlier lesson that the dollar symbol is
how you create a variable in PHP this
isn't a special word I just made it up
we could have said unicorn or Itza okay
the name doesn't matter but for now
let's just call it name because that
makes sense right John and Jane are
names so what this is going to do is
it's going to create a variable of sorts
that we can use within the meat and
potatoes of this function so we can use
this dollar symbol name variable
wherever we see fit so all we need to do
now is just remove this blank right we
don't want that and let's replace it
with dollar symbol name okay now before
I explain what's going on here and give
you the technical names of what we're
doing let's just go ahead and save this
and test it out so if i refresh in the
browser cool hi my name is John and my
favorite color is blank hi my name is
Jane and my favorite color is blank so
let's review what's going on here and
let's build up our vocabulary so when we
call the function down here twice this
little bit of data named John and this
little bit of data named Jane those are
called arguments and within a single
function call like this you can include
multiple arguments so check this out
right after the John and quote let's add
a comma and say blue right because blue
was his favorite color let's do the same
thing for Jane
so after this first argument of her name
let's add a comma and include another
argument her favorite color was Green
okay so if we are calling a function and
giving it two arguments we better make
sure that up in our function definition
we are ready for
two parameters think of a parameter as a
hollowed-out variable or a little
container that can receive the incoming
arguments so we already have a parameter
to receive the incoming name so right
after that let's add a comma and then
let's just say dollar sign color again
the parameter name doesn't really matter
you can make it up you can use whatever
name you want okay but what's important
is that now we can use dollar symbol
color within the body of this function
so let's go ahead and delete this second
blank here and let's replace it with
dollar symbol color let's save this and
refresh cool so we see my favorite color
is blue and my favorite color is green
okay so that's how you can create your
own function and use parameters to
receive the incoming arguments so that
your function can be flexible okay now
let's change gears and bring this full
circle let's tie it back to WordPress so
the beauty of WordPress is that it comes
bundled with tons of its own pre-built
functions that we can leverage right so
WordPress has already created and
defined lots of functions and then we
just get to come along and run or call
or use those functions so for example
down here once we are out of PHP mode
right so this line closes PHP mode so
down here in regular old HTML mode let's
imagine that we want to create a large
HTML headline and we want the contents
of this headline to be our websites
overall name or title
well WordPress has a function that will
give us our website's name so check this
out in between the h1 tags let's drop
into PHP mode okay and then let's exit
PHP mode okay but in the middle of those
two let's run or call a wordpress
function named blog info okay so this is
a function that has already been created
and defined by WordPress and what this
function can do is give us all kinds of
information
about our website and within these
parentheses we just provide an argument
to tell WordPress what little bit of
info in particular we are looking for so
single quotes and let's say name we want
the name or title of our website and
let's add a semicolon right after that
just to tell PHP that we are done with
this task okay and if we save this and
refresh cool we see the name of our
website now in case you're wondering
where this is coming from let's hop over
in a new tab into the admin dashboard of
our WordPress website and towards the
bottom of this left-hand sidebar hover
over settings and then choose general
okay so see this first field named site
title that's the name of our website so
if we change this from fictional
University to amazing University and
then scroll down and click Save now if
we refresh the front-end of our website
we see that name change reflected cool
so this function blog info we didn't
create or define this function WordPress
creates it for us and then we just get
to leverage it now the cool part is that
we don't need to understand how
WordPress goes and talks to the database
to dynamically find the name of our
website WordPress abstracts away all of
those technical database details so we
don't have to worry about it all we have
to do is run this convenient function
okay and that's really the heart and
soul of 95% of custom WordPress
development it's just a matter of
knowing the wordpress functions that are
at our disposal and then running them in
the right place at the right time let's
try one more example before we close out
this lesson so let's imagine that below
this headline we want to include a
paragraph that includes our website's
slogan or tagline or description in case
you're wondering what I'm talking about
back in the admin dashboard on this
general settings screen we see that the
second field is named tagline so by
default WordPress sets this to just
another WordPress website but we could
change this to
the best university in the world okay
and then scroll down and save that okay
and then back in our code if we want to
dynamically output that tagline in
between the paragraph tag let's just
drop into PHP mode and close out but in
the middle let's call that blog info
function again and then we can give it
an argument to tell it which piece of
information in particular we want it to
return and we will say description let's
add a semicolon here and then let's save
this and refresh cool there's our slogan
or tagline and now if in the future we
ever changed the tagline from the
WordPress admin area so if I change this
to we are pretty good and then save it
our front-end web site will
automatically always display that value
okay so now at this point we are at
least a little bit familiar with what a
function is and now there's only one
more topic we need to go over before we
can start doing powerful actually useful
WordPress II things and that topic is
arrays so what in the world is an array
well that's exactly what we are going to
cover in our next lesson I'll give you a
hint
right now though understanding arrays is
what's going to let us start displaying
actual dynamic WordPress content on the
front end of our website
things like posts and pages it's going
to be a lot of fun let's keep things
rolling and I will see you in the next
lesson hello everyone in this lesson we
will answer the question what is an
array so for starters even outside the
context of programming we might hear a
car dealership say that a car is
available in a wide array of colors okay
so let's think of an array as a
collection now with that in mind let's
jump right into the code so here I am in
the index.php file that lives in our
theme folder and why don't we
head and delete all of this test code
from our previous lesson and let's try
something new so if we think back to
that first taste of PHP lesson you'll
remember that we learned how to create a
variable so let's try that again so I
will go into PHP mode down here I will
close out of PHP mode and then to create
a variable you just use the dollar sign
and maybe I want to create a variable
that stores my name so equals bread this
variable name isn't special I just made
it up it could be unicorn or pizza okay
but the idea here is that I'm setting
this variable to have a value of Brad
and now I can use that variable anywhere
else on the page so maybe down here once
I am back in HTML mode I could create a
paragraph that says hi
my name is and then maybe drop into PHP
mode so I can echo out that my name
variable okay and then close out the
sentence with a period and then close
out the HTML paragraph tag okay so if I
save that and test it hi my name is Brad
so this is an example of a very simple
variable that only contains one single
little bit of data right just one single
name however what if we want it to store
multiple names within a single variable
so that's where arrays come into the
picture so check this out let's start
over again
so let's go into PHP mode and let's
imagine that I want to create a variable
named names right plural now the name of
the variable doesn't matter so this
could be pizzas doesn't matter I just
chose names to try to indicate that I
want to store multiple values right
plural so what does our variable equal
well we can say array okay and now
within these parentheses right after the
word array we can store as many names as
we want so check this out I could say
Brad comma John comma Jane comma me
house a lot you get the idea I can store
as many names as I will
so in PHP an array is a special type of
data an array is a collection of
multiple values okay and let's imagine
that down here in HTML mode
I want to access one of these names so
maybe I have an HTML paragraph tag and I
want to say hi my name is blank
right so I would drop into PHP to access
our variable so if I want to echo out
something that lives in the names
variable okay and then to look inside
the array or look inside the collection
right here we can use square brackets on
your keyboard this is directly right of
the P key okay now let's say for example
that I want to access the first value in
this array so Brad I would just include
a zero within the square brackets you
might think that it would be a 1 to
access the first item but it's actually
a zero in most programming languages PHP
included arrays are zero based meaning
the first item is zero instead of one so
for example if I wanted to access the
second value of John I would include a 1
here if I wanted Jane a 2 if I wanted
meows a lot a 3 okay so if I save this
and refresh cool we see my name is meows
a lot if I change it back to a 2 right
so 0 1 2 we should see Jane cool but now
the question is why why would we do this
why would we want to store multiple
values in a single variable what is the
point of doing this what is the
advantage of doing this well there are
several reasons but probably the biggest
reason is for something called looping
so what in the world is looping what is
a loop well let's imagine we want to do
something once for each item in this
collection so let's imagine we want it
to output this sentence of hi my name is
blank we wanted to do that once for each
item in the collection so technically we
could just copy and paste this line and
have it four times and then change this
to 0
two three right so if I save this that
technically works but this is terrible
code this is really repetitive and it's
just not an efficient way of doing
things instead what we can do is
leverage the power of an array and
programmatically loop through the
collection and do something once for
each item so check this out let me show
you what I mean
but actually before we worry about
outputting these names let's just
practice a very basic loop first so
let's give ourselves a goal for whatever
reason let's imagine we want to output a
bulleted list on the page that counts to
100 right so imagine we want to create
an HTML list item in a series of them
something like this it goes one two
three four up to a hundred so it would
take a long time to type that out by
hand but programming and loops make that
very easy to do so check this out back
up here while we are still in PHP mode
let's use something called a while loop
so while parentheses and then right
after that curly brackets okay so how
does the while loop work well whatever
lives within the curly brackets will
happen again and again and again until
whatever we place in these parentheses
evaluates to false so let me show you
what I mean right above this while loop
let's create a variable named count the
name doesn't matter I'm just choosing
count and let's set it to equal one now
remember our goal is to output a
bulleted list that counts to a hundred
so within our parentheses let's say that
as long as the following thing is true
keep looping so in the parentheses we'll
say as long as our count is less than
100 keep doing whatever we tell it to do
within these curly brackets so then in
the curly brackets let's just echo out
an HTML list item okay and in that list
item we don't want to hard-code a value
of one or two or three instead let's
output our count variable okay so we are
saying that count begins with a value of
one so then the first
time that the while loop runs this will
echo out a 1 and then right after this
line let's just increment or increase
the count variable so we can say count
plus plus and that will add 1 to it so 1
plus 1 is 2 so now count equals 2 so
then the while loop will run again and
it will say ok now the count equals 2
that's still less than 100 so this will
evaluate to true so then this will run
again so then it will output 2 then it
will add 1 to that right so then count
will equal 3 so on and so forth so this
will just keep repeating until finally
count will equal 100 and then the while
loop will say hey 100 is not less than
100 so then this will evaluate to false
and then the while loop will finally end
I know that's a lot to absorb so you
might need to re-watch this a few times
or pause the lesson and experiment with
a while loop yourself but if I save this
and refresh cool we see a list that
counts all the way oh actually to 99
instead of a hundred so back in our code
let's just change this to less than 101
cool so now it counts all the way up to
100 all right so now that we've seen a
relatively simple while loop in action
let's try something a tiny bit trickier
so let's delete the while loop and our
count variable and let's get back to the
task at hand remember we want to loop
through our array of names and do
something once for each item in the
collection so maybe output a sentence
that says hi my name is blank alright so
here's how we can do that let's use a
while loop again
so while parentheses and then curly
brackets okay and we are going to need a
count variable again so let's create a
variable and name it count and this time
let's set it to equal 0 instead of 1
right because arrays are zero based in
order to access the first item in the
array we use a 0 okay so down in our
while loop within the curly brackets
what we want to do for
each item in the collection is just echo
out an HTML list item that says hi my
name is blank okay so we remember from
about five minutes ago in order to
access one of these items we just use
the variable name right they all live in
the variable of names and then to look
inside the array you use square brackets
so to access the first item it's a zero
to access the second item it's a one
okay so we don't want a hard code a
number here instead we want to use our
count variable so in between the square
brackets let's just say count okay so
the first time the loop runs it will be
a zero and then let's be sure to
increment the count so on the new line
let's say count plus plus so then the
next time the loop runs count will equal
one so that will give us John then it
will increment again to two which will
give us Jane you get the idea so now we
just need to tell the while loop how
many times it should repeat itself right
so within these parentheses we will say
as long as the following thing is true
so let's say as long as count is less
than and now you might think that we
would just say 4 right because there are
four items in the array but we don't
want to hard-code a number here because
what if in the future we added a 5th
name to the collection barks-a-lot
ok so we don't want to have to babysit
this code and keep updating this number
here so instead what we can do is have
PHP count the number of items in the
array for us so we'll say as long as
count is less than and then we can use
the PHP tool named count and then open
up a pair of parentheses ok and then in
those parentheses we just give it the
name of our variable right names is the
variable that contains the array so PHP
will automatically count it and say yep
there are five items in the array so as
long as count is less than 5 this will
just keep happening again and again and
again so let's save this and refresh
awesome now if this is not your first
time programming and you've worked with
before you might be yelling at the
screen right now saying Brad why on
earth would you use a while loop here
when you could have used a for each loop
well that's a great question with an
even better answer I want us to be
familiar with the while loop because
that's what WordPress uses to loop over
real content like posts and pages right
so instead of this hypothetical
worthless list of names here imagine if
we had an array or a collection of blog
posts and we wanted to loop through
those blog posts and display them on the
front end of our website for our
visitors well that is exactly what we
are going to do in our very next lesson
it's probably going to be the most fun
we've had in the course so far let's
keep it rolling and I will see you then
hello everyone in this lesson we will
learn about the famous loop in WordPress
before we worry about what that means
let's first give ourselves a goal so
let's imagine that on the home page of
our website
we want to output our most recent blog
posts now before we dig into any code
let's first make sure that we have more
than one blog post to work with so let's
jump over to our admin dashboard and
from the sidebar let's click on posts so
at the moment I just have the one single
hello world demo post but let's go ahead
and create a few dummy posts right now
just so we have multiple posts to work
with so for the title let's just say
test post and then you can just type out
a bit of gibberish or paste in some
lorem ipsum doesn't matter but go ahead
and click publish and why don't we
create at least one more dummy post so
add new I will call it second test post
add a bit of dummy content and go ahead
and publish again okay so now if I click
on posts from the admin sidebar you can
see that I have three posts so now we
can go ahead and learn how to output
those blog posts
on to our homepage here let's go ahead
and jump over to our text editor program
and in our theme folders index dot PHP
file let's delete all of this test code
from our previous lesson okay so we've
got a clean slate let's go ahead and
jump into PHP mode and then let's create
a while loop okay so the word while and
then a pair of parentheses and then
right after that a pair of curly
brackets okay so this is our empty
skeleton of a while loop and now
remember in our previous lesson we had
to do all sorts of things like create a
count variable and manually increment
that count and then come up with our own
logic like if count is less than a
certain number well this time around we
don't have to do any of that we are no
longer trying to work with hypothetical
lists of names now we are trying to work
with real WordPress content and
WordPress gives us the exact tools and
functions to do that without breaking a
sweat so within the while loop
parentheses here all we need to do is
use a special wordpress function named
have underscore posts and remember to
call or run a function you include a
pair of parentheses so forget about
programming this almost makes sense just
from an everyday English standpoint how
many times do we want to repeat or run
this loop well keep looping as long as
or while we still have posts to loop
through okay and then within the curly
brackets what do we want to do once for
each blog post well before we try to
output the title or the content of a
post first we need to call a wordpress
function named the underscore post this
is a WordPress function that we can call
and leverage and it does several
important things for us remember in our
previous lesson we had that count
variable well we don't need to do that
now because this the post function will
keep track of which post we are
we working with so each time our while
loop runs this the post function will
tell WordPress to get all of the
relevant information about the next post
ready for us to use so check this out
right after this the post and then a
semicolon why don't we drop out of PHP
and then on this line where we are
closing the curly bracket let's drop
back into PHP and what this does is now
in between those two lines where my
cursor is now we are still within the
while loop but now we are in HTML mode
so let's go ahead and create a heading
level to HTML element and inside the
headline if I say hello and then save
this and refresh we see three hellos
because we have three blog posts now
obviously it's not very useful to just
say hello instead we probably want to
output the title of each blog post now
watch how easy this is in between the
headline let's drop into PHP and now we
can use a wordpress function that is
conveniently named the underscore title
okay so we just call this function let's
save this and refresh cool we've got the
title for each post next let's try to
output the body content for each post
right below the title so back in our
code underneath this h2 let's just drop
down to a new line and I want to call a
PHP function so let's go back into PHP
mode and you might be able to guess the
name of the function that we want to run
it's name is the underscore content
semicolon okay and then maybe right
below this line why don't we add an HTML
horizontal rule just to create some sort
of visual separation between each of the
three posts in the real world we would
use CSS to accomplish that but this is a
quick and dirty solution so let's save
this looks good let's give ourselves
another goal let's imagine that whenever
we click on one of the head
lines we want to be taken to a detail
screen for just that one single
particular post so if we want to turn
the headlines into links if you've ever
worked with HTML before you know that we
just want to wrap this content here in a
tags
okay so right before the title let's
open up an HTML a tag and then right
after the title gets output let's close
that a tag okay and then in HTML you
give the opening a tag and attribute
named href and this tells the web
browser where it should go
when someone clicks on the link so the
question becomes what do we want to type
within these quotes what URL do we want
to send the visitor to well you might
have guessed it but WordPress has a
function that will output the perfect
URL here so within the quotes let's drop
into PHP and then let's call a function
named the underscore perm as in
permanent perma link parentheses because
we're calling the function okay let's go
ahead and save this and test it out cool
so the headlines look like links and if
I click on this first one I'm taken to a
screen with only that one single post
and more importantly notice the URL up
here in the address bar WordPress
automatically knows what data to query
from the database based on the URL that
we visit right so this is the permalink
or slug for second blog post so
WordPress knows to fetch or query just
that post from its database back on the
home page when we are simply at
fictional University dev in this case by
default WordPress will query or fetch
your 10 most recent posts when you're on
the home page but if we go to one of
these detail screens for just a single
blog post WordPress will see the
permalink or slug in the URL it will
only fetch or query that one post and
that way when we try to loop over all of
the current posts there will only be one
single post to
loop through okay let's give ourselves
another goal now that we are on this
single detail screen for just one post
for example it doesn't make much sense
for this headline to still be a link
right because we are already on the
detail screen for this post there's no
reason to click this again so the
question becomes how do we let that
remain a link while we are on the home
page while removing the link once we get
to a single detail page well check this
out back in our text editor I want you
to create a brand new file in our theme
folder so new file let's name this new
file single dot PHP and within the new
file let's just type out a bit of random
dummy text like Hello one two three and
if we save this and refresh here we see
that dummy text and we are on the URL
for a single post but if we go back to
our home page we see that it is still
powered by index dot PHP so what this
means is that depending on the current
URL WordPress will be on the lookout for
different file names in our theme folder
so our home page uses index dot PHP but
then if we click on one of these single
posts WordPress will look within our
theme folder for a file specifically
named single dot PHP if that file
doesn't exist then WordPress will use
index dot PHP as a universal default
fallback okay but having said all of
that let's get back to the task at hand
remember on this screen we just want to
show the blog post title and the content
but we don't want the title to be a link
like it is on the home page so here's
what we can do back in our text editor
let's go back into our index dot PHP
file and let's select and copy the
entire contents into our clipboard and
then let's go back into single dot PHP
and let's delete this dummy text and
then paste in our clipboard and now
let's simply remove the
tags that surround the title so let's
delete the closing tag and let's delete
the opening tag here and now let's go
ahead and save and refresh cool so now
on the home page
each headline is a link but then once
you click on one of those since you're
already on the detail screen there's no
need for the headline to be a link cool
and we can adjust our single dot PHP
file further to maybe remove this
horizontal rule line because there's no
need to separate the content from
anything below it so back in our text
editor let's delete that HR element
perfect okay now at this point let's
change gears so far in this lesson we've
been working with posts but WordPress
also has pages so for example let's jump
back into the WordPress admin dashboard
and in the left hand sidebar let's click
on pages and we could try to work with
this sample page but just to make sure
everyone's on the same page why don't we
use the add new button to create a new
page let's give it a dummy title like
test page 1 2 3 and then for the content
let's just include a bit of dummy lorem
ipsum text then go ahead and publish or
save the page ok and now you'll notice
this permalink here you can always click
this to preview the page cool so that
takes me to a screen with only the
content for that one page and if we look
in the URL bar we can see the slug for
that page
however even though this screen only
displays information for that one single
page we see that the headline is still a
link which means that this URL and this
screen is being powered by index dot PHP
instead of single dot PHP and that's
because WordPress only uses the single
dot PHP file for individual posts for
individual pages WordPress looks in our
theme folder for a file named page dot
PHP so why don't we go and create that
file right now so back in our theme
folder let's create
new file let's name it page dot php' and
instead of typing out the loop code
again why don't we just go into single
dot PHP copy all of this into our
clipboard and then paste that into the
new page PHP and just to prove to
ourselves that this is indeed the file
being used maybe right above this
heading level two why don't we create a
heading level one that says this is a
page not a post let's save this refresh
cool so we see this which proves that
we're using page dot PHP here's the
title and the content if we go back to
just fictional university dev homepage
this is powered by index dot PHP and if
we click on one of the blog posts this
screen is powered by single dot PHP so
the important concept for this lesson is
that depending on the URL you visit
WordPress is going to use different
files in your theme folder to control
what you see on the screen here and even
though we have these different files
like page index and single they all have
one very important thing in common and
that is that they all use the famous
loop which is this general pattern of
doing something once for each item in a
collection even if that collection only
has one item in it okay but in the
WordPress universe the loop is a famous
term any WordPress developer will know
what you're talking about if you mention
the loop the loop is at the heart and
soul of WordPress and it's something
that we will use again and again
throughout this course now that's
actually going to bring this lesson to a
close in our next lesson we will learn
how to create a global or Universal
header and footer should be a lot of fun
let's keep it rolling and I will see you
then
hello everyone in this lesson we will
learn how to set up a global header and
footer if you don't know what I'm
referring to let me show you so here's
the home page that we set up in our
previous lesson and on most websites
you're going to want some sort of header
area that appears on every page of the
website same thing with the footer area
so if you want to add content at the
very top and bottom of your pages your
first instinct might be to go into your
index dot PHP file in your theme folder
and just add something up at the very
top so even before the opening PHP tag
you can include an HTML headline that
says this is the header area and for the
footer down at the very bottom after the
closing PHP tag we could say HTML
paragraph this is the footer area and if
I save this and refresh the homepage
cool we have a header and a footer so
that works but it's not ideal because we
want this same identical header on every
single page of the site but we know from
last lesson that index dot PHP doesn't
power every page on our website so for
example if we click on one of the blog
posts we lose our header and footer
because this screen is powered by single
dot PHP and don't forget about page dot
PHP which powers individual pages
instead of posts so long story short if
we wanted this header and footer on
every page we would have to duplicate or
copy and paste this code into multiple
different template files now duplicating
code like that is almost always a bad
practice because then if in the future
maybe a week from now we want to change
something in the header we don't want to
have to make that change in 5 or 10 or
20 different template files instead we
want our header code to live in just one
file right we want a single source of
truth so check this out right now I want
you to create a new file in your theme
folder
so new file and let's name this new file
header dot PHP and in this new file
let's write out a bit of dummy text so
maybe an HTML headline that says
greetings from header.php alright let's
save this and then jump back in to index
dot PHP and let's delete this headline
that we set up a couple of minutes ago
and instead let's write a bit of code
that will pull in the contents of header
dot PHP so let's enter into PHP mode and
then call a wordpress function named get
underscore header and remember to call a
function you include parentheses right
after it semicolon and we could close
out of PHP here but because we are just
going to drop right back into PHP for
all of this code why don't we just get
rid of this closing tag and also get rid
of this opening tag so that way we just
stay in PHP mode anyways back to the
task at hand this get header function
will pull in the contents of header dot
PHP so if we save this and refresh the
home page cool we see greetings from
header dot PHP next let's do the same
thing for our footer so back in our text
editor let's create a new file in the
theme folder let's name this new file
footer dot PHP in this file let's write
out a bit of dummy text so maybe a
paragraph that says greetings from
footer dot PHP save this and then back
in our home page index dot PHP file
let's replace this down here with code
that will dynamically pull in the
contents of the footer file so we could
drop into PHP mode down here or we could
just write this code up here while we
are still in PHP you can probably guess
the name of the WordPress function we
want to use git underscore footer ok
with that in place
we save cool greetings from footer.php
and if we click on one of the blog post
links we do not see the header or footer
but all we need to do is go into single
dot PHP and call those get header and
get footer functions so back in the text
editor let's jump into our single dot
PHP file and right before the while loop
let's say git header alright and then
right after the curly bracket that
closes the while loop let's say get
footer let's save that and now our
single post screen is in business so
that takes care of individual posts
let's not forget about individual pages
remember in our WordPress admin
dashboard if we click on pages in the
sidebar in our previous lesson we
created this dummy page test page one
two three and if I use this view link
here to preview it this screen is
powered by page dot PHP so let's go
ahead and jump into our text editor and
hop into page dot PHP and let's pull in
our global header and footer so git
header and down here below the curly
braket get footer cool so now whenever
we update header dot PHP or footer dot
PHP we can rest assured that our entire
website globally will be updated now
before we bring this lesson to a close I
have two more tasks for us that are
directly related to the header and
footer first let's learn how to load our
CSS file on the front end of our website
and secondly let's learn how to add the
black admin menu bar that's supposed to
sit at the top of our website globally
you can see the menu bar I'm referring
to if you jump over to the WordPress
admin screens but that bar should also
be on the front end of our website while
we are signed in okay but let's start
with our fur
tasks of actually loading our CSS file
on the front end of our website if
you've worked with HTML in the past you
probably already know how to load a CSS
file right you include it towards the
top of your HTML file in the head
section so to get started let's jump
into our text editor and open header dot
PHP and let's delete this dummy text and
start fresh let's begin with the basic
skeleton of an HTML document right so
you always begin with the doctype and
then right below that you create an HTML
sandwich and then within that you have
two sandwiches the head sandwich and the
body sandwich so within the body section
is where you include your actual content
right so maybe you'd have a headline
that says fictional University all right
but back to the task at hand the head
section is usually where you load your
CSS file only in WordPress instead of
manually including our CSS file using
link instead of doing that in WordPress
we just call a PHP function named WP
underscore head and this lets wordpress
be in control of our head section
so imagine down the road we install a
few wordpress plugins and maybe those
plugins need to load CSS files of their
own so this function lets WordPress have
the final say and load whatever it needs
to load in our head all right now with
this line of code in place all we need
to do is programmatically tell WordPress
to load our CSS file and the way that we
do that is by creating a brand new file
in our theme folder and let's name this
new file functions dot PHP now this new
functions file is a bit different from
all of the other files we've been
creating so far all of our other files
are what we might call template files
right they control the HTML that the
general
we'll see on our website well think of
this functions dot PHP file has a bit
more private this is our behind the
scenes file this is where we can have a
conversation with the WordPress system
itself alright but back to the task at
hand we want to tell WordPress to load
our CSS file so within this functions
dot PHP file let's open up PHP and then
call a wordpress function named add
underscore action this is a super useful
WordPress function that we will use
again and again throughout the course
within these parentheses this function
wants us to give it two arguments so for
example quotes and then a quotes B now
obviously we're not going to pass it an
argument of a and B I'm just including
these as placeholders okay now let me
explain what this function actually does
so WordPress lets us give it
instructions and tell it what to do by
using this add action function the first
argument is where we tell WordPress what
type of instructions we are giving it
depending on what we are trying to do
WordPress will run this code at
different times in this case we want to
load a file so the special wordpress
hook name that we want to hook on to is
WP underscore on Q underscore scripts
okay
and the name here definitely matters you
need to spell it exactly right or
WordPress won't know what you're trying
to do alright so this is our way of
saying hey WordPress I want to load some
CSS or JavaScript files and then this
second argument instead of B let's
delete that and what we do here is give
WordPress the name of a function that we
want to run and it's important to point
out that this is going to be a function
that we create and define in about ten
seconds from now so in this case we need
to make up a name why don't we name our
function fictional University resources
or fictional university files
how about univer
City underscore files okay for this
argument the name doesn't matter it just
needs to be something that makes sense
to you personally and that you can
remember all right now right above this
line why don't we create a function with
this exact name so we will say function
and then spell out that name University
underscore files parentheses and then we
are defining or creating the function so
then curly brackets and now within these
curly brackets within the body of this
function we can load as many CSS or
JavaScript files as we want
for now though we just want to load one
CSS file right our main style dot CSS so
we will call a wordpress function named
WP underscore on cue style and within
the parentheses this function is looking
for two arguments for the first we just
need to make up a nickname for our main
stylesheet this name does not matter it
just means to make sense to us why don't
we call it university main styles okay
and then the second argument is just a
location that points towards the file
later on in this course we will learn
how to point towards custom folder
directories and look up specific file
names but in this case since we just
want to work with the main style dot CSS
file and that's sort of the default
style sheet in WordPress we don't need
to manually spell out a location here we
can just call a wordpress function named
get underscore stylesheet underscore URI
okay and that's a WordPress function
that we are calling so include
parentheses right after it cool and if
we wanted to include a second or third
CSS file you could just duplicate this
line here and if you wanted to load a
JavaScript file instead of CSS you would
just change this word from style to
script singular script not plural
but I wouldn't worry about that because
I will show you how to load a JavaScript
file very soon okay but for now if we go
ahead and save this file and let's also
be sure to save the recent changes to
header.php and then if we refresh in the
browser cool we see that all of the text
is orange and that's because in our
style dot CSS file remember we wrote
this as a test in an earlier lesson so
if I change orange to green you get the
idea our CSS file is loading now before
we move on to our final task for this
lesson which is loading the black admin
menu bar up at the top here before we
get to that I want to take a minute to
review all of that code we just wrote in
our functions PHP file because this can
definitely feel confusing or
overwhelming so let's break it down
really all we did was create or define a
brand new function that we chose the
name of we got to make this name up the
name doesn't matter within that function
we called a wordpress function and
pointed towards the CSS file that we
wanted to load okay but remember that
when you create and define a function
the function doesn't actually run
someone or something needs to call that
function later on and that's exactly
what we are doing in this line of code
WordPress has a function named add
action and you give it two arguments
let's begin with the second argument
this is just the name of a function that
you want WordPress to call at a specific
moment and this is how you say which
moment that should be so WordPress has
tons of different hooks or moments that
we can hook on to so altogether this
line of code is basically saying hey
WordPress right before you get ready to
output your code that's gonna go in the
header that's gonna go in this WP head
area right before you're getting ready
to output that we want to tack on to
that moment and we want you to run our
custom function now before we move on I
want to go over one last topic that is a
common points of confusion for people
you might be thinking hey I thought
whenever we
halt or run a function we have to put
parentheses right after it right we did
that here and we've been doing that
throughout all of our template files so
why don't we include parentheses after
this name here right if we want to call
this function why don't we add
parentheses here well we don't add the
parentheses because we don't want to
literally call this function right now
which means instead of you and I
immediately calling the function right
here now what we're doing is just
telling wordpress hey here's the name of
the function it's up to you WordPress to
actually run it at the precisely right
moment okay now let's move on to our
final task of adding the black admin bar
up at the top here so to begin let's
jump into header dot PHP and what I want
to do is move the closing body and
closing HTML tags out of this file and
into footer dot PHP if that doesn't make
sense to you right now that's okay just
follow along with me so delete the
closing HTML and delete the closing body
tag all right let's save this and then
jump into maybe index dot PHP just for a
frame of reference from a bird's eye
view how is our page getting created so
first we include our header dot PHP then
we output the main content meat and
potatoes of the page and then we have
footer dot PHP so back to header we
don't want to close out the body and
HTML sandwiches within this file we want
to do that at the very end of the HTML
that gets generated so over in
footer.php underneath our dummy text
let's close out the body tag and close
out the HTML tag and now here's the
important part right before the closing
body tag I want you to drop into PHP and
call a function named WP underscore
footer if you've ever worked with
JavaScript before you know that a lot of
times you don't want to load JavaScript
files up in the head section instead you
want to load them right before the
closing body tag so this is just our way
of giving WordPress the final say
before we close out the body tag so
WordPress can use this for all sorts of
things like loading JavaScript files or
in this case for adding the black admin
menu bar up at the top of the page okay
so with this in place if we save this
file and refresh awesome
there's the admin bar and that's
actually going to bring this lesson to a
close at this point in the course you
might be thinking to yourself hey when
is the website gonna start looking like
it was built in the last decade because
right now this plain white background
and the text and the full width of it it
looks like it was built in 1995 well in
our very next lesson we will address the
visual or graphic design of our theme
let's keep our progress rolling and I
will see you then hello everyone in this
lesson we will learn how to convert a
static HTML and CSS page into a living
breathing WordPress theme so up until
this point in the course the wordpress
theme and site that we've been working
on has zero style or designed to it now
this isn't very realistic is it because
in the real world we're never gonna make
any money if our web sites are this ugly
so we need to add design and art
direction to our theme now we could
start writing CSS together and try to
create something that looks nice but
this isn't a course about CSS in this
course we want to stay focused on
WordPress PHP and a little bit of
JavaScript so in order to avoid getting
bogged down in CSS and design for the
next 20 hours what we're going to do is
download a little bit of HTML and CSS
that I've already written for us but it
could just as well be HTML and CSS that
you or your coworker wrote the actual
HTML and CSS itself doesn't matter what
matters is that we learn how to
integrate it into a living breathing
WordPress theme okay so right now let's
go and download my starter code I want
you to open a new tab in
web browser and visit this URL so it's
github.com slash learn web code slash
university - static anyways once you're
on this page we just want to use this
green clone or download button that we
see here and once you click on that then
we are interested in this download zip
button and once you go ahead and extract
that zip file you will have a folder
named University static master now this
time around it doesn't matter where you
place this folder because the folder
isn't going to have anything to do with
our wordpress site we're basically just
going to copy and paste stuff from this
new folder into our wordpress theme
folder okay but first let's just go
ahead and look within this new folder
and the first thing I want you to do is
find the index.html file and preview it
in your web browser
so in this empty Google tab I will just
drag index.html on top of it and this
page is just static HTML this file has 0
PHP in it and has absolutely nothing to
do with WordPress so none of the links
are real they don't go anywhere
none of the buttons do anything it's our
job now to copy and paste this HTML into
our WordPress theme and then sort of
hollow it out and program it to pull in
real user generated WordPress content
like posts and pages so we want to start
moving over some of this HTML into the
WordPress theme that we've been working
on that lives at fictional University
dot dev and the question of the moment
is where do we begin
well it's just personal preference but I
always like to begin with the header so
in this case the part that I'm
highlighting right now we've got the
logo in the top left and the navigation
links and buttons in the top right so if
we want to move or copy and paste this
into our theme why don't we open up that
new folder that we downloaded just a
moment ago and let's open this
index.html file in our
editor all right so this is the HTML
that is creating this page and if we're
interested in this top header part all
we need to do is look right below the
opening body tag here and we see a
header element so let's just place our
cursor at the very beginning of that
header tag and then scroll down a bit
and you'll see that that header element
closes right here so I'm just going to
hold down the shift key on my keyboard
and click at the end of it here cool and
now with that code highlighted let's
just copy it into our clipboard and now
we want to paste it into one of the
files in our wordpress theme folder so i
know this is getting a little bit
confusing that's why I'm using one text
editor with a light color scheme and
another text editor with a dark color
scheme right so this dark screen is the
files that we just downloaded a minute
ago and this light screen is the
WordPress theme folder that we've been
working on for several lessons now so
here's what I want you to do in your
theme folder jump into our header dot
PHP file and right below the opening
body tag let's delete this h1 element
and then go ahead and paste in your
clipboard okay and if we save this and
refresh our wordpress site here's the
new header content now it's not styled
yet and that's because we haven't moved
over any CSS code yet don't worry we'll
do that in just a minute or two but next
let's move over the footer from the HTML
page right so on this page if we scroll
down to the very bottom we see this
footer section that we are probably
going to want on every page of the
website so back in the recently
downloaded index.html file if we go
ahead and scroll down to the very bottom
of it right above the closing body tag
and this script tag we see a footer
element so why don't we place our cursor
at the end of the footer element and
then scroll up a bit okay and here we
see the opening tag for the footer so
let's just pull down the shift key on
our keyboard and click at the very
beginning of the footer element then
copy this into our clipboard
and then we want to paste it into our
theme folders footer dot PHP file so
back in our WordPress theme folder jump
into your footer dot PHP file and we
want to leave these lines intact but
let's go ahead and delete this dummy
paragraph and then just go ahead and
paste in your clipboard and if we save
that and refresh the wordpress site now
we've got the footer in place however we
still don't have any sort of styling or
design so next why don't we take the CSS
from this page and add it into our
WordPress themes style dot CSS file so
in that new folder that we downloaded in
this lesson go ahead and open the style
dot CSS file in a text editor and we
want to copy everything in this file
into our clipboard so press command a if
you're on a Mac or ctrl a if you're on
Windows that will select everything and
then copy it into your clipboard and
then back in your WordPress theme folder
jump in to style dot CSS remember we
created this file in this comment back
when we first created the theme now we
definitely want to leave this comment in
place but right below it we can delete
this test placeholder CSS we had and
then let's just paste in our clipboard
then save this file and then if we
refresh on the front end of our website
we see the hint of a design shining
through okay now looking at this page I
see all sorts of things we need to fix
so let's just start working through it
bit by bit
so you'll notice down here in the footer
underneath this connect with us column
back in the HTML template for this page
they're supposed to be social network
icons there and when I created this page
I used an icon package named font
awesome so we just need to make sure
that we load the font awesome icon pack
in our WordPress theme let me show you
what I'm talking about so if we open the
index.html file that we downloaded
earlier in this lesson and we scroll up
to
very top of it you'll notice that in the
head section on this line I'm loading
the font awesome icon library now your
first instinct might be to copy and
paste this line into the header dot PHP
file in WordPress but that's not the
ideal way of doing things let me show
you why
so back in our wordpress theme folder if
we jump into header dot PHP up at the
top here's our head section and remember
that instead of loading CSS files
directly here we added this WP head
function so that WordPress can be in
control of loading different files and
assets so if we want to load another CSS
file that loads up the font awesome icon
pack we actually want to jump into our
themes functions dot PHP file now
remember that this is the line of code
that loaded our main style dot CSS file
so if we want to load another CSS file
what we can do is just right above this
line let's call the WP on cue style
function again all right now within the
parentheses we want to pass in two
arguments the first is a nickname that
we get to make up why don't we call this
one font awesome
the name doesn't matter it should just
make sense to us and then comma and then
let's include a second argument and this
just needs to be a location that points
towards the file now if we jump back
into our index.html template file you
can see here that I was loading font
awesome from an external URL so let's
just copy and paste part of this URL
into WordPress so do this with me place
your cursor in between this colon and
the first forward slash and then I want
you to select all the way to the end of
the file name so it ends in dot CSS okay
so with that selected let's copy it into
our clipboard and then back in our
wordpress functions PHP file just paste
that in between the quotes for this
second argument cool so now if we say
and refresh those icons are in place now
let's move on to the next fix so the
next thing that I notice is that the
text on this page is using a generic
font but the text on the HTML template
is using a custom font and if we look at
this index.html file in our text editor
right above the font awesome line you
can see on this line I'm loading custom
fonts from Google so if we want to move
this over into WordPress let's just jump
back into our themes functions.php file
and right above the line that we just
created a moment ago let's add a new
line and let's just call that WP on cue
style function again so in the
parentheses the first argument is a name
that we make up let's call it custom
google fonts and then let's add a comma
and quotes for the second argument and
we just need a URL that we can paste
into there
so back in index.html on this google
fonts line place your cursor in between
the colon and the first forward slash
and then drag to the right and stop
right before that ending quote ok with
that selected let's copy it and then
back in our wordpress file paste it into
the second argument cool now let's save
that and refresh our WordPress site and
it's a subtle change but you can see
that we are now using custom fonts next
let's focus on the actual content of the
homepage right so instead of this
generic listing that loops through our
blog posts instead of that why don't we
work on importing this custom welcome
area and two column layout and slideshow
so to do that let's jump back in to our
index.html template and you can scroll
up to the very top and then you'll
notice that we've already imported this
header element so scroll down a bit
until you get to the end
the header element and then let's place
our cursor right before this page banner
element okay and then let's scroll down
all the way to the bottom right before
the footer element begins so we don't
want to include this we've already
copied and pasted that so just hold down
shift and click right here at the end of
this div so let's just copy that to our
clipboard and then let's jump over to
our wordpress theme folder and the file
that controls the homepage is index dot
PHP now in this file we still want to
begin by including the header template
and we still want to end by including
the footer template but we want to get
rid of everything in between so let's
delete this test placeholder loop code
that we wrote earlier okay and now we
want to paste in the HTML from our
clipboard but you'll notice that we are
currently in PHP mode so on this line
let's just drop out of PHP and then
right before get footer we can enter
back into PHP so that means right here
we are in HTML so we can just go ahead
and paste in a clipboard let's save that
and refresh the wordpress site looks
good we just have two quick problems to
solve the first issue is that we are
missing the images or photographs that
should be displayed here and then down
here as well and the second problem is
that this slideshow section isn't
behaving like a slideshow okay so let's
fix both of those things but let's begin
with the missing photos so all we need
to do is look within the new folder that
we downloaded at the beginning of this
lesson and we need to copy or move this
images folder into our WordPress theme
folder and while we're at it I also want
you to copy over this CSS folder and
this j/s or JavaScript folder so you
should be able to just click on one
folder and then hold down the command
key on Mac or the ctrl key on Windows
and then just click on the other folders
that you want then right-click and
choose copy and then we're just going to
paste them into the wordpress theme
folder so remember your theme
folder lives within your local sites or
projects folder or wherever you set up
WordPress so open that up and then drill
in to your theme folder so if you're
using my vagrant setup go into fictional
university and then the app folder and
then WP content and then themes and
here's our fictional University folder
so go in there and this is where we just
want to paste in our clipboard cool
so we copied over those three folders
and now if we refresh our website we
still don't have the images but now we
are very close we just need to update
our HTML to look for the images in the
right folder so back in our text editor
in our theme folder jump in to index dot
PHP and up towards the very top of the
file you'll see a div with a class of
page banner BG image and it's using an
inline style that's trying to pull in a
background image and this code tells the
web browser to look within the current
folder for a subfolder named images and
look inside it for a jpg named library
hero so the reason our photo isn't
loading is because if we go up to our
address bar we don't have an images
folder in the root of our domain or the
root of our project directory instead we
do have a wordpress folder named WP -
content and then within that folder we
have a themes folder and then the name
of our specific theme is fictional
university theme and that is where the
images folder lives so then we could
look within there for library hero JPEG
okay cool so this path works but look
how long this is you probably don't want
to have to type this out every time you
want to load an image so let's go back
and jump back into our text editor and
I'll show you a trick so go ahead and
select this current path so from images
to jpg copy that into your clipboard and
then go ahead and delete it okay so now
we just have empty parenthesis and what
we're going to do is drop into PHP
because WordPress has a function here
that can help us so within the
HP tags let's echo out the results of a
wordpress function named get underscore
theme underscore file underscore URI and
it's a function so open up parentheses
and it only takes a single argument so
quotes so now just add a forward slash
and then paste in your clipboard and
that's all we need to do this WordPress
function will generate the path to our
theme folder all on its own cool so
let's save this and refresh and we're in
business now let's just do the same
thing for the three images down here at
the bottom of the page so back in index
dot PHP if you scroll down to the very
bottom we see images bread images apples
and images bus so go ahead and pause the
lesson and adjust these three image
paths the same way that we just adjusted
the image up at the top the only problem
now is that this section isn't cycling
through the three slides it's just
showing all three slides stacked on top
of each other all we need to do to fix
that is load a JavaScript file that
handles the slideshow behavior so back
in our text editor jump in to our themes
functions dot PHP file and loading a
Java Script file is just like loading a
CSS file so right above this line let's
add a new line and let's call a function
named WP on cue and then instead of
style its script within the parentheses
the first argument is our chance to name
the file the name doesn't really matter
let's just call it main university
javascript the second argument is where
we point towards the file that we want
to load to point towards the JavaScript
file let's use a function named get
theme file URI and it's a function so
parentheses and we want to look inside
our theme folder and then look inside
that j/s folder that we copied over a
few minutes ago and the file that we're
looking for is named scripts - bundled
dot j/s now loading a JavaScript file
requires a few more arguments than when
we load a CSS file so
to the quote and then this parentheses
let's include a comma so we can add
another argument and WordPress wants to
know if this script depends on and the
other scripts right does it have any
dependencies in this case it doesn't so
we can just say null it doesn't have any
then WordPress wants a version number
for our file it doesn't really matter
let's just make up a version number of
1.0 and then the final argument is
basically WordPress asking us do you
want to load this file right before the
closing body tag yes or no so we say yes
or true and that way it loads at the
bottom of the page instead of up in the
head section which is much better for
overall performance so if we save this
and refresh now we have typical
slideshow behavior perfect that's going
to bring this lesson to a close in our
next lesson we'll start working on an
interior page template let's keep it
rolling and I will see you then hello
everyone in this lesson we will set up
an interior page template what in the
world do I mean by that well for example
this is our home page but when someone
clicks on a generic page like about us
up in the header or privacy policy down
in the footer we will need a generic
page template to power those pages so in
this lesson we will work on integrating
this custom design of hours into our
themes page dot PHP file now in case it
wasn't clear from the last lesson by the
end of this course we will have made
everything on this home page dynamic and
be pulling from Riegel wordpress content
but for the time being let's leave this
static home page as a placeholder and
let's focus our attention on interior
pages okay now let me show you what I'm
referring to when I say interior page
template so in that new folder that we
downloaded in our previous lesson
university static master if we look
inside that folder there is a file named
interior - page dot HTML
and if we go ahead and drag that file
onto a new tab in our web browser we see
a template that we can use for the
majority of our wordpress pages now
before we start integrating this HTML
into our theme
let's first jump into our WordPress
admin area and let's create a couple of
new pages just so you and I are synched
up so from the sidebar let's hover over
pages and click add new for starters
let's create a page named about us and
for the content let's just say this is
the about page content and then maybe
paste in a bit of lorem ipsum dummy text
and then let's save or publish this and
while we're at it let's create another
new page so add new and let's name this
page privacy policy and for the content
this is the privacy policy content lorem
ipsum okay go ahead and save this and
now we can use this permalink to preview
the page so here we see the title and
here we see the content so it's working
but it doesn't look quite right this is
not a very pretty page template right so
instead we want to use this as our page
template so to do that I want you to
open up the folder that we downloaded in
the last lesson and open up interior
page HTML in a text editor
all right so towards the top of the file
right after the opening body tag we see
this header element and we already
integrated that in our previous lesson
so let's scroll down below that and
right when that header element ends we
see a new div begin that has a class of
page banner so this is where we want to
begin copying and pasting so let's place
our cursor at the very beginning right
before that div opens up and then let's
scroll down keep scrolling keep
scrolling and around line 68 or 70
you'll see
did with a class of page section page
section beige and that corresponds with
this area in the template we don't need
that for now for now let's just copy and
paste over this top section so back in
the text editor I'm going to hold down
the shift key on my keyboard and click
right here
cool now with that selected let's copy
it into our clipboard and then we want
to paste it into a file that lives in
our theme folder so within your
WordPress theme folder that we've been
working in go ahead and open up page dot
PHP in your text editor okay so we still
want to begin with our header we still
want to end with our footer and we still
want to use the while loop in between
but we don't want to output this test
placeholder HTML that says this is a
page not a post
okay so let's delete that line of HTML
and let's also go ahead and delete the
h2 HTML headline below it and we can
also delete this PHP the content
function okay so at this point we still
have a while loop we are still calling
the the post function which will get all
of the appropriate data ready for us
from the WordPress database we're still
closing out of PHP here and opening up
PHP here which means right where my
cursor is right now we can add HTML so
just go ahead and paste in your
clipboard and if we save this and
refresh in the browser within our
WordPress site back on the privacy
policy page we've got that template in
place and now we can just start
hollowing out some of the static content
and replace it with WordPress functions
that will pull in dynamic content for
example let's begin with this large page
title headline so up at the very top of
page PHP within this page banner section
here we see an h1 headline with a
hard-coded value of our history so let's
just delete our history and instead drop
into PHP and call the function name
the title cool so if we refresh now we
see privacy policy which makes sense
since that's the page we're on next
let's work on hollowing out this main
content field area so back in the text
editor if we scroll down just a little
bit here we see a div with a class of
generic content and what we want to do
is just delete and hollow out all of the
paragraphs inside it okay and instead of
those hard-coded paragraphs we just want
to drop into PHP and call the function
named the content and if we save and
refresh perfect now we see this is the
privacy policy content next let's
address this sidebar menu of links that
we see here we are not ready to set this
up yet so for the time being why don't
we just comment it out let me show you
what I mean
back in page dot PHP on this line where
we just called the the content function
right above that we see a div that has a
class of page links so this is the Dib
that is creating that sidebar menu and
if we want to comment it out right above
it we can just say less than symbol
exclamation - - so that begins the
comment and then let's end the comment
right when the div ends so it's just - -
greater than to end the comment so this
way we leave this code in place so we
can work with it in just a couple of
lessons from now but on the front end of
our website it's now hidden cool we can
circle back to that menu a bit later on
but for now the next thing I want to
address is this subtitle in a future
lesson we will learn how to set up a
custom field so that each page can have
its own unique subtitle here but for now
why don't we replace this hard-coded
text with a message to ourselves so we
don't forget to implement that feature
later on so back in page dot PHP of our
theme folder up at the very top within
this page banner sect
we see a paragraph with that hard-coded
content and let's delete that and
replace it by just saying don't forget
to replace me later cool also regarding
the plain black background of this top
area if we look at that same area within
our static template that we are copying
from we see that it's supposed to use a
background image of the ocean so we need
to get that image to work within our
theme and if we jump back into our text
editor up at the top of page PHP within
this page banner div we see an inline
style that is trying to load an image
named ocean dot JPEG and the reason this
isn't working is because we don't have a
folder named images at the root of our
domain in reality our images folder
lives within our theme folder so let's
do this let's hollow out these
parentheses so delete this images ocean
JPEG and in these parentheses let's drop
into PHP and then echo out the results
of a function named get theme file URI
and we are calling a function so
parentheses and this function will
automatically provide the beginning part
of the URL that will look in wp-content
themes and then our theme name so now we
can just say quotes look in the images
folder for ocean jpg cool so let's save
this and refresh now in a future lesson
we will set things up so that in the
admin edit page screen you can upload a
unique image for each page but for the
time being I think this placeholder
ocean image will do the trick
okay moving on that leaves us only with
this little breadcrumb area that we
still need to address we will circle
back to this section at the very end of
this lesson but for now let's not worry
about it what I do want to worry about
right now
is the title of this page that we should
be seeing up here in the title of this
browser tab now the fact that we are
seeing the URL of the page here instead
of a legit
title means that we are missing the
title tag that usually lives in the head
section of a website so if that's the
case your first instinct might be to
jump into your text editor and hop into
our theme folders header dot PHP and
your instincts might be to go inside
this header element and create a title
tag and say my little title now
technically that works so we see the
title here but that's far from ideal
because you want the title to be unique
or specific for each page or post that
you're viewing so let's delete this
title line and instead since we are
already giving WordPress control over
our head section with this WP head
function what we can do is jump into our
theme folders functions PHP file and
tell WordPress to automatically generate
an appropriate title tag for each screen
so the question is how do we tell
WordPress to do something and the answer
is that you add an action so down here
we've already added one action and this
is the event that we wanted to hook on
to when our goal was to load CSS and
JavaScript files but in this case we
have a different goal so let's drop down
to the bottom here and let's add a new
action so we call the add action
function and the name of the WordPress
event that we want to hook on to is
after setup theme and then let's pass
this function a second argument and this
is just the name of a function that we
are going to invent in about a second or
two from now so we get to make up this
function name let's name it University
features so we make up a name and then
we just have to create a function with
that name so right above this new line
that we just wrote let's create a new
line and let's say function we want to
create a new function we want it to be
named University features parentheses
curly brackets and when you want to
enable a feature for your theme the
function that you call is add
Thieme support now there are all sorts
of different features that you can
enable with this function so we need to
tell WordPress which feature in
particular we're interested in in this
case its title tag okay so with this new
code in place if we save this file and
refresh the front-end of our website
look up here in the top of my browser
tab privacy policy which makes sense
since we're on that page but if we
change the URL and go to about us
cool the title tag gets automatically
generated by WordPress now you'll see
that it's followed by a - and then the
name of our website if you ever want to
change this top-level name of your
website just go into the settings
general screen of WordPress ok moving on
now that we have an about Us page and a
privacy policy page it would be nice if
those links in the header and footer
actually did something when you click on
them now in a future lesson I will show
you how to create real dynamic WordPress
menus that you can control and manage
from the admin appearance menu screen
but for now let's just manually add
those links within our header and footer
theme files let's start with the about
Us header link so in our theme folder
within header.php just a bit down from
the top here we see the about Us link so
let's delete the placeholder hash tag
and technically we could just say slash
about us and that works if you're using
a developer domain like we are fictional
University dot dev but if you're using
something like map or xampp you might
not be using a real developer domain and
in that case you don't want your links
to just point to the root of the current
domain because you might have multiple
WordPress sites all living on your one
local host so instead a more reliable
way of creating links is to drop into
PHP and echo out the results of a
function named site URL and that will
automatically give you the route URL of
your cur
WordPress site and then anything we
include as an argument it's added on to
it so we can just say slash about us
let's save that and now even if I go
back to my home page when I click on
this about Us link we are in business
next why don't we set things up so that
if you click on this logo in the top
left corner it takes you back to the
home page so up at the top of hetero a
just a couple lines down from the
opening header tag we see this h1 with a
class of school logo text and all we
need to do is change this links href
value so delete the placeholder hashtag
and then there's no sense in typing out
that same code again so let's just copy
and paste what we set up down here from
the opening PHP to the closing PHP tags
copy that back up here in this href
value paste it except this time we don't
want to link to the about Us page so we
can simply call the function and not
pass it any arguments whatsoever and
that will give us the route or home URL
so I'm on about us and if I click that
logo or on the home page cool now let's
do the same thing for a few of the links
in the footer so this should take us
back to the home page about us and
privacy policy so in the text editor
jump into your themes footer dot PHP the
first h1 that we see should link us back
to the home page so here's the a element
and here's the href so just delete the
placeholder hashtag and then paste in
your clipboard this should point towards
the home page so let's delete this
argument so the parenthesis are empty
okay and then down here let's set things
up for the about Us link in the footer
so delete that paste in our clipboard
perfect let's scroll down a little bit
here's the privacy policy link so delete
that placeholder pasted in the clipboard
change about us to privacy policy cool
so if we save that now we can use the
links in the footer to jump around ok so
at this point we now have a basic
interior page template up and running
now we can circle back to this little
breadcrumb box here because this box
makes zero sense on a top level page
like privacy policy however imagine we
want to have sub pages or children pages
on our site so for example maybe on our
about Us page we want to have two
children pages our history and our goals
well in our very next lesson that's
exactly what we're going to learn about
parent and children pages and how to
work with them on the front end of our
website I know this lesson we just
worked through and the one right before
it they were not tons of fun
they're probably two of the most boring
lessons in the entire course but we had
to get up and running and working with
the same page templates so you and I are
in sync from here on out there won't be
as much mindless copying and pasting
we're gonna get back to truly
educational content so let's keep things
rolling and I will see you in the next
lesson hello everyone in this lesson we
will learn how to adjust our theme
templates to account for parent and
children pages so for example imagine
under our about Us page we want two new
children pages named our history and our
goals
now before we update our theme to
reflect parent child page relationships
let's first go and actually create the
two children pages over in the WordPress
admin area so let's add a new page let's
title this one our history paste in a
bit of dummy content and here's the
important part over in the right hand
column under parent instead of no parent
let's choose about us okay so we are
saying that the our history page belongs
to the about Us page so let's publish
that and just for good measure let's
create another new page and let's call
this one hour of goals dummy content
over in the sidebar tell the parent to
be about us let's save that
okay so we've created the two pages but
now we need the front end of our website
to actually reflect those parent-child
relationships so for example if we use
this permalink here to visit the our
goals page our focus for this lesson is
this breadcrumb box now at the moment it
is entirely hard-coded right so this
shouldn't say our history it should say
the name of the current page which is
our goals so right now let's dig into
our theme code and make this breadcrumb
box dynamic so in our text editor within
our theme folder let's open up page PHP
and from the top if you look below this
page banner div you'll then see a
container and right below that this div
with a class of meta box that's the
breadcrumb box so you can see towards
the end of this div we have hard-coded
our history so why don't we begin by
deleting that hard-coded our history and
instead we can drop into PHP to output
the title of the current page so let's
just call the function named the title
cool so that makes this text dynamic
next let's set things up so that this
entire breadcrumb box only appears on
child pages right because it makes sense
that we would want a link back to the
parent page but once you are back on the
parent page there is no need for this
box so back in our text editor we only
want to display this meta box div or
this breadcrumb box div if the current
page being viewed is a child's page now
the first step to achieving that is by
using something in PHP called an if
statement so do this with me right above
this div with a class of meta box right
above that let's add a new line and
let's drop into PHP and within PHP let's
write our first if statement so we just
type out the word if
and then a pair of parentheses and then
a pair of curly brackets okay now
whatever we place within the curly
brackets will only occur if whatever we
place within the parentheses is true so
let's work through an example in the
curly brackets let's maybe echo out a
phrase that says the sky is blue okay
and now within our parentheses on this
line let's say if two plus two equal
sign equal sign for so this will always
be true right
two plus two will always equal four so
because our condition within these
parentheses is true PHP will run
whatever we place within the curly
brackets so save and refresh here we see
the sky is blue but if we change our
condition to two plus two equals seven
that is false right so because it's
false the code in the curly brackets
will no longer run so now you can see we
are missing the sky is blue so what we
want to do is come up with a condition
instead of two plus two equals something
we want our condition to be if the
current page has a parent page right
because if it does that means it's a
child page now in order to find out
information about a page like that we
are going to need to review a wordpress
topic named post ids so what in the
world is a post ID well the easiest way
to explain that is to jump into your
WordPress admin screen and begin editing
any existing post or page and I want to
direct your attention up to the address
bar whenever you're editing a post or
page towards the end of the URL you will
see a number and that is the unique
numerical ID for that post or page in my
case my our goals page has an ID of 24
and if I go check out the main about Us
page in my case it has an ID of 16 in
your WordPress website it might have a
different ID number but that's not
important what is important
that each page in post has this unique
number and back in our code we can use
that unique ID number to find out
information about a page or post so
right now I want to show you a few
WordPress functions we can use that are
related to post IDs so for the time
being let's delete this if statement so
now we just have this empty PHP section
and I want you to type this out with me
let's echo out the results of a
wordpress function named get the ID and
notice the I and D are capitalized but
if we save that here we see a 16 on the
about Us page and if we go back to the
our goals screen we see a 24 cool so
this get the ID function will give us
the ID of the current page that's being
viewed but that's not exactly what we're
interested in we want to know if the
current page has a parent page so
instead let's do this let's delete this
line and instead let's echo out the
results of a wordpress function named WP
get post parent ID and this function
will do exactly what it says it will do
so within the parentheses we give it an
ID for a page or post and this function
will respond by giving us back the ID
number for that page is parent so for
example if we were on the our goals page
and we wanted to find the ID of this
page as parent
well this page itself has an ID of 24
but instead of hard-coding that number
we want this to be dynamic so to get the
ID of the current page remember the
function get the ID so altogether what
this line of code is saying is get the
ID of the current page we're viewing and
then WordPress we want you to use that
number to look up the ID of its parent
page so if we save this and refresh we
see a 16 and remember that's the ID of
my parent about Us page and if we go to
that
about us parent page the number we see
is zero and that's because this page
about us doesn't have a parent so this
function WP get post parent ID it will
return zero if a page doesn't have a
parent and if a page does have a parent
we just get the ID of that parent page
now that behavior will play very nicely
with an if statement let me show you
what I mean let's bring this full circle
and get back to an if statement but
before we go ahead and delete this line
I want you to copy part of it to your
clipboard so beginning from the W at the
start of this function name and then all
the way right before the semicolon let's
copy this part in nor clipboard so we
don't have to type it again in a few
seconds cool so now let's go ahead and
delete this line and let's put
everything together so let's write an if
statement if parenthesis curly brackets
within the curly brackets let's echo out
and say I am a child page now within the
parentheses right after the if for our
condition I want to show you something
neat so we already tried two plus two
equals and then four would be true and
then some other made-up number this
would be false but obviously we don't
always want everything to be a
mathematical equation that evaluates to
true or false in PHP and many other
programming languages there's a special
boolean value if you say true that will
obviously evaluate to true so we see I
am a child page you could also say false
but beyond that what's neat is simply a
value of zero will evaluate to false
right so now we do not see I am a child
page and any number such as 1 or any
number that's larger than that will
evaluate to true I am a child page so
here's the cool part for our condition
we can just paste in our clipboard
because remember this function will give
us the ID of the pair
Paige and if the page doesn't have a
parent it returns a zero and if it's a
zero that evaluates to false cool so now
we finally have a bit of code that will
only run if the current page is a child
page so we're on the our goal screen and
we see I'm a child page to go to the
main about us parent page we don't see
that message so now all we need to do is
move this div with a class of meta box
this is that little breadcrumb box let's
just move this HTML to live within the
if statement so let's do this let's
delete this echo I am a child page and
right above it on this line right after
the curly bracket let's drop out of PHP
and then on this line when the curly
bracket ends right before that let's go
back into PHP so now on this line where
my cursor is we can have regular old
HTML so now let's just cut and paste
this meta box breadcrumb box cut it and
then let's paste it right here cool so
let's save that and I'm on the about Us
screen now we no longer have that
breadcrumb area but if I go back to the
our goals page cool there it is
the next thing we should work on is
adjusting this so that the words about
us are not hard-coded right because what
if we were on a child page that didn't
belong to about us for example down in
our footer remember we created a privacy
policy page so let's click on that and
what if we had a child page that
belonged to privacy policy well in that
case we wouldn't want our template to
have this about us title hard-coded
instead we would want this to
dynamically pull in the name of the
parent page now before we write the PHP
code to achieve that why don't we first
go and create an actual privacy policy
child page so that things will be easy
to test and see if they're working so
back in the admin section I will use the
add new button and let's just create a
new page and maybe call it cookie Policy
paste in a bit of dummy content
and the important part is that we want
to set the parent to privacy policy
okay so let's save this and now if I use
this permalink here to view that new
page cool so there's the title cookie
policy but this back to about Us link
doesn't make any sense instead it should
say back to privacy policy so right now
let's write a bit of PHP code to make
this dynamic so let's delete this
hard-coded about us and instead let's
drop into PHP and let's echo out the
results of a wordpress function named
get the title now this function name
sounds very similar to the function
that's just the title the difference
between these two functions is that the
title will output the title of the
current post or page whereas get the
title allows you to pass in an ID number
in these parentheses and it will give
you the title for that post instead of
just the current post that you've looped
through so we don't want to hard-code a
numerical ID here we want this to be
flexible let's just place an X just as a
temporary placeholder and we will circle
back to this in just a moment for now
let's shift our focus onto the href
attribute we want to replace this hash
tag with a URL that points to the parent
page of the current page so within those
quotes let's drop into PHP and let's
echo out the results of a function named
get permalink so this function is
similar to get the title instead of
being limited to just the current page
of posts that we've looped through we
can pass it a number or an ID and it
will give us the permalink for that post
or that page so let's also just place an
X here as a placeholder and now all we
need to do instead of having an X here
and here we just need to use the same ID
number that we created up here with
these two functions right remember this
WP get post parent ID function will give
us the ID of the current pages
Paige now this code that I'm
highlighting right now is a lot to type
so we probably don't want to have to
type that out again here and here
instead right above this if line why
don't we create a variable that stores
this numerical ID and then we can just
access that variable again and again so
let's create a variable and we can make
up the name let's call it the parent the
name doesn't matter we're just making
something up that we can remember and we
just want it to equal the number that
this function generates so let's just
copy and paste this or you can even cut
and paste it right so now the
parenthesis for the if statement will be
empty and we can say that our variable
equals that and now we can use this
variable in three places we can use it
as the condition for our if statement so
we can say if our variable right because
if it's a zero that will evaluate to
false it'll work just the same as this
it's just less typing this time around
and then as you might have guessed we
can use that same variable where our X
placeholders are so right here let's
delete the X and just say the parent and
let's do the same thing for this X so
get the title and then the parent and
then if we save this and refresh our
cookie policy page which is a child of
privacy policy when i refresh now we see
back to privacy policy here and if I
click on that cool it successfully takes
me to the parent page and if I go up
into the address bar and visit the about
us our history sub page or child page
cool we see back to about us and if we
click it the link indeed works now at
this point you might be asking yourself
how our visitors of the websites
supposed to navigate to the child pages
right we're on the about us parent page
and nowhere do we see links to the two
children pages well that is the exact
issue that we are going to fix and work
on in our next lesson we will learn how
to add a sidebar menu right about here
that automatically includes links to any
and all
children pages it should be a lot of fun
to code out let's keep things rolling
and I will see you in the next lesson
hello everyone let's take a quick break
from our project to answer one of the
most common PHP questions and that is
why do certain functions need to be
echoed while other functions don't in
order to understand the answer to this
let's write a couple of functions
together right now so jump into your
text editor and within your theme folder
let's open up index dot PHP we're just
gonna write a bit of test code for
educational purposes that we will delete
in about 5 minutes from now
so it doesn't really matter where we
type this but I'm just gonna open up a
new PHP area right below the header ok
and now we can experiment so type this
out with me let's imagine we want to
create our own brand new function so
function and let's call it double me
parentheses curly brackets and let's
imagine that the purpose of this
function that we are creating is that
when you call it you give it a number
and this function will double that
number and give you the result so for
example below the function definition
when it's time for us to actually run
and call the function we might say
double me five right and we would expect
that to generate 10 or if we said eight
we would expect it to generate 16 okay
so let's go ahead and make that happen
within the function definition so within
these parentheses we want a parameter
that can receive the incoming number
doesn't matter what we call it let's
just call it dollar symbol X as a
placeholder variable okay and then in
the curly brackets in the body of the
function we can just echo out whatever
number that someone passes into this
function x - or asterisk - cool
so now down below this function
definition we could say double me four
right and we would expect that to echo
out eight onto the page
so if we save this and refresh the
homepage of our website if i zoom in a
bit there you can see that number 8
cool and if we change this to 25 saved
we see the number 50 so that's an
example of a function that we don't need
to echo we just call the function and it
echos something out onto the page for us
however not all functions are like this
most functions or I should say a lot of
functions instead of echoing out their
result they return their result so what
does that mean what does return do it's
basically a functions way of saying my
work here is done
I've done my job and now I'm returning
this results or I'm returning this value
so then down here when we call or run
the function and say doublemeat 25 this
will still equal 50 PHP will evaluate
this to be 50 however we are not doing
anything with that value of 50 in this
case it's just going to sit in PHP s
memory and we aren't doing anything
useful with it so if we save this and
refresh you'll notice that that value of
50 disappears up here so now it's up to
us to actually do something with the
value that this function returns now
there are a million different things we
could do with the value probably the
most obvious example would be that we
could echo it out so echo the results of
double me 25 so now that will indeed
show 50 again now functions that return
values like this are really nice because
they're so flexible right because in the
world of programming there's a lot of
things we need to do other than just
echoing out simple values so for example
we could create a variable magical
number and tell it to equal double me 10
right so we aren't trying to echo
anything onto the page we're just
setting a variable to equal this value
or for another example maybe we want to
use that function as an if statement
condition so for example we could say if
double me 12 equals 20
or then echo out onto the page the
function is performing the math
correctly cool so you get the idea this
is not a real-world example you'd
probably never do this but the idea is
that you can use the value that a
function returns anywhere now before we
bring everything full circle and tie
this back into the topic of WordPress
specifically let's have a bit of fun
first so right now let's delete this if
statement so we've still got our double
me function definition and right now
below this let's create another brand
new function named triple me instead of
typing it out we can just copy and paste
this function so copy paste let's change
the name to triple me and then on this
line change this from x 2 to x 3
ok now below this let's actually call
and run these two functions together
because I think this will really
illustrate the power of functions that
return values they're so flexible that
they can fit together nicely so let's
begin by saying double me 5 so that
would be 10 but then we can wrap that
within the triple me function so then
right before that we could say triple me
parenthesis and in the parenthesis here
so instead of just saying triple me 10
I'm trying to show you that you can use
the value that a function returns as an
argument for another function so let's
test this out by echoing it or
outputting it onto the page if you
triple 10 we would expect to see 30 so
save this refresh cool then if i zoom in
you can see a value of 30 ok now that's
enough PHP for the sake of PHP let's tie
this back in to WordPress so when it
comes to the WordPress functions that we
don't have to create that we just get to
leverage it can be a bit confusing
whether a function is going to echo
something for us or if it's just going
to return a value and so we need to echo
it so let me show you a tip that can
save you tons of confusion back in the
I will delete all of this sample code so
that we can talk about wordpress
functions so for example wordpress has a
function named the title but it also has
a function named get the title also
there's a wordpress function named the
ID but wordpress has another function
named get the ID so how do we make sense
of this well there's a rule of thumb
that if a wordpress function begins with
the word get that means it's not going
to echo anything for you it's just going
to return a value and it's up to you to
use that value however you see fit
on the other hand if a function begins
with the word the that means WordPress
will indeed handle echoing and
outputting it onto the page for you now
at this point in the course I say we
just leave it at that so I'm going to
delete all of this test code from this
lesson so I'm putting my index dot PHP
file back to the state that it was in
before this lesson even began and moving
forward I wouldn't worry about
preemptively memorizing every function
and knowing exactly what it does because
that's not how people work in the real
world in the real world you will Google
in plain English terms whatever you're
trying to accomplish in WordPress with
code and in the search results you'll
want to look for two main websites codex
and developer dot wordpress.org these
are the official WordPress websites and
they have a wealth of information they
will tell you exactly what a function
does how to use it what arguments you
can pass it and most importantly it will
tell you if the function returns
something or outputs something for you
now having said all of that you don't
need to go and do any of your own
research at this point relax take a deep
breath you're in this course for a
reason
it's my job to gradually introduce you
to more and more WordPress functions and
by the end of this course with a little
bit of repetition thrown in there for
good practice you will have a rock-solid
understanding of what WordPress
functions are at your disposal and what
they do I'm never a fan of pre-emptive
memorization I'm big on practicing
experimenting and organically building
up your understanding so long story
short
even if you didn't understand everything
in this lesson 100% I wouldn't worry
about it because we're going to keep
practicing these same concepts several
more times
hopefully this lesson cleared up a bit
of confusion let's keep things rolling
and I will see you in the next lesson
hello everyone in this lesson we will
learn how to set up a menu of children
page links for the current page that you
are viewing so for example if I navigate
to our about Us page we know that this
page has two children pages named our
history and our goals but we don't see
links to those anywhere so our goal for
this lesson is to add a menu right about
here that has links to the applicable
children pages if you think back to
several lessons ago you will remember
that we actually commented out that menu
so over in your text editor within your
theme folder jump into page dot PHP and
if you scroll down about halfway or a
little bit further
remember this div that we commented out
so at this point we can just remove
these comments and then remove this
closing comment down here okay so we've
got this div with a class of page links
and if I save this and refresh the page
here's the menu that I'm referring to
but right now it's hard coded which
means it's not dynamic what I mean is
the hard-coded data of about us our our
history and our goals only makes sense
because that's a contrived example but
if we scroll down to the footer and
click on the privacy policy page now it
becomes painfully obvious that the menu
is not dynamic right instead of about us
this should say privacy policy which is
the current parent page and then down
here we should see links to any privacy
policy children pages so right now let's
begin writing the code to make this menu
dynamic let's focus on this list of
children links first and then after that
we'll work on this parent page header
link so back in the code here is the
unordered list of links right there's a
list item for
each link so we don't want these list
items to be hard-coded so let's just
delete these so now we have an empty UL
element and within that element let's
drop in to PHP and let's call a
wordpress function named WP list pages
now before we even worry about providing
any arguments inside the parentheses
let's just save this and see what it
does so that function created links to
every single page on our website which
is obviously not what we want we only
want children pages of the current page
being viewed also up here we can see
that this function outputs this odd
little title named pages and we don't
want this so the question becomes how do
we tell this function WP list pages to
do what we want it to do well obviously
that's the job of arguments that we can
pass it within the parentheses however
this function needs us to provide it
arguments in a very specific format so
for example we can't just include one
argument and then a comma and then
another argument instead this function
wants us to pass it an array and not
just any array it needs an associative
array so right now let's take a quick
timeout and forget about this function
and instead answer the question what in
the world is an associative array so
several lessons ago we saw an example of
a very basic array so to refresh your
memory let me create a very basic array
maybe I'll create a variable named
animals and set it to equal an array so
then within that array I can say cat
comma dog comma pig so an array lets us
have multiple pieces of data that live
within a larger collection however what
if I wanted to associate a value with
each
animal so for example what if I wanted
to list the sound that each animal makes
so for cat it would be meow for dog it
would be bark and for pig it would be
oink well in order to do that I would
need to create an associative array so
check this out let me delete this line
and let's imagine I want to create a
variable named animal sounds and I set
it to equal an array and then within the
array the first item is cat and then
right after cat I say equal symbol
greater than meow and then include a
comma and do the same thing for dog now
I could list all the items on a single
line but when I'm working with
associates of arrays just to stay
organized I like to put each one on its
own line
so we've got cat equals meow then comma
dog equals symbol greater than dog
equals bark comma pig equals point and
this is an example of an associative
array we've associated a value with each
item and now maybe later on in my code
if I want to access the sound that a dog
makes and maybe I want to echo it out
onto the page I can just say echo look
inside my variable so echo animal sounds
and then to look inside an array you use
square brackets and then instead of
looking for a zero-based numerical key
since we are working with an associative
array we can just reference this label
or key name so within the square
brackets I could just say dog and be
sure to end that line with a semicolon
and if we save and refresh there we see
the value of bark cool so now that we
are at least a little bit familiar with
an associative array let's get back to
the task at hand which is working with
this WP list pages function so let me
delete this example code and now let's
get down to business of providing this
funk
with an associative array that tells it
exactly what we want it to do so within
the parentheses let's say array and then
give the word array its own pair of
parentheses right this is how you create
an array in PHP now we could begin
typing here but just to stay organized I
like to drop down in between these array
parentheses on to a new line and the
first thing I want to do is tell the
function that it doesn't need to output
this odd little pages title so if we
don't want that title this function has
a parameter named titled underscore Li
for list item and we can just set that
to equal null so just like earlier when
we said cat equals meow or dog equals
bark we are saying the title equals
empty or nothing so if we save that and
refresh cool that awkward title went
away now we just need to tell the
function that we don't want every single
page on our website
we only want links to children pages of
the current page so back in our code
let's add a comma at the end of this
line so we can add another item to the
array and this function has a parameter
named child underscore of and we just
want to set that to equal the numerical
ID of a certain page or post now before
we make this dynamic let's hard-code a
number just to see how it works so for
example if I want children pages of the
privacy policy page I can find the
numerical ID of the privacy policy page
by going into my admin dashboard looking
under pages and if I click on that
privacy policy page to begin editing it
up in the URL address bar I can see it
has an ID of 18 so back in the code if I
say child of equals 18 save it and
refresh cool there we see cookie policy
which is the only child page of privacy
policy
and if I use this link in the header to
visit the about Us page if we want to
display the to about us child pages we
can just go into our admin dashboard
find the ID for about us which is 16 so
if I say child of equals 16 cool we see
the applicable child pages now obviously
we don't really want to hard-code a
number here we want this menu to be
dynamic right because if I go back to
the privacy policy page it should just
automatically pull in the correct
current child pages so in order to make
this dynamic your first instinct might
be to get rid of the hard-coded number
and use the wordpress function get the
ID right this will return the ID of the
current page so let's try that so that
works perfectly when you are on a parent
page but once we click on to the cookie
policy child page now that section is
completely blank and that's because once
we are on a child page now our code is
going to try to use that child ID and
try to find children of it and that's
not what we want so we need to provide a
different ID number here depending on
the situation if we are on a parent page
we can indeed go ahead and just use the
ID of the current page but if we are on
a child page we can't just use the
current ID we need to actively look up
the parent page ID so here's how I would
handle things up above this function so
right when we're getting into PHP here I
would just create an if statement so the
word if parentheses and then curly
brackets and for my condition within the
parentheses I would say if the variable
named the parent remember we set up that
variable in our previous lesson we
created a variable named the parent and
it will equal the ID of the current page
of parent page or if the current page is
a parent it will just equal 0
okay so let's leverage that variable
again down
here so this code is saying only if that
the parent variable does not equal zero
only if that's the case run the code
within these curly brackets or in plain
English only if the current page has a
parent do something so let's just create
a brand new variable and call it find
children of the name doesn't matter I'm
just making up this name but if you're
currently on a child page let's set this
to equal the parent ID okay and what if
this evaluates to false so if you're
viewing a parent page this will be 0
which will evaluate to false so this
code will not run and then what we can
do is right after this curly bracket we
can say it else and then open up a new
pair of curly brackets and this will
only run if this is false so if this is
the case do this otherwise else do
whatever we say here in this case let's
assign our find children of our made-up
variable in that case we can go ahead
and get the current idea of whatever
page you're viewing so get the ID cool
so now we've taken care of that
conditional logic now down here when we
are actually calling the important WP
list pages function we can just say
child of equals and we can reference
this variable of ours that we just made
up so find children of so let's go ahead
and save that and refresh perfect so now
even though I'm on a child page of
cookie policy we still see links to
children pages of the current section so
if I go up in the header and click on
about us we see the two sub pages and
even if I click on to our history we
still have the relevant child links okay
now at this point let's change gears and
work on this blue header link this
should always point back to the current
sections parent page so back in our code
here is that blue headline link and we
don't want it to be hard-coded to about
us
so first let's make the title dynamic
then let's make the href link value
dynamic so delete about us and drop into
PHP and then let's echo out the results
of a wordpress function get the title
and within the parentheses we can just
pass an argument of our the parent
variable this will work really nicely
with this function because if this
returns a 0 which means the current page
is a parent page this get the title
function interprets a 0 as meaning the
current page cool now let's do something
very similar for the href value delete
the hash tag drop in to PHP and let's
echo out the results of get permalink
and within the parentheses just pass it
an argument of our the parent variable
cool so let's save that and refresh so
we're currently on the our history child
page but if I click this blue headline
takes me to the parent page and if I go
down into the footer and click on
privacy policy I can click on this to
navigate to a child page and we can
always use this header link to go back
to the parent page ok so at this point
we've made the menu dynamic but now we
need to ask ourselves what happens if we
go to a page that isn't a child page but
also isn't a parent page because it
doesn't have any children of its own so
for example to show you what I'm talking
about up in the address bar if I visit
my sample page named test page 1 2 3
this page doesn't belong to any other
pages but it also doesn't have any of
its own children so in this case we
probably just don't want to display this
side menu at all right so we wouldn't
even want this blue headline to appear
so back in our code what I recommend
doing is wrapping this page links div
just wrapping that entire thing within a
PHP if statement so right before this
begins let's drop into PHP and say only
if
parentheses curly braket but let's only
use the opening curly bracket and then
dropped out of PHP so then we can have
all of this HTML and then right when
that div is going to end right after
that you can drop into PHP close out the
curly bracket for the if statement and
then close out of PHP so now all we need
to do is fill out the if statements
condition within these parentheses so we
only want to display this menu if you
are currently on a child page so to
check for that we can just use our the
parent variable right because on a child
page this variable will equal the number
larger than 0 so this will evaluate to
true and then right after that we can
say or we also want to display this menu
if you're on a parent page so the or
operator here is very powerful it lets
us have multiple conditions and if
either one of them evaluates to true
then this will run now believe it or not
in WordPress there is no easy way to see
if the page is a parent but there is a
slightly roundabout tricky way of doing
it so here's what I would do let's add a
line right above this current line that
we're on okay and let's create a
variable we could name it whatever we
want I will call it test array and let's
set it to equal the results of a
wordpress function named get underscore
pages this get pages function is very
similar to WP list pages really the only
difference is that this function will
handle outputting the pages onto the
screen for you whereas this function
just returns the pages in memory so if
this function is almost identical to
this function that means we want to pass
it an array of arguments so within these
parentheses let's say array and then I
like to drop down just to stay organized
and the only parameter we need to use
here is child of equals and let's just
use the ID of the current page so get
the ID and now if the current
Paige has children this function will
return a collection of any and all
children pages on the other hand if the
current page doesn't have any children
this function won't return anything it
will return null or false or zero and as
we know within an if statement if
something is zero or empty it will
evaluate to false so if the current page
has a parent or if it is a parent all we
need to do to check for that is just
type out our variable name test array so
or test array cool so let's save this
and refresh this test page which is
neither a child page or a parent page
and hopefully this menu should disappear
completely cool but if we go back to the
about Us page
the menus back in business we can go to
a child page we can go to the privacy
policy page things are looking good now
before we bring this lesson to a close I
have one last tip for you if I go back
to the about Us page you'll notice that
I have multiple children links and you
might be wondering how can you control
the ordering of these for example what
if I wanted our history to come before
our goals by default WordPress will use
alphabetical ordering but if you want to
use your own custom ordering all you
need to do down here when we are calling
this list pages function within our
array of arguments let's just add
another item and let's use a parameter
named sort column and set it to equal
menu underscore order now if we save
this and then jump in to our WordPress
admin screen if I jump into the page
that I want to be first our history over
in the right hand column in this page
attributes area you'll see an order box
now if I give that page in order of one
and then go give the other our goals
page in order of - well those order
values will determine which goes first
and that's going to bring this lesson to
a close that means we're done with
relatively boring page
and now we can move on to dynamic
navigation menus and building out our
blog and after that we'll get into the
truly fun stuff probably the reason you
signed up for the course in the first
place which is learning about custom
post types custom fields creating
relationships and pulling in information
dynamically with JavaScript we've come a
long way but we still have tons to learn
let's keep it rolling I'll see you in
the next one to get immediate and
lifetime access to the full 26 hour
video course
you can find a coupon link in the
description for this video thank you so
much for watching and take care