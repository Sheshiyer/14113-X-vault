# Thousands of models contributed by our community (01jdr4fjc4hah56ba071sekhfz)

Source: Thousands of models contributed by our community (01jdr4fjc4hah56ba071sekhfz).html

<__hrp__ data-ext-id="eanggfilgoajaocelnaflolkadkeghjp">
//V
//E
Explain
//A
Ask page
//U
Summarize
//D
//O
//W
Rewrite
How it works
You can get started with any open-source model with just one line of code. But as you do more complex things, you fine-tune models or deploy your own custom code.
Run open-source models
Our community has already published thousands of models that are ready to use in production. You can run these with one line of code.
import replicate
output = replicate.run(
"black-forest-labs/flux-schnell:f2ab8a5bfe79f02f0789a146cf5e73d2a4ff2684a98c2b303d1e1ff3814271db",
input={
"prompt": "An astronaut riding a rainbow unicorn, cinematic, dramatic",
"num_outputs": 1,
"aspect_ratio": "1:1",
"output_format": "webp",
"output_quality": 90
}
)
print(output)
Fine-tune models with your own data
You can improve open-source models with your own data to create new models that are better suited to specific tasks.
Image models like Flux can generate images of a particular person, object, or style.
Train a model:
import replicate
training = replicate.trainings.create(
version="ostris/flux-dev-lora-trainer:1296f0ab2d695af5a1b5eeee6e8ec043145bef33f1675ce1a2cdb0f81ec43f02",
input={
"input_images": "https://my-domain/my-input-images.zip",
},
destination="electricdreams/flux-fine-tuned"
)
print(training)
Then, you can run it with one line of code:
output = replicate.run(
"electricdreams/flux-fine-tuned:abcde1234...",
input={"prompt": "a photo of TOK riding a rainbow unicorn"},
)
Deploy custom models
You aren’t limited to the models on Replicate: you can deploy your own custom models using
Cog
, our open-source tool for packaging machine learning models.
Cog takes care of generating an API server and deploying it on a big cluster in the cloud. We scale up and down to handle demand, and you only pay for the compute that you use.
First, define the environment your model runs in with cog.yaml:
build:
gpu: true
system_packages:
- "libgl1-mesa-glx"
- "libglib2.0-0"
python_version: "3.10"
python_packages:
- "torch==1.13.1"
predict: "predict.py:Predictor"
Next, define how predictions are run on your model with predict.py:
from cog import BasePredictor, Input, Path
import torch
class Predictor(BasePredictor):
def setup(self):
"""Load the model into memory to make running multiple predictions efficient"""
self.model = torch.load("./weights.pth")
# The arguments and types the model takes as input
def predict(self,
image: Path = Input(description="Grayscale input image")
) -> Path:
"""Run a single prediction on the model"""
processed_image = preprocess(image)
output = self.model(processed_image)
return postprocess(output)
Scale on Replicate
Thousands of businesses are building their AI products on Replicate. Your team can deploy an AI feature in a day and scale to millions of users, without having to be machine learning experts.
Automatic scale
If you get a ton of traffic, Replicate scales up automatically to handle the demand. If you don't get any traffic, we scale down to zero and don't charge you a thing.
CPU $0.000100/sec
Nvidia T4 GPU $0.000225/sec
Nvidia A40 GPU $0.000575/sec
Nvidia A40 (Large) GPU $0.000725/sec
Nvidia A100 (40GB) GPU $0.001150/sec
Nvidia A100 (80GB) GPU $0.001400/sec
8x Nvidia A40 (Large) GPU $0.005800/sec
Replicate only bills you for how long your code is running. You don't pay for expensive GPUs when you're not using them.
Deploying machine learning models at scale is hard. If you've tried, you know. API servers, weird dependencies, enormous model weights, CUDA, GPUs, batching.
0
15
30
54
06:58 UTC
07:22 UTC
07:46 UTC
08:10 UTC
08:34 UTC
08:58 UTC
Metrics let you keep an eye on how your models are performing, and logs let you zoom in on particular predictions to debug how your model is behaving.
hu-po
@hupobuboo
Zero-Shot Autonomous Humanoid Robot using
@replicate
and
@OpenAI
Open Source Mode (via Replicate API):
- LLM: llama-2-13b-chat
- VLM: llava-13b
- TTS: bark
- STT: whisper
OpenAI Mode:
- LLM: gpt-4-1106-preview
- VLM: gpt-4-vision-preview
- TTS: tts-1
- STT: whisper-1
Your browser does not support the video tag.
Posted Nov 22, 2023 at 1:20PM
Gregory Wieber
@dreamwieber
My new iPad app that lets you paint with #ai just got approved for TestFlight 🚀
So much interest, thank you! I'll be rolling out to close friends first, and scaling up over time.
Sign up for the waitlist, and don't forget to follow here! ✨
Your browser does not support the video tag.
Posted Nov 23, 2023 at 4:45AM
Logo