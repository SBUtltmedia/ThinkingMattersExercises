room_size=10
for ii in range(room_size):
    for jj in range(room_size):
        i = int(ii-room_size/2)
        j = int(jj-room_size/2)
        print(f':: {i}_{j}')
        print(f'[[east|{i-1}_{j}]]')
        print(f'[[west|{i+1}_{j}]]')
        print(f'[[north|{i}_{j-1}]]')
        print(f'[[south|{i}_{j+1}]]')
