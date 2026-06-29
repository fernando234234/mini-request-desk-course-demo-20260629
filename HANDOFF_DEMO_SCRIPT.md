# Mini Request Desk - Demo Handoff di 3 Minuti

**URL preview:** `[aggiungi la preview Vercel sicura solo dopo averla creata e testata]`  
**Fallback per la registrazione del corso:** `http://localhost:3013` dopo `npm run build` e `npm run start -- -p 3013`.

## Obiettivo

Mostra problema, soluzione attuale, stato verificato, limiti noti e prossimi passi senza dichiarare più di quanto è stato testato.

## Script

### 0:00-0:25 - Problema

"Mini Request Desk risolve un problema semplice: raccogliere richieste operative in un punto solo, invece di perderle tra messaggi, email e note sparse."

Mostra titolo dell'app e lista richieste.

### 0:25-1:05 - Soluzione

"La prima versione ha una lista di richieste, contatori rapidi, dettaglio selezionato e un form per creare una nuova richiesta demo."

Mostra contatori, lista, dettaglio selezionato e form `Nuova richiesta`.

### 1:05-2:00 - Stato Verificato

"Il progetto passa i controlli locali essenziali: lint, build, apertura in modalità simile alla produzione, form desktop, form mobile e lettura dei log. Se Supabase non è configurato, lo stato `Demo locale` rende chiaro che i dati restano fittizi."

Crea una richiesta fittizia. Mostra il messaggio di conferma e l'origine del dato.

### 2:00-2:35 - Limiti Noti

"Questa non è ancora una consegna di produzione. Mancano una preview Vercel verificata, autenticazione, policy RLS testate per utenti reali e una prova di scrittura Supabase se l'ambiente non è configurato."

Mostra la sezione `Limiti Noti` del README.

### 2:35-3:00 - Prossimi Passi

"Il prossimo passo è creare una preview pulita, configurare le variabili, verificare tabella e policy, ripetere lo smoke test sul link condivisibile e poi decidere cosa entra nella prima release reale."

Mostra le sezioni `Roadmap Verso Produzione` e `Checklist Handoff`.

## Cosa Non Dichiarare

- Non dire che l'app è pronta per la produzione.
- Non dire che una preview Vercel funziona se il link non è stato creato e testato.
- Non dire che Supabase salva dati se ambiente privato, tabella e policy non sono configurati e verificati.
- Non mostrare `.env.local`, chiavi, project ref, account name, URL privati o dati reali.
