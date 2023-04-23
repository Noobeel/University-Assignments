import math


class BM25:
    def __init__(self, dictionary, corpus_length, document_lengths, k1=1.5, b=0.75):
        self.dictionary = dictionary
        self.corpus_length = corpus_length
        self.k1 = k1
        self.b = b

        self.idf = self.calculate_idf()

        self.average_document_length = (
            sum(document_lengths.values()) / self.corpus_length
        )

    def calculate_idf(self):
        idf = {}

        for term, document_frequency in self.dictionary.items():
            idf[term] = math.log(
                self.corpus_length - document_frequency + 0.5
            ) - math.log(document_frequency + 0.5)

        return idf

    def term_document_score(self, term, document_length, term_frequency):
        return self.idf[term] * (
            (term_frequency * (self.k1 + 1))
            / (
                term_frequency + self.k1 * (1 - self.b + self.b * document_length / self.average_document_length)
            )
        )
