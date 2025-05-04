function populateUpdateInformation(data) {
    const updateActionText = document.getElementById('UpdateAction');

    if (data != null) {
        // Changer le texte s'il y a une mise à jour disponible
        updateActionText.textContent = Lang.queryJS('app.updateAvailable'); // Exemple : "Mise à jour disponible"

        // Vérifier le système d'exploitation et agir en conséquence
        if (process.platform === 'darwin') {
            // Pour macOS, ouvrir le lien de téléchargement de la mise à jour
            shell.openExternal(data.darwindownload);
        } else {
            // Pour les autres plateformes, envoyer un message pour installer la mise à jour
            ipcRenderer.send('autoUpdateAction', 'installUpdateNow');
        }
    } else {
        // Aucun changement, ou message indiquant que l'application est à jour
        updateActionText.textContent = Lang.queryJS('app.upToDate'); // Exemple : "Application à jour"
        console.log('Aucune mise à jour disponible.');
    }
}
