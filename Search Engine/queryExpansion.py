import json
import time
import string
from gensim.models import Word2Vec


# Uses a trimmed version of "trec_corpus_20220301_plain" that has 500,000 records
# Make a shortened corpus. Loop range dictates number of records
"""
skip = 500000 # Skip x records

with open("trec_corpus_20220301_plain.json", "r", encoding="utf-8") as f, open("textShort1.txt", "w", encoding='utf-8') as out:
    for i in range(skip):
        line = f.readline().rstrip()
        test = json.loads(line)["plain"]

        test = test.translate(str.maketrans('', '', string.punctuation + string.digits)).translate(
            str.maketrans(string.ascii_uppercase, string.ascii_lowercase)).split()
        
        out.write(" ".join(test) + "\n")
"""

# =================================================================================================

# Train the model on short corpus
"""
with open("textShort1.txt", "r", encoding="utf-8") as f:
    data = []
    for line in f:
        data.append(line.rstrip().split())

print("got data")

start = time.perf_counter()

model = gensim.models.Word2Vec(data, min_count=5, workers=4)

print(time.perf_counter()-start, "s")

model.save('word2vecModel')

print("loaded")
"""

# =================================================================================================


class QueryExpander:
    def __init__(self, name):
        """
        Initialize the model with the given name
        """
        self.model = Word2Vec.load(name)


    def find_similar(self, words, numWords=5):
        """
        Find the most similar words to the given words
        Parameters:
            words: array of words to find similar words to
            numWords: number of similar words to return
        Returns:
            array of tuples of the form (word, similarity)
        """
        return self.model.wv.most_similar(positive=words, topn=numWords)
