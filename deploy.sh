#!/bin/bash

# Nome del file da copiare
data="data.json"
read -p "Inserisci un messaggio di commit: " message

# Funzione per le operazioni comuni
operazioni_comuni() {
    cp "$data" ./app/src/  # Copia in una sottodirectory della directory corrente
    cp "$data" ./dashboard/src/  # Copia in una sottodirectory della directory corrente
    cd ./app
    npm run build
    cd ..
    cd ./dashboard
    npm run build
    cd ..
    firebase deploy --only hosting
}

# Controlla gli argomenti e esegui le operazioni appropriate
if [[ "$1" == "--app" ]]; then
    cp "$data" ./app/src/
    cd ./app
    npm run build
    cd ..
    firebase deploy --only hosting:app
elif [[ "$1" == "--dashboard" ]]; then
    cp "$data" ./dashboard/src/
    cd ./dashboard
    npm run build
    cd ..
    firebase deploy --only hosting:dashboard
else
    operazioni_comuni
fi

# Comandi git
git add .
git commit -m "$message"
git push
