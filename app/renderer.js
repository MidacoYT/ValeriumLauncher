// Fonction pour afficher le statut de la mise à jour
function setUpdateStatus(message) {
    document.getElementById('checkVersionText').innerText = message
}

// Vérifier les mises à jour dès le chargement de la page
window.onload = () => {
    setUpdateStatus("Vérification des mises à jour...");
    ipcRenderer.send('autoUpdateAction', 'checkForUpdate'); // Demander au processus principal de vérifier les mises à jour
}

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
            setTimeout(() => {
                ipcRenderer.send('autoUpdateAction', 'installUpdateNow');
            }, 3000);  // Délai de 3 secondes avant d'installer la mise à jour
            break;

        case 'update-not-available':
            setUpdateStatus("Aucune mise à jour disponible.");

            setTimeout(() => {
                const checkVersionReady1 = document.getElementById('checkVersion');
                const mainPage = document.getElementById('main');

                if (checkVersionReady1 && mainPage) {
                    checkVersionReady1.style.display = 'none';  // Cacher l'écran de vérification des mises à jour
                    mainPage.style.display = 'block';  // Afficher la page principale

                    // Ajouter le conteneur de chargement avant d'afficher la page principale
                    const loadingContainer = document.getElementById('loadingContainer');
                    if (loadingContainer) {
                        loadingContainer.style.display = 'flex';  // Afficher le conteneur de chargement
                    }

                    // Masquer le conteneur de chargement après 3 secondes
                    setTimeout(() => {
                        if (loadingContainer) {
                            loadingContainer.style.display = 'none';  // Masquer le conteneur de chargement après 3 secondes
                        }
                    }, 5000);
                }
            }, 5000);  // Délai de 3 secondes avant de changer l'affichage

            break;

        case 'ready':
            loggerAutoUpdater.info('Ready for update check.')

            // Afficher le statut dans la section checkVersion
            const checkVersionReady = document.getElementById('checkVersion');
            const checkVersionTextReady = document.getElementById('checkVersionText');
            if (checkVersionReady && checkVersionTextReady) {
                checkVersionTextReady.textContent = 'Prêt à vérifier les mises à jour...';
                checkVersionReady.style.display = 'flex';
            }

            // Demande de vérification de la mise à jour toutes les 30 minutes (ou dès le démarrage)
            updateCheckListener = setInterval(() => {
                ipcRenderer.send('autoUpdateAction', 'checkForUpdate');
            }, 1800000); // 30 minutes
            ipcRenderer.send('autoUpdateAction', 'checkForUpdate'); // Demander immédiatement la vérification de la mise à jour
            break;

        case 'realerror':
            setUpdateStatus(`Erreur lors de la vérification de la mise à jour: ${info.message}`);
            break;

        default:
            setUpdateStatus('Événement inconnu: ' + arg);
            break;
    }
})
