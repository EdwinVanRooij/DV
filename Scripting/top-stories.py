# Get the top n stories by word x
import pandas as pd

pd.options.display.max_colwidth = 5000

stories = 10
word = 'china'

df = pd.read_csv('../data/data/data.csv', sep=',', low_memory=False, encoding = 'ISO-8859-1')
df = df.drop(labels=['subreddit', 'over_18', 'time_created', 'down_votes'], axis=1)
df = df[df['title'].str.contains(word)]
df = df.sort_values(by=['up_votes'], ascending=False)

df[0:stories].to_csv('../data/top-{}-stories-{}.csv'.format(stories, word), sep=',', encoding='utf-8')
