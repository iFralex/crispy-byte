#!/bin/bash

data="data.json"
read -p "Inserisci un messaggio di commit: " message

comman_operations() {
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

if [[ "$1" == "--app" ]]; then
    # Only app
    cp "$data" ./app/src/
    cd ./app
    npm run build
    cd ..
    firebase deploy --only hosting:app
elif [[ "$1" == "--dashboard" ]]; then
    # Only dashboard
    cp "$data" ./dashboard/src/
    cd ./dashboard
    npm run build
    cd ..
    firebase deploy --only hosting:dashboard
else
    # both
    comman_operations
fi

# Upload on github
git add .
git commit -m "$message"
git push

echo "Deploy completed succesfully!"