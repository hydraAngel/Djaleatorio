from bs4 import BeautifulSoup
import json
import requests

def pegar_letras(qual: str) -> None:
  html = requests.get("https://djavan.com.br/discografia/"+qual).content

  soup = BeautifulSoup(html, 'html.parser')

  letras = soup.find_all(attrs={"data-modal-data": True}) # pega a letra da música



  for letra in letras:
      
      data = letra.get('data-modal-data')
      # checar se tem espaco na letra
      if data is not None:
        if '/' not in json.loads(data)['title']:
          
          titulo = json.loads(data)['title']
          with open(titulo + '.text', 'w') as f:
              f.write(json.loads(data)['lyrics'] + '\n\n\n')
              f.write('Album: ' + qual)
              f.close()

with open('test1.txt') as f:
  for line in f:
    pegar_letras(line.strip())