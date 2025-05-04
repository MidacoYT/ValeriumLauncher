// Fonction pour afficher le statut de la mise à jour
function setUpdateStatus(message) {
    document.getElementById('checkVersionText').innerText = message
}

// Vérifier les mises à jour dès le chargement de la page
window.onload = () => {
    setUpdateStatus("Vérification des mises à jour...");
    ipcRenderer.send('autoUpdateAction', 'checkForUpdate'); // Demander au processus principal de vérifier les mises à jour
}

// Écoute des événements envoyés par le processus principal
ipcRenderer.on('autoUpdateNotification', (event, arg, info) => {
    switch (arg) {
        case 'checking-for-update':
            setUpdateStatus("Vérification des mises à jour...");
            break;

        case 'update-available':
            setUpdateStatus(`Mise à jour disponible! (Version: ${info.version})`);
            break;

        case 'update-downloaded':
            setUpdateStatus(`Mise à jour téléchargée (Version: ${info.version}). Installation en cours...`);
            // Une fois la mise à jour téléchargée, l'installer
            ipcRenderer.send('autoUpdateAction', 'installUpdateNow');
            break;

        case 'update-not-available':
            setUpdateStatus("Aucune mise à jour disponible.");
            break;

        case 'realerror':
            setUpdateStatus(`Erreur lors de la vérification de la mise à jour: ${info.message}`);
            break;

        default:
            setUpdateStatus('Événement inconnu: ' + arg);
            break;
    }
})
