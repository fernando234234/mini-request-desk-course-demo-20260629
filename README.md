# Mini Request Desk

Mini Request Desk è una piccola web app interna per raccogliere e rivedere richieste operative. La versione attuale è un sandbox del corso collegato a un progetto Supabase dedicato e pubblicato su Vercel.

## Stato Attuale

- Framework: Next.js App Router con TypeScript e Tailwind CSS.
- Schermata principale: lista richieste, contatori, dettaglio selezionato e form nuova richiesta.
- Stato dati verificato: `Supabase collegato` sulla URL pubblica Vercel dopo configurazione delle variabili ambiente, tabella `requests` e policy RLS demo.
- Controlli verificati: lint, build di produzione, avvio locale con `.env.local`, form desktop, form mobile, scrittura Supabase locale e scrittura Supabase dalla URL pubblica Vercel.
- URL produzione verificata: `https://mini-request-desk-course-demo-20260.vercel.app/`.
- Repo GitHub demo: `https://github.com/fernando234234/mini-request-desk-course-demo-20260629`.

## Avvio Locale

```bash
npm install
npm run dev
```

Apri `http://localhost:3000`.

Per un controllo locale simile alla produzione:

```bash
npm run build
npm run start -- -p 3013
```

Apri `http://localhost:3013`.

## Variabili Ambiente

Copia `.env.example` in `.env.local` solo quando un sandbox Supabase dedicato è pronto.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Non committare `.env.local`, password database, service-role key, secret key, project ref privati o valori delle chiavi.

## Percorso Demo

Usa solo dati fittizi.

1. Apri la URL produzione verificata su Vercel, oppure usa l'URL locale simile alla produzione per una prova tecnica interna.
2. Mostra il banner dati: `Demo locale`, `Supabase collegato` o `Controlla Supabase`.
3. Mostra lista richieste, contatori e dettaglio selezionato.
4. Crea una richiesta fittizia dal form.
5. Conferma che la nuova richiesta è stata salvata in Supabase guardando il messaggio di successo, l'origine `Supabase` e la riga nella Table Editor.
6. Chiudi mostrando limiti noti e prossimi passi di produzione.

## Limiti Noti

- Autenticazione e ruoli utente non sono implementati.
- Le policy RLS attuali sono minime e dimostrative: consentono lettura e inserimento anonimi per il corso. Prima di una release reale vanno sostituite con regole legate ad autenticazione e ruoli.
- Il rumore Console da estensioni browser non è evidenza dell'app; usa build log, runtime log ed errori specifici dell'app.
- Una snapshot Lighthouse precedente ha segnalato un ritocco non bloccante sul contrasto di alcuni testi secondari.

## Roadmap Verso Produzione

1. Tenere aggiornati GitHub, Vercel e Supabase con gli stessi passaggi documentati nel corso.
2. Sostituire le policy demo anonime con autenticazione, ruoli e ownership dei record.
3. Ripetere lo smoke test su produzione e preview dopo ogni modifica di env, policy o schema.
4. Registrare limiti noti, rischi e decisioni di ownership prima del rilascio.
5. Aggiungere notifiche, storico e stati richiesta più ricchi solo dopo aver stabilizzato il flusso minimo.

## Checklist Handoff

- [x] URL produzione Vercel aggiunta e testata.
- [x] `npm run lint` passa.
- [x] `npm run build` passa.
- [x] Percorso form principale testato con dati fittizi su produzione.
- [x] Percorso mobile controllato.
- [x] Log/browser network rivisti per la prova produzione.
- [x] Limiti noti e condizioni di produzione documentati.
- [x] Nessun segreto, URL privato, account name o dato cliente incluso.
