import re
import gc
import gzip
import json
import time
from datetime import timedelta
from inspect import cleandoc
from nltk import RegexpTokenizer
from nltk.stem import PorterStemmer


class IndexInverter:
    """
    A class to create an inverted index for a given data file.

    ...

    Attributes:
        data_file (str): The name or path of the data file to be indexed.
        stop_words_file (str): The name or path of the stop words file.
        dictionary_output_file (str): The name or path of the dictionary output file.
        postings_output_file (str): The name or path of the postings output file.
        stemmer_enabled (bool): A boolean value to indicate if stemming is enabled.
        stop_word_enabled (bool): A boolean value to indicate if stop word removal is enabled.

    Methods:
        createInvertedIndex() -> None:
            Creates an inverted index for the given data file.
        getFirstOccurrenceSummary(tokenized_terms, first_occurence_position) -> str:
            Returns a summary of the first occurence of a term and 10 terms in its context.
        writePostings() -> None:
            Sorts the document for a term by document id then sorts terms alphabetically and writes the postings list to a file
        writeDictionary() -> None:
            Sorts the dictionary list by term then writes the dictionary list to a file
    """

    def __init__(
        self,
        data_file,
        stop_words_file,
        dictionary_output_file,
        postings_output_file,
        stemmer_enabled,
        stop_word_enabled,
    ) -> None:
        self.data_file = data_file
        self.stop_words_file = stop_words_file
        self.dictionary_output_file = dictionary_output_file
        self.postings_output_file = postings_output_file
        self.dictionary_list = {}
        self.postings_list = {}
        # Remove numbers and special characters (incl. underscore)
        self.tokenizer = RegexpTokenizer(r"[^\W_0-9]+", discard_empty=True)
        self.stop_word_enabled = stop_word_enabled
        self.stemmer_enabled = stemmer_enabled

        # Load Porter Stemmer if stemming is enabled
        if stemmer_enabled:
            self.stemmer = PorterStemmer(mode="ORIGINAL_ALGORITHM")

        # Load stop words, if enabled, into a dictionary where the terms are the keys and the values are None
        if stop_word_enabled:
            with open(self.stop_words_file, "r") as stop_words_file:
                self.stop_words_list = dict.fromkeys(
                    stop_words_file.read().splitlines()
                )

    def createInvertedIndex(self) -> None:
        corpus_length = 0
        document_information = {}

        with open(self.data_file, "r") as json_file:
            # Parse through data file
            for line in json_file:
                corpus_length += 1

                document = json.loads(line)
                docID = document["id"]
                title = document["title"]

                # Remove HTML tags and tokenize
                # <\/?[\w\s]*>|<[^>]+[\W]>|<[^>]+> - Old regex
                text = re.sub(
                    r"<(?:[A-Za-z_:][\w:.-]*(?=\s)(?!(?:[^>\"\']|\"[^\"]*\"|\'[^\']*\')*?(?<=\s)(?:term|range)\s*=)(?!\s*\?>)\s+(?:\".*?\"|\'.*?\'|[^>]*?)+|\?[A-Za-z_:][\w:.-]*\s*\?)>|<.[\w]*>|<!DOCTYPE html>|<br/>|<hr>|.mw[^<]+",
                    " ",
                    document["contents"],
                )
                tokenized_content = self.tokenizer.tokenize(text)

                # Remove stop words from tokenized content
                if self.stop_word_enabled:
                    modified_tokenized_content = [
                        term.lower()
                        for term in tokenized_content
                        if term not in self.stop_words_list
                    ]

                # Store document information for later use in search engine
                document_information[docID] = [
                    len(tokenized_content),
                    modified_tokenized_content,
                    title,
                ]

                # Convert to dictionary for faster lookup
                tokenized_content = dict.fromkeys(tokenized_content)

                # Iterate through tokens
                for term_index, term in enumerate(tokenized_content.keys()):
                    # Lowercase term for case insensitivity
                    term = term.lower()

                    # Check if stop word removal is enabled and skip term if it is a stop word
                    if self.stop_word_enabled and term in self.stop_words_list:
                        continue

                    # Check if stemming is enabled and stem term
                    if self.stemmer_enabled:
                        term = self.stemmer.stem(term)

                    # Check if term is in the postings list
                    if self.postings_list.get(term):
                        # Get posting for term for the document using document ID
                        posting = (self.postings_list[term]).get(docID)

                        # If postings exist for document, increment term frequency and add position else create new posting for document
                        if posting:
                            posting += 1
                            posting[1].append(term_index)
                        else:
                            summary = self.getFirstOccurrenceSummary(
                                tokenized_content, term_index
                            )

                            self.postings_list[term][docID] = [
                                1,
                                [term_index],
                                title,
                                summary,
                            ]

                            self.postings_list[term][docID] = 1
                    else:
                        # Add new term to postings list
                        summary = self.getFirstOccurrenceSummary(
                            tokenized_content, term_index
                        )

                        self.postings_list[term] = {
                            docID: [1, [term_index], title, summary]
                        }

                        self.postings_list[term] = {docID: 1}

                    # Add term and document frequency to dictionary list
                    self.dictionary_list[term] = len(self.postings_list[term])

        # Write corpus and document lengths to information file as binary (saves space)
        with gzip.open("corpus_information.json", "wb") as corpus_information_file:
            json_str = json.dumps(
                {
                    "corpus_length": corpus_length,
                    "document_information": document_information,
                },
                separators=(",", ":"),
            )

            json_bytes = json_str.encode("utf-8")
            corpus_information_file.write(json_bytes)

    def getFirstOccurrenceSummary(
        self, tokenized_terms, first_occurence_position
    ) -> str:
        # Turn tokenized terms into list since dict type is not indexable
        tokenized_terms = list(tokenized_terms.keys())

        # Get first 10 words within the context of the term
        if (
            first_occurence_position - 5
        ) < 0:  # Check if first occurence is within first 5 terms
            summary = " ".join(tokenized_terms[0:11])
        elif (first_occurence_position + 5) > len(
            tokenized_terms
        ):  # Check if first occurence is within last 5 terms
            summary = " ".join(tokenized_terms[len(tokenized_terms) - 10 :])
        else:  # Otherwise, get 5 terms before and after first occurence
            summary = " ".join(
                tokenized_terms[
                    first_occurence_position - 5 : first_occurence_position + 6
                ]
            )

        return summary

    def writePostings(self) -> None:
        # Sort positions list by document ID in ascending order
        for term in self.postings_list:
            self.postings_list[term] = dict(sorted(self.postings_list[term].items()))

        # Sort terms in postings list and write to postings file as binary after compressing using gzip
        print("Writing to postings file...")
        with gzip.open(self.postings_output_file, "wb") as postings_file:
            json_str = json.dumps(
                self.postings_list,
                separators=(",", ":"),
                sort_keys=True,
            )
            json_bytes = json_str.encode("utf-8")
            postings_file.write(json_bytes)

        # Clear postings list to save memory
        del self.postings_list

    def writeDictionary(self) -> None:
        # Sort dctionary list by term and write to dictionary file as binary after compressing using gzip
        print("Writing to dictionary file...")
        with gzip.open(self.dictionary_output_file, "wb") as dictionary_file:
            json_str = json.dumps(
                self.dictionary_list,
                sort_keys=True,
                separators=(",", ":"),
            )
            json_bytes = json_str.encode("utf-8")
            dictionary_file.write(json_bytes)

        # Clear dictionary list to save memory
        del self.dictionary_list


