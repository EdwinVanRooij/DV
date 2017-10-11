import csv

with open('../data.csv', 'r') as f:
    reader = csv.reader(f)
    your_list = list(reader)

final_dict = dict()

for item in your_list[1:]:
    key = item[1][0:4]
    final_dict[key] = final_dict.get(key, 0) + 1

print(final_dict)

with open('../posts-by-year.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile, delimiter=',',
                        quotechar='"', quoting=csv.QUOTE_MINIMAL)

    writer.writerow(['year', 'amount'])
    for key in final_dict:
        writer.writerow([key, final_dict[key]])
