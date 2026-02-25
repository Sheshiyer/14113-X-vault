# Computer Generates Human Faces (01j0thhh0db5zerjgx71ad9m84)

Source: Computer Generates Human Faces (01j0thhh0db5zerjgx71ad9m84).html

Can a computer make a completely unique and realistic face?
What kinds of features will it learn?
To find out, I needed a big data set with lots of faces.
I decided to use 1,700 faces from my High School Yearbook.
This is a great data set because everyone has posed the same way in front of identical backgrounds.
The downside is that everyone is teenaged.
So we're not going to get much facial hair, wrinkles, or baldness
Now is the time I need to give a warning :
if you're not looking for a technical explanation,
just click here to skip to the results
All right, so let's talk about autoencoders.
An autoencoder is simply a transformation that tries to map samples from one space into the same space.
So you might be asking yourself "Why is that useful? I don't see how that's different from an identity".
The idea is to try to squeeze the high dimensional space through a lower dimensional bottleneck
to see how well it can reconstruct the original samples.
In this case there's an encoder and a decoder network
which you can think of as black boxes that do the complicated math for you.
With images, it's a lot like JPEG compression.
You can afford to lose a lot of the dimensionality, which is the file size,
but still reconstruct the original with only a small loss of quality.
Let's look at the JPEG example.
You probably can't even see the quality loss,
but this is already compressed 14 times smaller than the raw original size.
But watch what happens as we decrease the dimensionality.
The quality has suffered, but it's still recognizable.
So let's compare that to the auto encoder we're about to use.
We're starting with an image that's 144 pixels wide by 192 pixels tall with three color channels.
That's about 83,000 dimensions.
And we're gonna squeeze that down through just 80.
That's more than a thousand times compression.
But how can we possibly expect a decent looking face with this much reduction?
We just saw what happened to JPEG with 100x compression.
The reason is that JPEG has to compress all possible images.
Or as we're only interested in faces.
If you think about it, the space of all possible faces is way smaller than the space of all images,
by orders of magnitude.
Especially considering they were all posed similarly.
Since we force it to learn only 80 features,
the only way it could provide a good reconstruction, given what we just saw with the general compression,
is if those 80 features are face specific.
So, hopefully, it will learn what it means to be a face.
There's one other trick we can use to simplify this model though.
Since we really just want to generate faces,
we don't actually need the encoder, not even during training.
Instead, we just embed all training samples randomly into the latent space.
Their weights then just get updated just like the network wave when training.
To generate a random face, we'll just sample each of the 80 dimensions,
using the same means and variances as we see in the training.
So, what 80 features do you think it learned?
Well, let's see.
Each of these sliders represents one of the 80 latent space dimensions.
Each tick mark is one standard deviation and the center is the mean.
We can see that each slider is making it change,
but it's not clear what each one does.
And, in fact, what the slider does actually depends on the state of all the other sliders.
So, it's really impossible to say.
So, does that mean it just learned some insanely complex representation that humans could never comprehend?
Are we done?
Well, no. There's actually a big mistake we made.
And fixing it will help us solve this problem and improve the face quality.
Let's look back at one of the assumptions we made.
We said we'd sample each dimension using the same mean and variance as the training latent space samples.
To do that, we assumed that each dimension is normally distributed.
Is that assumption valid?
Well, I checked and it does appear to be normal.
So, that's not an issue.
Let's look at just two of the dimensions, so we can make a visual.
In 2D, we're sampling each one dimensional distribution to get our two-dimensional distribution.
Looks good, right?
But let's plot the actual distribution here instead of our randomly generated one.
As you can see, although both 1D distributions are correct, they don't uniquely define the 2D distribution.
The problem is that our variances are correlated.
So, they can't be sampled independently.
Otherwise, we're much more likely to sample areas outside the distribution.
So, how can we solve this problem?
Well, this is done by a change-of-basis.
Instead of sampling the two latent variables, we sample over new axes that are as independent as possible.
Finding those axes is called Principal Component Analysis, or PCA.
You can treat that as another black box for now, but the math is really interesting.
This easily extends to higher dimensions.
After all we're gonna need 80.
The really interesting thing about PCA is that it gives us the length of each axis,
which, by the way, is just the standard deviation along that axis.
The longer the length, the more variance there is in that dimension.
And, therefore, the more important the feature is to the overall reconstruction.
So, we can sort the principal components by importance.
Here's the actual distribution.
It follows an exponential decay which is typical of structured data like faces.
As you can see, the vast majority of the variance is actually only in the 20 or so dimensions.
So, now, we'll update our face generation as follows :
We'll generate a sample in the PCA distribution, convert that to the latent space coordinate,
and finally run it through the decoder to generate the image.
Before I start, what do you think are the top eight most important features in a face that produce the largest changes to the image?
Pause now if you want to think about it.
So let's check it out.
I've sorted the sliders from largest to smallest principal component.
So, the #1 most important feature is apparently shirt color.
I guess it makes sense.
The shirt takes up about a third of the image and it can range from pitch black to completely white.
#2 appears to be gender.
Obviously, hair length is highly correlated to gender and long hair takes up a lot of the image.
#3 is head position.
People tend to lean their head during photos, and it's not too surprising that this would be a dominant feature.
#4 is the person's height.
Again, not too surprising. It varies a lot between people.
Now, #5 is a little weird. I call it hair density.
It's kind of like how much the hairline recedes and also how light or dark the hair is.
#6 is head size.
Or, more likely, how close or zoomed in the person's head was to the camera.
#7 is collar height.
Not one I would have thought of. But, I guess it makes sense.
#8 is...
Well, I'm not really sure. I can't tell what this is doing, but it's doing something.
The last really obvious one is #9,
which is what direction the head is facing.
As I adjust the less important sliders, you can see how a little they affect the image.
They mostly just make really small fine-tuning details.
But we can now build faces based on these parameters.
Let's say we want someone with a dark shirt,
female, leaning to the left, tall, thin hair,
large... or, actually, let's give her a smaller head.
And, we'll adjust the rest of these to our liking.
You can imagine how this could have some useful applications like, maybe, for police sketching.
What I find most amazing about this is that the entire process was done unsupervised.
What that means is that we used only images of faces without any labels.
We could have gotten way better result if we had humans to come up with 80 really good features
and then learn reconstruction from that.
But, then again, I'm not gonna sit here and hand label 1700 images with 80 properties each.
That would take days.
And this is a relatively small dataset too.
Typically, you'd want to use hundreds of thousands of samples,
so you can really see the advantage of unsupervised learning.
Anyway, let me know if you'd like to see more in-depth technical videos like this in the future.
I'm still not sure what the format of this channel will be.
Thanks for watching