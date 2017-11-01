import csv

with open('../data.csv', 'r') as f:
    reader = csv.reader(f)
    your_list = list(reader)

final_dict = dict()

for item in your_list[1:]:
    year = item[1][0:4]
    month = item[1][5:7]
    if 1 <= int(month) <= 3:
        quarter = 1
    elif 4 <= int(month) <= 6:
        quarter = 2
    elif 7 <= int(month) <= 9:
        quarter = 3
    else:
        quarter = 4
    key = year + '-' + str(quarter)
    final_dict[key] = final_dict.get(key, 0) + 1

print(final_dict)

with open('../posts-by-quarter.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile, delimiter=',',
                        quotechar='"', quoting=csv.QUOTE_MINIMAL)

    writer.writerow(['year', 'amount'])
    for key in final_dict:
        writer.writerow([key, final_dict[key]])
