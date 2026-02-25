# Visualizing transformers and attention | Talk for TNG Big Tech Day '24 (01jdj7wmxx6qnzfsxyh63ykfk4)

Source: Visualizing transformers and attention | Talk for TNG Big Tech Day '24 (01jdj7wmxx6qnzfsxyh63ykfk4).html

I've been working on this project um
about visually explaining Transformers
as he said I love visually explaining
all sorts of things usually in math but
I'm happy to stray into the adjacent
Fields the target audience here is
always a little bit tricky because I
know many of you are engineers and are
quite technical but I don't necessarily
want to assume too much background from
people the one thing I will assume is
that you're maximally curious that
you're hungry to dig into the details of
what's going on for example I think most
people know that large language models
consume a lot of computation they take a
lot of resources and anybody who has
looked at the market cap of Nvidia
recently will also know that they tend
to be run on gpus because they're very
parallelizable one of the things I would
like you to come away from this talk
with is a deep to your bones visceral
sense for what those actual computations
are what the number crunching happening
is and why it's so conducive to
parallelization which is one of the big
reasons for the success so Transformers
um were introduced in this now very
famous paper called attention is all you
need from 2017 and that paper was
focused on a specific use case of
machine translation you might imagine it
used for Google translate and things
like that but since then it's seen a
flourishing in all sorts of other tasks
it's not just useful for machine
translation but it's good for
transcription with tools like whisper
it's good for going the other way around
having tools that will take in a piece
of text and synthesize speech um it's
even good for image classification it's
it's a remarkably flexible framework but
the model that you and I are going to
focus on today which is the kind that
underlies chat Bots is a little simpler
than the one that they introduced in
that paper the model is going to be one
which is trained to take in a piece of
text and then predict what comes next so
for example here if you feed at the text
to date the cleverest thinker of all
time was it's going to predict from its
vocabulary what the word might be but it
doesn't just give a single prediction it
assigns a probability distribution to
all possible Snippets of text that might
come next in this case there's a lot of
possibilities for what it might be so it
has a relatively spread out distribution
over a lot of different things including
some you know equivocation recognizing
it's going to use the words like
probably or undoubtedly arguably that
kind of thing if you have a model that
does this that simply predicts what word
comes next you can turn it into
something that'll generate new text
simply by having it randomly sample from
that distribution you have it look over
and weight it according to the
probabilities that it gave sample some
word tack that word on to the input that
it was processing and then run this
extended version all through the process
again saying okay now that words on it
what do you predict will come next runs
through the whole thing which takes
quite a lot of resources and again it
plays this game of sampling from that
tagging it on and repeating now a lot of
people will ask why you would ever have
it choose something that's not the most
likely word if it generates that you
absolutely can do that if you get into
the notion of something called
temperature this will come from
assigning the temperature equal to zero
the answer is just you get very stilted
outputs that sound kind of trit um and
you get a little bit more creativity
sometimes or something that just sounds
somewhat natural if you introduce that
spark of Randomness into it now if you
want to turn this into a chatbot
something that tastes seed text uh and
then extends it the simplest way you
could start for that kind of project
would be to have your seed text
establish an environment of a user
interacting with some kind of
hypothetical helpful AI assistant take
the user input that they typed into your
chatbot website tag that on into this
input suggest to it that what's about to
be generated is whatever that
hypothetical AI assistant would say and
then have the model start to generate
those again one word at a time really
one token at a time but we'll get into
that in a moment so in this case um I
took a a relatively simple model and
have it uh provide some suggestions for
what to do while visiting unic and it
goes through and does this random
sampling process and I'll leave it to
you to judge whether or not it
suggestion uh seems reasonable here but
it's kind of surprising that this should
work I think that the Act of having
something that simply predicts the next
word would get you something that seems
to have long range thinking and some of
that comes from the way that it's doing
that prediction and just how long range
the associations can be so what I want
to First do is show a high level sense
for how data flows through this whole
model we're not going to go into the
details yet but we will just how does it
flow through and then we'll dig into
some of the things that I think are
required to get that nice visual
intuition we want to go for so when it's
faced with this task it's given a piece
of text wants to predict what comes next
and the text could potentially be quite
long but I'll just show what I can fit
on the screen the first step is to
subdivide it into little pieces and we
call these pieces tokens in the case of
text they're very often words or little
pieces of words sometimes punctuation
marks but one thing to keep in mind is
that this doesn't necessarily have to
just be with text tokens could also
include little Snippets of an image or
little Snippets of a sound if images or
sound are somehow part of that input or
if you're creating a different model
that's doing a different task like uh
trans description or image processing
and the process there roughly looks like
subdividing it into little pieces and
then uh having some sort of vocabulary
of what all possible little pieces are
now in the case of text one little
question that might be worth having in
the back of your mind uh as we go
through this is to ask you know why not
just break it up into characters that
seems like a much more Natural Choice
For What the atomic unit of text would
be to break it into characters and then
do whatever we're about to do with
tokens there and I just want you to
think about that so we're going to go
through and I'm going to return to this
question but as we do like think to
yourself what would what would go wrong
like why wouldn't why wouldn't this work
well or maybe it would work well if we
broke it into tokens instead excuse me
broke it into characters instead the
first thing that happens you have to
know something about what happens to be
able to answer that question the very
first thing is to associate each one of
those tokens with a long list of numbers
and if we think of those list of numbers
as vectors we'll call it the embedding
of the token and you want to think of
those lists as somehow encoding the mean
meaning of each one of those tokens and
at this phase it's essentially just a
lookup table each particular token is
always going to be associated with the
same Vector each time that you run it um
but the first thing that happens is that
you pass that through this all important
attention block the thing that we're
going to spend the second half of this
talk digging into which lets those
vectors talk to each other in a certain
way and pass information back and forth
between one another so that one that
might have just started by encoding a
given word might end up taking into
account some of its cont context for
example sometimes words can be ambiguous
if you take the phrase American true
mole and the phrase one mole of carbon
dioxide and the phrase take a biopsy of
the mole you and I read those and we
understand the word mole means something
fundamentally different in all three of
those cases because of the context so
you want to give the machine a mechanism
by which it can let words talk to each
other so that that meaning could get
updated but it might not just be
disambiguating the meaning of a word it
might be that you want to bake some sort
of substance or essence of the entire
context that's somehow relevant for
predicting what might come next into a
single one of these vectors because what
happens here is it doesn't just go
through this one attention block but
it's going to flow through many
different iterations um so the next
thing it passes through has kind of an
overly fancy name it's called a
multi-layer perceptron um it's the
simplest kind of neural network when you
break it apart it looks like a couple
Matrix multiplications with a little
nonlinear something sprinkled in between
I won't go into too many details on this
particular block but the one thing I'll
say is the majority of model parameters
actually live in this multi-layer
perceptron despite the title attention
is all you need in a sense of counting
parameters it's about onethird of what
you need and if you want to ask okay
what why what's going on with these it's
a little hard to say the question of
interpreting any of this is a bit of a
challenge but there was some fun
research put out by a couple um
interpretability researchers from Deep
Mind in December where they were
studying where facts like associating
athletes with their sports live inside a
model so if you have it autocomplete a
phrase like Michael Jordan plays the
sport of blank if it successfully
predicts that basketball is the most
likely answer that answer was nowhere in
the context it couldn't just have come
from passing information back and forth
between tokens it has to mean that
somewhere inside the parameters of the
model that it learned during the
training process it somehow encoded the
fact that Michael Jordan plays
basketball and they did a study where
they were doing a whole bunch of
associations between athletes and sports
and trying to probe at the network to
figure out where that probably lived and
the answer seemed to be inside these
multi-layer perceptrons so one thought
you could have in the back of your mind
is that in so far as prediction requires
context this is where the attention
blocks are relevant and in so far as
prediction requires just general
knowledge from the world these uh
perceptrons give extra capacity to store
some more of that it's not to say that
they can't live in the attention blocks
but it just gives a lot more capacity
for that and that's basically it it's
just those two but you go back and forth
between many different iterations of it
you'll pass through another attention
block pass through another multi-layer
perceptron and repeat over and over the
thing that makes deep learning deep is
this repetition of a certain kind of
operation many different times and what
you do is you say you're going to flow
it through uh sometimes on the order of
you know a 100 times gpt3 for example
has 96 different layers and at the very
end you want to look at just the last
Vector of that sequence in this case
that last Vector initially was encoding
the word was but the hope is that at
this point it's absorbed so much meaning
from its context and absorbed so much
meaning from the general knowledge baked
in the weights of the network that it's
able to make that prediction in the
sense that you can apply a certain
simple operation just to that last
Vector that produces this probability
distribution over all possible tokens
that might come next might feel a little
bit weird that you're just doing it on
the last Vector because in the rest of
it you have this big sequence of very
context-rich vectors but what happens to
be the case is that for the purpose of
training it's very efficient if all of
those other vectors are simultaneously
being used to predict what comes next at
very I different points for subsequences
of the text that you're putting in that
way one training example can can act
like many and now I know you know this
but just to keep in the back of your
mind the whole framework behind any kind
of machine learning is that rather than
telling the network what to do in a very
designed sense where you're going and
fine-tuning okay I want you to do this
with this token and that with this token
you instead just provide a very general
framework and that framework is
characterized by a bunch of tunable
parameters just real num numbers that
you can change often hundreds of
billions of them and you show it many
different examples of the inputs and
outputs that you might want it to have
in this case just random Snippets of
text say behold from the internet and
then what the actual word following was
and as long as you have some kind of
procedure that will tell it how it's
doing on a particular example either
saying O you did poorly on that example
you need to change your weights this way
or you did well on that example you
don't need to change too much then if
you run this through for many many many
different examples presumably some kind
of behavior emerges within that flexible
structure now the reason that's
important to keep in mind is that it
means actually understanding what's
going on is extremely challenging
because it is an entirely separate
question from the design of the network
itself and understanding what the
computations are what you and I are
going to do is mostly focus on what are
those computations and what is the
framework and we're going to use some
motivating examples of what we think it
might do to help learn what that
structure is and make it more memorable
but the actual question of what it's
doing in AEP way is a very very unsolved
one still today the specifics if you're
curious for how this um training will
look at a high level you have a cost
associated with each example so let's
say it's autoc completing a phrase um
TNG technology Consulting is a blank and
from actuals of text that it pulled from
the internet let's say one of the
examples included the word leading
following in there what you would do is
say what probability did you assign
little Network to the actual next word
that it was was and then you take the
negative log of that probability and
that defines a cost so you kind of see
the graph here and essentially what it
means is if it assigns a probability
closer to one that cost is very close to
zero but if it assigns a very low
probability as in it wasn't predicting
the word that they're actually was um it
increases very steeply as you get there
and this is just the cost on one example
in principle the cost for the entire
network is going to be a sum or an
average for the cost over the many many
many trillions of examples that you give
it and so the visual you might have in
your mind Loosely is that there's a kind
of surface where what you and I can
graph and uh show on a screen is limited
to something where you have a function
who maybe has two dimensions of inputs
two different numbers as inputs and then
that cost as a third dimension for that
output and that would get you this
surface and in principle you want to
find a low point on it where there's a
low cost but of course the network
doesn't just have two different
parameters as the input it would have
hundreds of billions of parameters so
it's going to be some super super high
dimensional cost surface but still the
the thought that you have in your mind
is that the process of learning involves
tweaking those parameters iteratively so
that you're taking little steps downhill
on that surface it's not going to be in
two Dimensions it's going to be in some
crazy high number of Dimensions but
still the idea is that you're slowly
tweaking it in some way to try to find a
minimum on this cost surface what that
means is you really have no idea what
behavior is going to emerge with those
parameters because it's whatever emerges
on this unbelievably complicated surface
and what local minimum it happened to
fall into so that's that's a thing to
keep in the back of your mind now one of
the visuals that we can try to get to
this um comes from something that is
very relevant to parsing everything that
happens with Transformers but was not at
all new to Transformers it existed in
natural language processing for a while
which is this very first step where
you're associating words with vectors in
some way now on the one hand the reason
you have to do this is that if you're
doing uh certainly deep learning but but
most categories of machine learning it's
very very helpful if your inputs and
your output puts are both real numbers
things that you can change continuously
because that way you can do calculus and
you can do things like gradients so
converting words into something that's
expressed in this continuous realm like
a vector space is a very natural first
step for that but what's very fun is to
look at what kinds of patterns emerge as
you train the network and as you see
what sort of embeddings it stumbles upon
for doing whatever task it's trying to
do whether that's next word prediction
or something else that presumably
requires understanding language in some
way one of the things that will emerge
is that words with very similar meanings
tend to Cluster near each other so if
you look at all the nearest neighbors
for a word like Tower in a simple word
to VEC model you get a lot of other
words that have kind of these tall
construction building is Vibes and these
are um in some sense a cluster that
represents a loose idea represented in
that point in the space but it gets a
lot more interesting than that because
it's not just a matter of where the
words are and how they cluster but also
that directions in the space might
encode different sorts of meanings that
aren't necessarily captured in a
particular word but just a more generic
idea so there's this paper in 2013 from
some Google researchers uh it's called
efficient estimation of word
representations in Vector space and they
had a number of very memorable examples
in there but one of them that they
pulled out was how if you take the
embedding of woman and you subtract off
the embedding of man so you might think
of it as the sort of difference Vector
in that space and then you add that to
the embedding of King so you take that
difference and you add it to King and
you search what are the nearest vectors
at that point in the space what you find
is that it's actually quite close to the
embedding of Queen which is very fun
it's a very mathematical way to
basically play the analogy game that
would be on like old SATs or things like
that it is fun I tried to reproduce this
though by downloading a certain uh
simple word to Vector model and it kind
of worked but actually the the the
nearest neighbor to that point was the
word King itself Queen was the second
most nearest neighbor it sits a little
farther off which kind of makes sense
because the way that queen as a word
shows up in training data is not just a
feminine version of King you have things
like the band Queen or the word drag
queen but where it worked really well as
if I played around with family
relationships so you know the difference
between uncle and Aunt is quite similar
to the difference between man and woman
um and other things like that the upshot
is that somehow during this training
process with this abstract gradient
descent notion it's as if the model
learned to associate one specific
Direction in this space with the notion
of gender in the sense that adding a
little Vector in that direction to a
word can take you from the masculine
embedding to a feminine embedding that's
very cool and there were all sorts of
other fun examples they put in there um
I think one that stood out to me was uh
if you if you take Japan associated with
sushi and then ask it to associate
German with something it would naturally
put bror in there just you can just play
this game with
subtraction now it's very hard to
visualize these things right because we
can draw three-dimensional vectors which
are representing lists of three numbers
but these word vectors in principles are
very high dimensional and you can
understand why it's helpful for them to
be high dimensional because if you want
to encode concepts with distinct
directions in the space then you would
like to have a lot of distinct
directions to work with at your disposal
in this case um to take the numbers from
gpt3 as an example the vectors that
we're embedding our tokens to have
12,288 coordinates so in principle this
embedding space is 12,000 Di iions so
it's very very big but I also kind of
want to explain why that it's even
bigger than you might think it is like
weird things start to happen in higher
Dimensions to get a sense for why this
might be helpful you should keep in mind
we don't just want these to be encoding
an individual word it's not just the
various meanings of a word that might be
relevant what we want to happen as it
flows through the network is for these
to have the capacity to soak in whatever
meaning is relevant from the context so
here if I take a little bit from the uh
famous Robert Frost poem the road not
taken when we look at that last part of
the passage two roads diverged in a wood
and I took the One Less Traveled by the
word one would start its life in the
Transformer simply being embedded to a
generic embedding of one that knows
nothing other than you know maybe it's a
number a pronoun things like that once
it has the ability to soak in context if
you want to predict what comes next it
would be helpful to somehow know that
it's one of two roads to know the
antecedent of that pronoun it might even
also be helpful you let it flow through
the network and get it to ruminate on it
more to somehow encode the more
highlevel inarticulable poetic ideas
there that it's symbolizing Choice what
it's a choice between those very high
level ideas if you can embed them in the
vector might be relevant to predicting
the next token and anyone who's
interacted with these llms often gets
the feeling that it really does seem to
understand something at a at a deeper
level that's not just as simple as
defining one word versus another and
when you think about it from that point
12,000 Dimensions doesn't actually feel
like all that much um like on the one
hand okay that's a that's a large number
of uh different directions you could
work with but if we want to encapsulate
every possible concept just with a
distinct Direction in this space well it
doesn't seem like that much to work with
I'll give two quizzes here one is a
relatively easy and uh uninteresting one
and the second one is dramatically more
interesting so quiz number one is to ask
if you have a bunch of vectors you know
how many vectors can you fit into an
n-dimensional space so that every pair
is 90° apart part the reason this would
be relevant if you want distinct
directions in the space to correspond to
distinct ideas if they're perpendicular
that helps you from having unwanted
overlap like for example if you have
some direction that corresponds to the
idea that the words being spoken are in
German and then some other direction
corresponding to the idea that the
general tone of speech is one of
skepticism you don't want those two
align over each other because that would
mean that anytime that you're speaking
German it accidentally infers that it
must be skeptical in some way maybe that
one's not a bad idea but in principle
you want more independent
directions now with this the answer uh
for an n-dimensional space is n this is
actually kind of what defines the notion
of Dimension at least in an abstract
sense for a vector space now a fact that
I I didn't know that's a pure math fact
which is very fun and fascinating until
I was talking to some people who do
interpretability research into large
language models is a slightly related
quiz which is to say how many vectors
can you fit into an end dimensional
space not so that every pair is
perpendicular but so that every pair is
kind of almost perpendicular let's say
you give a little buffer where they can
be somewhere between 88 degrees and 92
degrees if you think about it you know
if you're just going from
two-dimensional to three-dimensional
intuition you play with it in your mind
it kind of can't fit anymore like that
that that little wiggle room doesn't
give you that much it turns out as you
scale things up the way that the answer
to this question grows is exponential in
the number of dimensions and I I tried
playing around with with this a little
bit I I would actually love if any one
of you out there wants to give a
numerical answer to this in the case of
say a thousand Dimensions or 10,000
Dimensions when I was playing with 100
dimensional vectors I could definitely
comfortably fit like hundreds of
thousands in that would be quite close
to each other in this almost orthogonal
way it gets a little computationally
expensive if you try to do it with a
thousand dimensional vector and you know
hundreds of millions of them but it's
shocking actually you can fit very very
many even though you know 88 degrees 92
degrees to our eye those look almost
orthogonal and this might explain a
couple different things one it might
explain how these models can actually
fit quite a few ideas into a seemingly
small space small in the sense of uh
compared to the number of Concepts in
the world you know 12,000 isn't that big
and also why they scale surprisingly
well because you don't really get this
effect of exponential growth kicking in
until you get to a certain Dimension and
so as you go from say 10 to 100
Dimensions it's not just that you're
getting a hundred times as many
directions at your disposal you're
getting many more than that and as you
go from a 100 to a thousand dimensions
again you get this sort of super linear
increase now that's just a thing to keep
in the back of your mind so that every
time I'm trying to motivate something by
saying oh imagine some direction in this
space encodes such and such idea even
though that's a little bit of a madeup
example for the sake of motivating the
structure it's maybe not that
implausible to have certain very
specific Concepts correspond to certain
specific directions in the space so with
all that said let's get into the meat of
the matter which is what's going on
inside this attention block what is the
specific mechanism M by which
information is transferred back and
forth between these vectors and once you
do you can have the sense of what is the
number crunching that happens inside a
large language model and why is it as
parallelizable as it is the way I'm
going to do this like I said is by
telling a little bit of a lie where
we're going to imagine something that we
might want it to learn we would hope
that it learns but this isn't to say
that it's necessarily what actually
happens in production models let's say
we have got you know some kind of phrase
like a fluffy blue creature run The
Verdant Forest we want to think about
how do the nouns in that phrase get
updated by the adjectives and what I
mean by that is when you initially
encode all of these because they don't
have any notion of their context from
the initial encoding the vector
associated with the word fluffy for
example is just some abstract notion of
fluffiness not tied to anything or the
vector associated with creature is just
some very generic notion of creature
that's not going to be any more specific
than that but we want to somehow get it
so that these talk to each other and the
relevance of fluffiness and blue nits
gets baked into that creature word I
should say it's not just that they
encode the particular word they encode a
little bit of extra information too
which is the position that it shows up
in the context so that position kind of
gets baked into the vector and this is a
very important idea because one of the
philosophies here is you want to keep
everything parallelizable which means if
sequential relationships are relevant
you know something is right next to
another one you don't want that to have
to be inferred from the way that the
data is processed say going through it
step by step instead that should
entirely be inferable simply from the
state of the vector itself regardless of
what order things are processed in but
in principle each one encodes basically
just the the meaning of the word also
the position so at the moment if we're
envisioning it uh with these little
diagrams here what you would want is
that after the attention process goes
through and after you do whatever
computations we're going to do the
vector associated with that token
creature would now encode the much more
specific notion of a fluffy blue
creature or the vector that was
associated with that position of forest
now encodes a much more specific notion
of a forest that has some greenness to
it and the constraint that we have it's
not a hard constraint but a uh a helpful
design choice if you're doing any kind
of deep learning here would be to make
sure that all the operations that you're
working with to somehow ask the question
of which ones are associated with which
and how should they update other are
expressed in the language of matrix
multiplication because if you do that
where you have a bunch of matrices that
are filled with tunable parameters then
this process for training which relies
on gradient descent and a thing called
the back propagation algorithm can work
very efficiently and it's in part
because matrix multiplication can be
done very efficiently on gpus in
parallel um it's in part because it's a
linear operation and when you're doing
calculus with that the derivatives are
nice and simple there's no added
complexity that emerges so in general
try to say how can I somehow Express
this notion of letting one thing
influencing another only using the
language of multiplying matrices where
those matrices have tunable weights in
them that can be hopefully uh learning
to do what we want them to do and
there's three matrices that are going to
come up they're called the query the key
and the value matrices and we'll go
through them each one by one but to set
the stage the query Matrix
is as if you want to let each word ask a
question so you might imagine the word
creature or other thing in there asking
hey are there any adjectives sitting in
front of me because right now it can't
really see its context it just knows its
position and it knows that it's a noun
and you also want to give the adjectives
that sit in front of it the capacity to
somehow numerically or mathematically
respond to it answering yeah I'm an
adjective I'm in that position now of
course they don't literally ask instead
the way that this looks is to associate
the embedding for that word in creature
with a new Vector it's what we're going
to call the query vector associ ated
with that token and this query Vector is
commonly much smaller than the embedding
so if that embedding Dimension was like
12,000 Dimensions um the pretty common
choice for keys and queries would be
like 64 or 128 dimensions and the way
that you generate this query Vector is
going to be with a matrix you take some
big Matrix you multiply it by the
embedding and presumably it should
somehow be able to pick up on oh this
embedding is for a noun and it's a noun
in a certain position and the query that
it spits out should should somehow
encode the idea of looking for an
adjective in certain positions the
visual you might have in your mind is
that if that embedding Vector was in
this very big space pointing in some
direction and coding all of that we're
mapping it down to the smaller space to
ask the question and this isn't just
something you do to one of the words you
do it to every single one of the words
you multiply them all by that same query
Matrix and what that would mean is that
every time it hits a noun the query that
it produces is going to be effectively
asking hey are there any adjectives in
such and such position sitting in front
of it you might naturally ask what is it
doing to all the ones that aren't nouns
and who knows maybe it's trying to do
something else in parallel for the
moment given that we're just making up a
toy example to motivate the structure I
can say let's just focus on the nouns
and then talk about all the other things
that you might want a mechanism like
this to do later and whether that would
be accomplished in parallel in the same
Matrix or not so you apply this to all
of the different embeddings get this
sequence of query vectors and in the
same moment you also multiply them by a
distinct Matrix what we're going to call
the key Matrix I'll label it as WK and
you produce a sequence of keys and it's
entirely analogous those keys are also
going to be smaller vectors in that same
smaller space and the way you think
about it would be that uh they're kind
of answering a given question the keys
and the queries are trained together so
that if a query Vector was uh picking up
on a pattern like looking for adjectives
before it the key Matrix should be
something such that when there are
adjective sitting in a position before
it it spits out something that will
correspond to the answer yes we'll see
what that that means in just a moment
for for them to correspond but like
everything that we see this key Matrix
is just full of parameters that are
learned during the training process so
whether this is actually what it does is
a separate question but the hope is that
you're giving the model capacity to do
something like
this so if you have all of these keys
and you have all of these queries and
you've trained everything just you know
hoping that a bunch of data will somehow
get these patterns that you're hoping
for you might think of those key vectors
in the same way you've taken something
from that very big embedding space and
you've mapped it down into that key
query space and you should think of that
smaller space as really being the same
one where the keys and the queries live
in the same space because what we'll
mean by saying that the key is answering
the query is that they align in this
space that they kind of point in the
same direction so if you were to take
whatever query was produced by creature
asking hey any adjective sitting before
this position for then the key prod by
those words blue and fluffy should point
in a similar Direction so that you can
pick up on the fact that they correspond
by somehow measuring whether they point
in the same direction so how do we
measure that things point in the same
direction I mean there's a number of
different ways but certainly in the
context of machine learning where
everything is friendly if you can just
multiply things and add them up and do
nothing more complicated than that
easiest tool in the belt is the dot
product um this dot product is going to
be positive Whenever two vectors align
with each other um it's going to be zero
whenever they're perpendicular to each
other which we'll think of as meaning
unrelated and it's negative whenever
they point in kind of opposite
directions so if after producing all
these keys and queries you take each
pair of them and you take a DOT product
between every possible pair this is
going to give you a grid of values
that's telling you which words are
relevant to updating the meanings of
which other words so the way I might
like to visualize this is U thinking of
all of those points inside the grid as
literal dots where the big dots
correspond to large dot products small
dots to smaller dot products
um so in our particular example with
adjectives and nouns that pattern would
look something more like this or for
example if we zoom in and you look and
you say Okay fluffy and blue each kind
of give us something which is you know
very large when they're being related to
the word creature and then everything
else is small in
comparison that's going to be something
we can work with and the question is
okay what what are we going to be able
to do with this if you pick up on which
words are relevant to which other ones
now the thing that we're going to want
to do and there there's a certain lingo
for this by the way where anytime this
happens you say that those tokens on the
left attend to the Token on the top so
in these case the adjectives attend to
the creature what you want to do is take
some kind of weighted sum according to
how much each of these vectors on the
left attends to one of them on the top
and we're going to take weighted sums
along the column such that we want the
big ones to matter more and then the
small ones with very unrelated words
like the down in the row to matter less
but at the moment these aren't weights
these are just outputs of a DOT product
that are maybe very large positive
numbers or large negative numbers and if
we want them to behave like weights we
need them all to be between zero and one
and for them to all add up to one and
once we have it like that we'll take a
weighted sum in a couple minutes you'll
see what it is that we're taking a
weighted sum of but just knowing that we
want them to act like weights the tool
in the belt for this another very common
function that comes up in machine
learning contexts is something called
the soft Max it has a very elegant
little formulation you essentially
exponentiate everything and then
normalize it
but all you really need to think about
is that it takes an arbitrary list of
numbers they could be positive could be
negative they could even be infinity and
the output is going to be a list of
numbers where each one of them is
between zero and one and if you add all
of them up it adds up to one and the
larger numbers from the input will
correspond to larger probabilities
basically larger weights in that output
and then the smaller numbers from the
input end up closer to zero so the
reason we call this soft Max is that it
acts kind of like a maximizing function
where if one of those numbers in the
input was notably bigger than the rest
then the Distribution on the output has
almost all of its weight towards that so
if you were sampling from that
distribution it's effectively the same
as just choosing the maximizing input
but it's softer than a Max in the sense
that as you continuously change things
you get this smooth change in what that
output is which again is friendly if you
want to be doing calculus with this
which is what's going on with that
gradient descent under the hood so we
take this list of numbers that we want
to act like weights that are currently
just arbitrary things between negative
infinity and infinity and you run it
through a softmax and you do this to
every single column in this diagram so
every column that corresponds to one of
the queries you're taking the softmax
with all these dot products and it's
giving you a sense of weights for which
other words are going to be relevant to
updating the one at the top of that
column there's a little Nuance that I'm
uh not illustrating in the diagram here
where before the softmax you uh divide
by the square root of the dimension for
that key query space doesn't matter it's
something that's helpful for numerical
stability but if you're curious that's a
little detail missing here so once we
have this grid this is properly what I'm
going to call the attention pattern
associated with this well it's actually
not an attention block but just ahead of
that attention block and this attention
pattern again I kind of like to
visualize with a bunch of dots just
giving you a sense of which things are
most relevant to which other things but
there's one tiny more Nuance that we
need to address before we actually use
this to make any updates and it has to
do with something I referenc a little
bit earlier for how during training
there's not just one prediction that
takes place but actually quite a few
different predictions as it processes a
given input so here if it's taking in
the phrase The Fluffy boo creature
roamed The Verdant forest and predicting
the next word as it all flows through
the Transformer what comes out on the
other end is going to be a prediction at
every single step along the way for
every different subsequence of tokens
and again this might not seem super
relevant in the case of something like a
chatbot where it's generating text like
why are you predicting the next word you
already know what the next word is but
it's very relevant for training because
it means that if you feed in this
particular thing rather than just having
one particular training example which is
whatever actually follows this you get a
whole pile of training examples where
it's using those same weights to try to
make predictions all along the way and
so all of the weights get to be updated
by all of the different predictions that
it's making for that one bit of
processing and the context can get quite
big it can be thousands of different
tokens so that can mean the difference
between a single training example and
thousands of training examples for one
particular run now if this is going to
work if you want to be able to get this
training efficiency speed up by having
it do all of this in parallel it means
that even though it's processing the
full block of text for example here if
it's saying you know the fluffy boot
creature blank and it's predicting what
you know verb might come next or what
word might come next it has to somehow
ignore the fact that it already knows
because that's in the input the word
that comes next and given that the
attention mechanism is letting all the
vectors talk to each other if you just
blindly let it allow all of them to talk
to each other each one along the way
would have the answer given away to it
so what you have to do is take all of
the positions that correspond to later
tokens influencing an earlier token and
do something to zero them out so in this
case you know everything where there's a
later token like the word roamed sitting
before an earlier token like the word
creature that's something that we're
going to want to make sure is zero and
by the way if you see diagrams like this
in other sources there will be different
conventions on whether people are
putting the queries at the top or the
keys at the top and so you might see
this masking look transposed from where
it is now but just as long as you think
about the influence of it is that you
don't want to let later tokens influence
earlier ones you have to set those to
zero now if you just naively set them to
zero the problem is that your columns
wouldn't be normalized anymore so given
that we want to use them as uh weights
for a weighted sum in a moment that
would mess things up um you could say
okay well then just set them to zero and
then renormalize the columns but another
way to do it that is a little a little
bit more elegant before applying the
soft Max set all of those values inside
that masked region to negative infinity
and this feels a little bit weird if you
haven't spent a lot of time with soft
Maxes but the effect of that is that any
component that was negative Infinity
after you pass it through the softmax
goes to zero and then automatically
because the output of a softmax always
adds up to one The Columns are going to
be normalized in this way so this gives
you what you would call a masked
attention pattern or sometimes people
call it causal attentiona self attention
because you don't want to let later
things influence earlier ones now a
thing you might think about in the back
of your mind at this point is just at
this point creating this attention
pattern that determines which tokens are
relevant to updating which other tokens
as you increase the context size which
is how much text it's incorporating into
its prediction this pattern that it's
producing grows quadratically with the
size of that context so this is why it
can be very non-trivial to just take um
a traditional Transformer and simp
simply scale up the context so anytime
you have some of the newer large
language models with very large context
Windows they have to be doing something
a little bit clever they have to have
some variation on the original attention
mechanism and another thing you might
pause and Ponder on here is even though
it is a very large pattern that you're
going to get as you have very large
context sizes when you're going through
this process of some large language
model producing new text doing it one
token at a time you might notice that
there's going to be a lot of redundancy
in each one of those computations CU
remember in principle for each one of
those tokens it's generating it goes
through the whole process where all the
data flows through this network and does
everything that we're talking about here
for each one of those tokens but because
a lot of them are the same when it's
generating new text like this there is a
lot of redundancy and you can have a lot
of clever caching to basically take
advantage of it so that you're not faced
with that quadratic speed up at
inference time it's something that's
much more relevant during training um or
during the very first pass when it's
making its very first token another
thing you might want to reflect on that
question from earlier where I said why
don't we just break up our input into
characters why aren't tokens just
characters because that feels like a
much more natural like Atomic unit of
what text is couple answers here one of
them would be the context would just be
much bigger and given that scaling with
context uh involves scaling
quadratically that can bloat your
network very fast um another one would
be that as you embed these tokens and
you want them to embed some notion of
meaning if they're just going character
by character it has to get processed by
the first couple layers of the network
before it could possibly get in the
meaning of the relevant words whereas
you let it just kind of jump directly to
the meaning of words from that very
first step if you do it at tokens
there's a balancing act though because
you can't make the tokens too big
because you want them to be something
that shows up sufficiently in training
data that you can learn from it if your
tokens were like paragraphs each one
would only show up at most once in the
training data and you would hardly be
able to learn anything from it so the
pattern that people have found that
seems to work quite well as something
called bite pair encoding if you want to
search further on it but in the back of
your mind you just think of it as words
pieces of words punctuation marks things
like that so given that you figured out
or the model has presumably figured out
which words need to be uh relevant to
updating which other words the question
is how that actually happens how is it
for example that the embedding of a word
like fluffy talks to the embedding of
creature so to somehow update it to
point in a more specific direction that
encodes the notion of a fluffy creature
simplest way to do this is just throw
yet another Matrix at it we can call
this the value Matrix and it's going to
be something where if you multiply It by
Say a given adjective the value that it
produces this new Vector that it
produces is something such that if you
add it on to a given noun add it to the
embedding of a noun it will point that
noun in a more specific direction that
also encodes whatever the relevant
meaning of that adjective is so in this
case it might add a certain fluffiness
direction to uh the word for creature
but if you multiplied it by something
like blue then it would produce a new
Direction such that if you add that onto
the result then you would be pointing in
an even more specific Direction it's of
a fluffy blue creature you could do this
this would actually work perfectly fine
but if you look at the number of
parameters involved here because those
key in query matrices we're mapping to
smaller spaces um if we take the numbers
from gpt3 each one of them ends up
having about 1.5 million parameters but
with this High dimensional embedding
space if the value is mapping from the
embedding space to the embedding space
itself it involves almost 100 times as
many parameters in it which could be
fine but it's a little more elegant um
and then it works more nicely with how
this all plays out in the context of
multi-headed attention which we're
getting to in a moment if that value map
is actually broken up a little bit and
involves fewer parameters where first it
Maps down to a smaller space and then it
Maps back up to the bigger space so
still overall it's something that takes
in these 12 dimensional things and spits
out some other 12 dimensional thing but
for the linear algebra enthusiasts among
you you might think of it as a low rank
transformation or just at a high level
it's something that devotes fewer
parameters of the network to this task
so when you have this value map you're
going to multiply by each one of the
embeddings in the same way that you
multiplied the key map by it to get a
bunch of keys and sort of associated
with each position of that key you have
a given value and what we're going to do
then is take weighted sums along each
column weighted according to the
attention pattern and the thing we're
taking sums of are these values so for
example in the column we have associated
with the word creature almost all of the
weights after the soft Max are going to
go to zero or something that's
effectively zero and the only other
tokens that actually attend to it are
the adjectives and so what we want to do
is take uh a weighted sum of those two
adjectives while everything else is
zeroed out and once we add all of those
together that's going to give us the
change that we want to make to the
embedding up top so this will produce
some change I might give it a little
name like Delta e and then the thing
that will pop out of the uh attention
block at the end is going to be whatever
the original Vector was that came in
plus this change and that change is this
weighted Sum along the column so the
hope is that for this kind of example it
takes something that encoded creature
and then it spits out something that
encloses a more specific direction of
that fluffy boo creature and this isn't
just doing it to one column it actually
does it to all of the different columns
based on the attention pattern based on
those uh different values it'll take
this weighted sum producing a sequence
of changes it'll add that sequence of
changes to the sequence of vectors that
flowed in and those sums are going to be
What flows out of the attention block at
least almost so this so far I've just
been describing what you would call a
single head of attention and as it is
this is actually quite a lot to think
about because each one of them is being
multiplied by you know a key Matrix and
a query Matrix and a value Matrix and
those keys and queries are producing
this big attention pattern and that's
going through the soft Max which is used
for it's like it's a lot to think about
but this happens like 10,000 times for a
single pass of the network because this
is just a single head of attention and
then each attention block often involves
many different heads it might be
something on the order of a 100 bigger
models could have bigger ones and then
there's going to be many different
layers of attention so if this is just
one of the heads multi-headed attention
is something where you would think about
those happening all in parallel and
again the mantra for Transformers is
that they're very architected to work on
gpus so that you can run these things in
a shorter amount of time even if it's a
greater amount of computation and what I
mean by you know multiple attention
heads here is that this adjective noun
example is just one out of many many
different ways that you might imagine
context is relevant to updating meanings
you can imagine all sorts of other
things like also in the sphere of
grammar adverbs updating the meanings of
verbs or nouns and their antecedents
going together but it doesn't even
necessarily have to be grammatical just
really anything where you want to
somehow transform information that was
in one part of a passage to something
that's later such that it's relevant for
predicting the next word that has to
somehow happen through these key query
and value mechanisms that are asking
which things are relevant to which other
ones and what changes should take place
when that relevance is there so each one
of the heads inside one of these
multi-headed attention blocks has its
own distinct key and query matrices
which are used to produce their own
distinct attention patterns and they
have their own distinct value Maps which
are producing their own distinct
sequences of values which again you do
this whole weighted Sum along the
columns for so it really is a lot to
think about and every single output from
those heads which is a proposed change
to make to the embedding that was in
there you add all of those up together
to the original embedding that flowed in
so there's lots and lots and lots of
different things that are added to it or
at least potentially added to it
depending on whether they're zeroed out
by these attention patterns or not and
so in this just little schematic
illustration that I gave where we have
an attention block and just some dancing
lines to indicate that they're talking
to each other the thing that's happening
under the hood there is all of those
distinct attention heads which
themselves involve all of these uh
distinct patterns playing with each
other and like I said at the beginning
there's not just one attention block it
flows through a multi-layer perceptron
and then another attention block that
again lets them all update each other
and just keeps flowing through like this
and so the loose thought there is you
have all of these vectors gaining rich
and richer meanings and the context that
they're drawing from is itself becoming
richer and richer and richer and by the
end your hope is that it's not just the
meaning of the original token anymore
it's really whatever it needs to be to
be able to predict what comes after at
that
point now there's definitely a lot more
that can be said about Transformers we
could for example dive into what's going
on with those multi-layer perceptrons
but I think this is a pretty good point
to step back and ask a little bit why
are these as eff effective as they are
you know there's lots of different
tactics that people have been trying and
deep learning for a while but
essentially since that 2017 paper
Transformers have just been on the
uprise for being applied to more and
more distinct
fields and there's a couple couple
things you could point to here one of
them is that a big lesson in machine
learning through the last couple decades
is that scale alone matters simply
making things bigger and simply giving
them more training data can sometimes
give qualitative improvements to the
model performance and there's there's
laws that people will write about this
they're not mathematical laws they're
more kind of heuristic laws but they can
be phrased mathematically that predicts
for a given size of the model for a
given amount of training that you uh do
what's the cost function going to look
like and if that cost function is going
down that typically corresponds to uh
improvements in the model performance
that are qualitatively visible you know
it just looks like a chatbot that
behaves better things like that and if
scale matters that means that
parallelizability matters so a lot of
earlier natural language processing it
would read through text the way that you
and I do it would kind of start from the
beginning and go through the end and as
it's reading through it updates meaning
a little bit more but once people did
away with all those mechanisms and just
left one them the attention mechanism
which allows things to talk to each
other but not in a way that relies on
sequential processing it means that they
can process text very differently from
how in you and I do where they take in
the whole passage and just kind of
ingest it at once letting all of the
different embeddings talk to each other
as it does that's very weird from our
standpoint trying to empathize with it
compared to how we do it but it's
extreme friendly for gpus and letting uh
a training run effectively do more total
floating Point operations in a given
amount of time the other benefit here
the fact that we're doing a next token
prediction that means that you can train
on a huge amount of data that doesn't
require human labeling so having this
pre-training phase where you can just
give it massive amounts amounts of data
that didn't require having a bunch of
you know human labelers labeling what's
on an image or things like that means
that you can get a lot of that training
reps in in this very um uh large model
without being constrained by the human
feedback human feedback usually comes in
later where often the reason that we
call it pre-training when you do all
this next token prediction is that
what's required to make chatbots for
example work more effectively is to have
some kind of reinforcement with humans
in the loop thereafter um but still the
idea that most of the actual flops in
training can come from something
unsupervised plays into this idea that
scale and scale alone tends to matter
and another another component for
Transformers which is quite nice even
though we were focused on language where
you break tokens into where tokens are
little Snippets of words the fact that
you can tokenize essentially anything
just break up whatever your data type is
uh into little pieces and then embed
those as vectors means that you can have
lots of distinct data types work in
conjunction with each other if you want
a model that processes not just text but
text together with an image or together
with sound it can treat all of those as
equal citizens in the same landscape
rather than having to have different
bespoke architectures for each one and
then having a whole different process
process for how they talk to each other
later so with that I think I'll call it
an end here and say thank you and turn
things over to the uh Q&A I'm more than
happy to talk more about Transformers if
you want I'm also happy to answer
anything about three BL and brown if you
want um but with that I'll I'll call it
an end
um I've got one question I I've also
seen your your videos so you you seem to
work quite some time on this topic
already and I would be interested how
much work you put in the last months or
year or whatever into this
topic a lot more than I was expecting
but it's been fun especially um because
I'm more of a math person by background
uh it's just involved a lot of talking
with people who know more than I do on
the matter and I've been especially fond
of the interpretability researchers on
this front because you know they're
motivated to understand what's actually
going on from my point of view I'm like
I don't care if that's what actually
going on I just want like a good
pedagogical motivation for the structure
but it's also thought-provoking in its
own right trying to say how can we
probate these models so I mean one of
the things I would love to talk about
more um would have talked about today
it's just very hard to fit in because
you need all the background it's just
some of that work that's done to try to
say that little fact I referenced for
for example where the number of vectors
you can fit into a space that aren't
orthogonal but almost orthogonal scaling
exponentially this is related to
something they'll call the superposition
hypothesis and there's very clever ways
that you can try to probe at what those
feature directions might be even when
it's many more than the numbers of
dimensions and could be a whole video
about that um and so there's been a
number of rabbit holes like that which
may or may not actually turn into videos
but I'm quite happy to do and then the
visuals are you know it's a labor of
love always to to pour pour time into
those and try to get something that
communicates what I
want got a question here yeah thank you
for the inspirational talk um I have a
question regarding Transformer models
it's a bit technical so this trend of um
using deeper and deeper transform models
remind me of the good old days with
convolutional n networks where they hit
the um met a barrier in terms of um
exploding and Vanishing gradients um
where they started using using things
like residual networks to let the signal
pass through without any Transformations
when not needed are there similar Trends
in transer models that you're aware of
um I'm not I'm not entirely sure I
follow the question so you're saying
that the trend where residual networks
for example came to be quite helpful is
there's something like that in the case
yes I mean there the residuality is sort
of baked in from the beginning with how
it's even done the thought that as
you're going from layer to layer rather
than generating an entirely new uh data
type you're kind of adding to whatever
there was before so it's not just in the
sense that you're preserving the
dimension so it's friendly for the
machine which seems to be one thing
that's into consideration the people who
designed it are very Hardware aware in
contrast to maybe some other machine
learning Frameworks but uh there seems
to be a continuation of the trend that
you're referencing there where making
things residual is deeply deeply helpful
and whether that's because it makes for
training stability or whether there's
something more conceptual I I kind of
can't say but it definitely does seem to
be the trend
we have another question over here hey
thank you for the great presentation so
um when it's a very long presentation or
a very long talk do you have some
metrics that you keep track of as in how
many jokes should go into this 10 minute
period to keep people awake or do you
have like a team of creative thinkers
per se that kind of arrange everything
this way on the background for it to be
finalized by you in the end oh to have a
team uh no
I I don't think I'm very good at that
actually like I'm I'm sort of a nerd who
just digs into the topic itself and says
all right let's just let's just dig into
the topic and the thing that should
motivate the next step is centered
around understanding and Clarity rather
than humor uh so there's there's
certainly not enough deliberate thought
that goes into that component but for me
I think what I find most motivating in
learning something is just the promise
that I'll actually understand it and so
I think the way I try to motivate
audiences with say a longer video is not
so much that in the middle there's going
to be an unrelated joke to crack but but
more just that there's there's there's a
real promise that like we're on a path
to understanding here and um in so far
as that promise is something people
believe I think that's when they stick
with it a little bit
more a question from
behind if I understand you correctly um
you use gpus to do a lot of
Transformations but you're not really
interested in the absolute values that
you calculate in each transformation
wouldn't be the mix of analog computers
together with digital ones resolve this
energy hungriness it's a good question I
am not an expert on that the drawbacks
or advantages of analog
computers and therefore I should stop
talking
now but in principle like from a first
principal standpoint in physics it it
does make a lot of sense where if you're
more error tolerant in that way like the
big advantage of digitization over
analog computers if you were to go back
to the 1940s and explain to like why
they should bet on one horse and not
another has to do with error propagation
and so in this case if kind of don't
care about that cuz everything's just a
matter of soft Association anyway I'll
believe it I am as curious as you are to
understand why that's not the case my
best guess or why they haven't you know
like replaced it it's just that there
there's so much smart mind power that's
gone towards optimizing the living
Christ out of matrix multiplication in a
in you know a digital context that it's
just hard to catch up with that even if
something's going to be better from like
a first principal standpoint there
there's such a head start on on on that
one I but if if you find someone with a
clearer answer you know send that answer
my way because I'm I'm as curious as you
are do we have a question in Zoom no we
have we have one more good yeah yes
thanks for trying it three times to come
here and actually doing it this time uh
my question is about tokenization and
images you briefly mentioned and text
and sound are basically one dimension in
some sense because you read from left to
right or you listen through time but
images are inherently two dimensional
and I would argue that the pixels above
and below are more important than the
one at the end of the current pixel row
so how could you tokenize that into a
nice yeah so I guess um there's two
things there one is the tokenization and
one is how the attention will work there
I mean the tokenization
um Loosely speaking you'd want to think
of it as like little patches of the
image are going to be the tokens and
then you have some notion of positional
encoding that will encode that not just
the X position but also the Y position
so that the vector that embeds that
patch kind of knows where it is and can
use that for associations um but as I
understand it the naive way of doing
that you're just going to end up with
either way too many tokens or tokens
that are way too small because if you
think of kind of the resolution of an
image and wanting tokens to be ones that
like show up decently often you you you
would just end up with something that
bloats the network a lot so you have to
get a little bit clever but like in
principle it's just the patches and then
for how they talk to each other you know
there's various different things where
you can mask the attention so that it
first does it columnwise and then does
it rowwise or something like that but
there's um as I understand it like not
not one single way of going about it but
in all cases it does do something that
appreciates your point where it's two
dimensional and the way that you'd see
that is usually in the positional
encoding
I think that was the last question okay
Grant um thank you very much everyone
for coming this is this is delightful to
actually be here