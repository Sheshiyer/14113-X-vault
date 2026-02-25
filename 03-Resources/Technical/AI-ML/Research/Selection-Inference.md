# Selection-Inference: Exploiting Large Language Models for Interpretabl… (01j4281wbks2qn6bnjrmahha23)

Source: Selection-Inference: Exploiting Large Language Models for Interpretabl… (01j4281wbks2qn6bnjrmahha23).html

Selection-Inference: Exploiting Large
Language Models for Interpretable Logical
Reasoning
Antonia Creswell1, Murray Shanahan1and Irina Higgins1
1DeepMind
Large language models (LLMs) have been shown to be capable of impressive few-shot generalisation
to new tasks. However, they still tend to perform poorly on multi-step logical reasoning problems.
Here we carry out a comprehensive evaluation of LLMs on 50 tasks that probe diﬀerent aspects of
logical reasoning. We show that language models tend to perform fairly well at single step inference
or entailment tasks, but struggle to chain together multiple reasoning steps to solve more complex
problems. In light of this, we propose a Selection-Inference (SI) framework that exploits pre-trained
LLMs as general processing modules, and alternates between selection and inference to generate a
series of interpretable, casual reasoning steps leading to the ﬁnal answer. We show that a 7B parameter
LLM used within the SI framework in a 5-shot generalisation setting, with no ﬁne-tuning, yields a
performance improvement of over 100% compared to an equivalent vanilla baseline on a suite of 10
logical reasoning tasks. The same model in the same setting even outperforms a signiﬁcantly larger
280B parameter baseline on the same suite of tasks. Moreover, answers produced by the SI framework
are accompanied by a causal natural-language-based reasoning trace, which has important implications
for the safety and trustworthiness of the system.
1. Introduction
Large language models (LLMs) are powerful few-shot learners (Bommasani et al.,2021;Brown et al.,
2020;Lu et al.,2021). However, one area where they tend to perform poorly is logical reasoning (Rae
et al.,2021). Yet the ability to perform multi-step, logically valid reasoning is fundamental for the
discovery of new knowledge and explainability. It underpins many advancements that have been made
in science, medicine, maths and philosophy. It is also one of the most valued strengths of classical,
symbolic AI over contemporary deep learning methods (Bengio et al.,2021;Marcus,2020;Marcus
and Davis,2019), prompting the recent increase in the use of neurosymbolic approaches to bridge this
gap (Garcez and Lamb,2020;Garnelo and Shanahan,2019). Here we propose a Selection-Inference
(SI) framework that takes inspiration from the neurosymbolic literature to improve the ability of
LLMs to do logically valid reasoning.
There are many ﬂavours of neurosymbolic models (Garcez and Lamb,2020). Those from which
we draw inspiration tend to have a modular structure, where each module is specialised for one type
of operation (Andreas et al.,2016;Mao et al.,2019). For example, such modules may be neural
networks or hand-crafted functions designed to attend to a single object, or to compare the location or
size of two inputs (Andreas et al.,2016;Yi et al.,2018). Neurosymbolic models can produce an answer
to a complex query by chaining these operations together, passing inputs from one module to another.
This has the beneﬁt of producing an interpretable trace of intermediate computations, in contrast
to the “black-box” computations common to end-to-end deep learning approaches. Importantly, the
modularity of neurosymbolic methods allows them to generalise to signiﬁcantly harder problems
that require long chains of reasoning (Hudson and Manning,2019). However, the hand-crafted and
specialised nature of the modules often makes the resulting systems brittle, hard to optimise, and
Corresponding author(s): tonicreswell@deepmind.com
arXiv:2205.09712v1 [cs.AI] 19 May 2022