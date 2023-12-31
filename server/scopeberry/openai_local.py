import os
import openai
import functools

openai.api_key = os.environ['OPENAI_API_KEY']

# list models
models = openai.Model.list()

# print the first model's id
print([m.id for m in models.data])

@functools.cache
def completion(text):

    # create a chat completion
    chat_completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": text}])

    # print the chat completion
    print("\n" + text + "\n")

    # print the chat completion
    print(chat_completion.choices[0].message.content + "\n")

    return chat_completion.choices[0].message.content