if __name__ == "__main__":
    # Menu for user to select input parameters for stop word removal and stemming
    # Note: cleandoc is used to fix the indentation of the menu for printing
    menu = cleandoc("""Enter the number of the option you would like to run:
                           1. Run with stop word removal and stemming
                           2. Run with stop word removal only
                           3. Run with stemming only
                           4. Run without stop word removal or stemming
                           5. Exit\n
                           > """
    )

    # Get user input and set parameters accordingly
    while True:
        option = input(menu)

        if option == "1":
            stop_word_enabled = True
            stemmer_enabled = True
            break
        elif option == "2":
            stop_word_enabled = True
            stemmer_enabled = False
            break
        elif option == "3":
            stop_word_enabled = False
            stemmer_enabled = True
            break
        elif option == "4":
            stop_word_enabled = False
            stemmer_enabled = False
            break
        elif option == "5":
            exit()
        else:
            print("Invalid option. Please try again.\n")

    # Create index inverter object
    inverter_obj = IndexInverter(
        "trec_corpus_5000.jsonl",
        "stopwords.txt",
        "dictionary.json",
        "postings.json",
        stemmer_enabled,
        stop_word_enabled,
    )

    print("\nCreating inverted index...")
    index_creation_start_time = time.time()

    # Create inverted index
    inverter_obj.createInvertedIndex()

    index_creation_end_time = time.time()
    print(
        "Inverted index created in: ",
        timedelta(seconds=(index_creation_end_time - index_creation_start_time)),
        "\n",
    )

    write_files_start_time = time.time()

    # Write dictionary and postings to files
    inverter_obj.writePostings()
    inverter_obj.writeDictionary()

    write_files_end_time = time.time()
    print(
        "Files written in: ",
        timedelta(seconds=(write_files_end_time - write_files_start_time)),
        "\n",
    )

    print("Inverted index created successfully!")

    # Invoke garbage collector to free up memory
    gc.collect()
