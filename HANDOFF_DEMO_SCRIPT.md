# Mini Request Desk - Demo Handoff di 3 Minuti

**URL produzione verificata:** `https://mini-request-desk-course-demo-20260.vercel.app/`

**Fallback tecnico locale:** `http://localhost:3013` dopo `npm run build` e `npm run start -- -p 3013`.

## Obiettivo

Mostra problema, soluzione attuale, stato verificato, limiti noti e prossimi passi senza dichiarare più di quanto è stato testato.

## Script

### 0:00-0:25 - Problema

"Mini Request Desk risolve un problema semplice: raccogliere richieste operative in un punto solo, invece di perderle tra messaggi, email e note sparse."

Mostra titolo dell'app e lista richieste sulla URL produzione verificata.

### 0:25-1:05 - Soluzione

"La prima versione ha una lista di richieste, contatori rapidi, dettaglio selezionato e un form per creare una nuova richiesta demo."

Mostra contatori, lista, dettaglio selezionato e form `Nuova richiesta`.

### 1:05-2:00 - Stato Verificato

"Il progetto passa il percorso minimo verificato: repo GitHub, deploy Vercel, variabili ambiente su Vercel, tabella Supabase `requests`, policy RLS demo, lettura dati e inserimento di una richiesta fittizia dalla URL pubblica."

Crea o mostra una richiesta fittizia. Mostra il messaggio `Richiesta salvata in Supabase`, l'origine `Supabase`, e conferma che la riga compare nella Table Editor.

### 2:00-2:35 - Limiti Noti

"Questa è una demo tecnica pubblicabile, non una release con utenti reali. Mancano autenticazione, ruoli, ownership dei record, policy RLS di produzione e una decisione su dati reali, notifiche e gestione degli stati."

Mostra la sezione `Limiti Noti` del README.

### 2:35-3:00 - Prossimi Passi

"Il prossimo passo è sostituire le policy demo anonime con regole legate agli utenti, ripetere lo smoke test su produzione e preview dopo ogni modifica, poi decidere cosa entra nella prima release reale."

Mostra le sezioni `Roadmap Verso Produzione` e `Checklist Handoff`.

## Cosa Non Dichiarare

- Non dire che l'app è pronta per dati o utenti reali.
- Non dire che le policy demo anonime sono policy di produzione.
- Non mostrare `.env.local`, chiavi, project ref, account name, URL privati o dati reali.
- Non promettere autenticazione, ruoli, notifiche o workflow non implementati.
