import gzip
import json
import time
from datetime import timedelta
from search_util import SearchUtil
from flask import Flask, request, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

postings = None
dictionary = None
stopwords = None
corpus_length = None
document_information = None
search_util_object = None


def load_data():
    global postings, dictionary, stopwords, corpus_length, document_information

    # Load dictionary from file
    with gzip.open("postings.json", "rt") as postings_file:
        postings = json.load(postings_file)

    print("Postings loaded successfully")

    # Load dictionary from file
    with gzip.open("dictionary.json", "rt") as dictionary_file:
        dictionary = json.load(dictionary_file)

    print("Dictionary loaded successfully")

    # Load stopwords from file
    with open("stopwords.txt", "r") as stop_words_file:
        stopwords = dict.fromkeys(stop_words_file.read().splitlines())

    print("Stopwords loaded successfully")

    # Load document lengths from file
    with gzip.open("corpus_information.json", "rt") as corpus_information_file:
        corpus_information = json.load(corpus_information_file)

        corpus_length = corpus_information["corpus_length"]
        document_information = corpus_information["document_information"]

    print("Corpus information loaded successfully")


print("Loading data from files...")
load_start_time = time.time()

load_data()

print("Creating search utility object...")

# Create search utility object
search_util_object = SearchUtil(
    postings=postings,
    dictionary=dictionary,
    stopwords=stopwords,
    corpus_length=corpus_length,
    document_information=document_information,
)

print("Search utility object created successfully")

load_end_time = time.time()
print(
    "Data loaded and objects created successfully in ",
    timedelta(seconds=load_end_time - load_start_time),
    "\n",
)


# Home page
@app.route("/")
def home():
    return render_template("search_engine.html")


# API endpoint for search
@app.route("/search", methods=["GET"])
def search():
    global search_util_object

    # Get query parameters from request
    query = request.args.get("query")

    # Start timer
    search_start_time = time.time()

    # Apply BM25 search
    result = search_util_object.bm25_search(query)

    # Stop timer and get time taken to search in seconds
    search_end_time = time.time()
    seconds = search_end_time - search_start_time

    # Return search results and time taken to search
    return {"time": seconds, "result": result}


if __name__ == "__main__":
    app.run(debug=False, use_reloader=False)
