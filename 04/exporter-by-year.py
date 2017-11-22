import numpy as np
import matplotlib as mpl
import pandas as pd
from matplotlib import pyplot as plt

import argparse

parser = argparse.ArgumentParser()
parser.add_argument("year")
parser.add_argument("amount")
args = parser.parse_args()

year = int(args.year)
amount = int(args.amount)

print("Getting words by year " + str(year) + ".")
print("Getting " + str(amount) + " words.")


df = pd.read_csv('../data/data.csv', sep=',', low_memory=False, encoding = 'ISO-8859-1')

# Let's remove the unused column first
df = df.drop(labels='subreddit', axis=1) # axis 1 drops columns, 0 will drop rows that match index value in labels

# Get all posts from 2012 till 2014.
tdf = df.copy()

# Ensure date_created is a datetime object
tdf['date_created'] = pd.to_datetime(df['date_created'])  

# Create and apply a boolean mask 
mask = (tdf['date_created'] >= str(year)+'-1-1') & (tdf['date_created'] < str(year+1)+'-1-1')
#mask = (tdf['date_created'] > '2012-1-1') & (tdf['date_created'] <= '2014-1-1')
tdf = tdf.loc[mask]

# Only keep the titles
tdf = tdf[['title']]

titles = tdf['title'].tolist()


# Now count the words
from collections import Counter
from nltk.corpus import stopwords

counts = Counter()
s_words = stopwords.words('english')
s_words.append('-')

for sentence in titles:
    words = [word.strip('.,?!"\'').lower() for word in sentence.split()]
    filtered_words = [w for w in words if w not in s_words]
    counts.update(filtered_words)


most_common = counts.most_common(amount)
most_common

L = zip(*most_common)
words, frequency = L

print("Words:")
print(words)

print("Frequency:")
print(frequency)


f = open("test.csv", "w")

f.write("word,frequency\n")
for i in range(len(words)):
    f.write("{},{}\n".format(words[i], frequency[i]))

f.close()
