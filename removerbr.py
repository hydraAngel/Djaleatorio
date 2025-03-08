import os

diretorio = "./"  # Ajuste para o seu diretório

# Percorrer todos os arquivos no diretório
for arquivo in os.listdir(diretorio):
    if arquivo.endswith(".text"):
        caminho_arquivo = os.path.join(diretorio, arquivo)

        # Ler o arquivo
        with open(caminho_arquivo, "r", encoding="utf-8") as f:
            linhas = f.readlines()

        # Modificar todas as linhas, exceto a última
        for i in range(len(linhas) - 1):
            # garante que na linha exista a palavra '<br />'
            if "<br />" in linhas[i]:
                linhas[i] = (
                    linhas[i][:-7] + "\n"
                )  # Remove os últimos 6 caracteres antes do '\n'

        # Escrever as modificações de volta ao arquivo
        with open(caminho_arquivo, "w", encoding="utf-8") as f:
            f.writelines(linhas)
