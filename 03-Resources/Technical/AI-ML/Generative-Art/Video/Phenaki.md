# Phenaki: Variable Length Video Generation from Open Domain Textual Des… (01jdr4dwcvwkq2pf35vm96pptj)

Source: Phenaki: Variable Length Video Generation from Open Domain Textual Des… (01jdr4dwcvwkq2pf35vm96pptj).html

Comment:
=== Please check
our common response
for a newly added comparison with TATS and compute numbers.
3D Convolution versus C-ViViT:
As motivated in the introduction, our goal is to use video and image datasets at the same time. This means Phenaki should be able to encode single images and variable length videos. 3D Convolution in TATS and in general cannot do this out of the box. If you attempt to encode a video with padding except for the first image, the representation becomes corrupted and there is no guarantee that the representation is purely image representation. In C-ViViT, we make sure the extracted representation in the first image tokens are solely information from the first image via causal masking of time. This is a key requirement in our pipeline because we are interested in using image and video datasets together as data sources for learning. In addition, 3D convolution in TATS has not been shown to be applicable for video prediction for the previously mentioned reasons. This is a key requirement to be able to do text-image to video, text-video to video generation. There are established baselines for this such as Kinetics 600 and BAIR Robotpush that TATS does not include in their evaluations. Our paper already contains comparisons with previous 3D convolution based methods in our video prediction evaluation on Kinetics 600 and BAIR Robotpush (Table 4 against Video VQVAE and Table 5 against VideoGPT), and we outperform them. Both train an initial 3D convolution network to extract latent codes and train an additional model for video prediction on the latents. Having said that, in our common response to all reviewers we provide a direct comparison against TATS in a class conditional generation setting showing that even early in training we already outperform TATS by a significant margin.
Stylized videos:
Thank you for the question. To provide evidence that styles are learned from image datasets and not video datasets, we have updated our website (
https://phenaki.video/style_videos.html
) with a section showing that the models trained with 100% videos cannot stylize videos when the prompt specifies it. We provided the example with the pencil drawing panda and an additional water color style of the same panda and showed that the model trained with only video data cannot generate the right style because such examples simply don’t exist in the video dataset. However, the model learned these styles from the image dataset and the model trained jointly on images and videos is capable of generating such videos.
Variable length text prompts claim:
Thank you for the clarification. We agree with the reviewer on the distinction. “Open Domain” is already reflected in the title of the paper and we updated the introduction to adjust this claim.
MaskGIT ablations:
Since we did not modify the original MaskGIT architecture, we found it to behave similarly to how it is reported to behave in the original MaskGIT paper. The only difference here is that we use more tokens because of our use of video data, but the behavior of all hyper parameters is essentially the same.
To elaborate more on what the MaskGIT paper already states and as stated in our supplementary material, each video generation in our paper only requires 48 sampling steps while the autoregressive counterpart would take 1536 sampling steps. MaskGit provided a study of this in their paper (
https://arxiv.org/pdf/2202.04200.pdf
, Fig 4) that shows the advantage over autoregressive decoding. In addition, \lambda controls alignment with the input prompt and assuming the reviewer means maskgit temperature by \beta, it controls diversity of the generation. We point the reviewer to the MaskGIT paper for more details.