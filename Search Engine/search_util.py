from BM25 import BM25
from queryExpansion import QueryExpander

import matplotlib
matplotlib.use("AGG")
import matplotlib.pyplot as plt


class SearchUtil:
    def __init__(self, postings, dictionary, stopwords, corpus_length, document_information):
        self.postings = postings
        self.dictionary = dictionary
        self.stopwords = stopwords
        self.corpus_length = corpus_length
        self.document_information = document_information
        self.document_lengths = {}

        # Remove stopwords from document information
        for document_id, document_info in self.document_information.items():
            self.document_lengths[document_id] = document_info[0]

        # Initialize BM25 object
        self.bm25_object = BM25(
            dictionary=dictionary,
            corpus_length=corpus_length,
            document_lengths=self.document_lengths,
            k1=1.5,
            b=0.75,
        )

        self.query_expander_object = QueryExpander(name="word2vecModel")

    def bm25_search(self, query):
        # Remove stopwords from query
        query_terms = query.split(" ")

        # Add query terms to dictionary with weight of 1
        term_weight = {term: 1 for term in query_terms}

        self.remove_stopwords_from_query(term_weight)

        # Check if query is empty, if so, return empty list
        if len(term_weight) == 0:
            return []

        # Get relevant terms from query expansion
        try:
            relevant_terms = self.query_expander_object.find_similar(query_terms)

            # Add relevant terms to dictionary
            for term in relevant_terms:
                term_weight[term[0]] = term[1]
        except KeyError:
            print("Term not in vocabulary")

        search_ranked_summary = {}

        # Get document scores for each document
        for term in term_weight.keys():
            if term in self.dictionary:
                term_postings = self.postings[term]

                for document_id, document_info in self.document_information.items():
                    if document_id in term_postings:
                        # Initialize the document score with 0 as well as document title
                        if document_id not in search_ranked_summary:
                            search_ranked_summary[document_id] = [0.0, document_info[2]]

                        # Get document length for score calculation
                        document_length = self.document_lengths[document_id]

                        document_term_frequency = term_postings[document_id]

                        # Calculate the score of the term in the document
                        document_score = self.bm25_object.term_document_score(
                            term, document_length, document_term_frequency
                        )

                        # Multiply the score by the weight of the term in the query
                        document_score *= term_weight[term]

                        # Add the score to the document score
                        search_ranked_summary[document_id][0] += document_score

                        # Add summary for the first occurrence of the term
                        search_ranked_summary[document_id].append(
                            self.get_summary(term, document_info[1])
                        )

        # Sort the documents by score
        sorted_search_results = sorted(
            search_ranked_summary.items(), key=lambda x: x[1][0], reverse=True
        )

        # Reduce the number of documents to 25 for search results
        if len(sorted_search_results) > 25:
            sorted_search_results = sorted_search_results[:25]

        # Create graph of document scores
        self.create_document_score_graph(sorted_search_results, query)

        return sorted_search_results

    def remove_stopwords_from_query(self, query_list):
        """
        Remove stopwords from query
        """
        term_dict = query_list.copy()

        for term in term_dict:
            if term in self.stopwords:
                del query_list[term]

    def get_summary(self, term, document_content):
        if term in document_content:
            index_of_first_term = document_content.index(term)

            if len(document_content) < 10:
                summary = " ".join(document_content)
            else:
                # Get first 10 words within the context of the term
                if (
                    index_of_first_term - 5
                ) < 0:  # Check if first occurence is within first 5 terms
                    summary = " ".join(document_content[0:11])
                elif (index_of_first_term + 5) > len(
                    document_content
                ):  # Check if first occurence is within last 5 terms
                    summary = " ".join(document_content[len(document_content) - 10 :])
                else:  # Otherwise, get 5 terms before and after first occurence
                    summary = " ".join(
                        document_content[
                            index_of_first_term - 5 : index_of_first_term + 6
                        ]
                    )
        else:
            summary = " ".join(
                document_content[0:11]
                if len(document_content) > 10
                else document_content
            )

        return summary

    def create_document_score_graph(self, search_results, query):
        # Plot document scores along with the document ID
        plt.bar(
            [document[0] for document in search_results],
            [document[1][0] for document in search_results],
        )

        # Set the title of the plot
        plt.title("Document Scores for Query: " + query)

        # Rotate the x-axis labels
        plt.xticks(rotation=90)

        # Set the x and y labels
        plt.xlabel("Document ID")
        plt.ylabel("Document Score")

        # Adjust the layout of the plot to fit the labels
        plt.tight_layout()

        # Save the plot as a PNG file in the static folder
        plt.savefig("./static/document_score_graph.png", format="png")

        # Close the plot to prevent graphing issues
        plt.close()
