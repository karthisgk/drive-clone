import json
import os
f = open('package.json')
data = json.load(f)
packs = ""
for keys in data['dependencies']:
    packs += keys + " "

os.system('npm install ' + packs)

for keys in data['devDependencies']:
    packs += keys + " "

os.system('npm install --save ' + packs)