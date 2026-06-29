# Mini Request Desk

Mini Request Desk è una piccola web app interna per raccogliere e rivedere richieste operative. La versione attuale è un sandbox del corso: può funzionare con dati demo locali e può usare Supabase solo quando tabella, variabili ambiente e policy sono configurate.

## Stato Attuale

- Framework: Next.js App Router con TypeScript e Tailwind CSS.
- Schermata principale: lista richieste, contatori, dettaglio selezionato e form nuova richiesta.
- Stato dati: `Demo locale` quando Supabase non è configurato; `Supabase collegato` solo quando ambiente e tabella sono pronti.
- Controlli verificati: lint, build di produzione, avvio locale simile alla produzione, form desktop, form mobile e creazione di una richiesta demo locale.
- URL preview: `[aggiungi la preview Vercel sicura solo dopo averla creata e testata]`.

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

Copia `.env.example` in `.env.local` solo quando un sandbox Supabase sicuro è pronto.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Non committare `.env.local`, password database, service-role key, secret key, project ref privati o URL preview privati.

## Percorso Demo

Usa solo dati fittizi.

1. Apri la preview sicura, oppure usa l'URL locale simile alla produzione se non esiste ancora una preview.
2. Mostra il banner dati: `Demo locale`, `Supabase collegato` o `Controlla Supabase`.
3. Mostra lista richieste, contatori e dettaglio selezionato.
4. Crea una richiesta fittizia dal form.
5. Conferma se la nuova richiesta è stata salvata solo in demo locale oppure in Supabase.
6. Chiudi mostrando limiti noti e prossimi passi di produzione.

## Limiti Noti

- Non esiste ancora una preview Vercel trattenuta e verificata nelle evidenze del corso.
- Autenticazione e ruoli utente non sono implementati.
- L'evidenza locale prova il flusso demo/fallback; non prova una scrittura reale su Supabase senza `.env.local`, tabella `requests` e policy configurate privatamente.
- RLS e policy devono essere riviste prima di esporre l'app a utenti reali.
- Il rumore Console da estensioni browser non è evidenza dell'app; usa build log, runtime log ed errori specifici dell'app.
- Una snapshot Lighthouse ha segnalato un ritocco non bloccante sul contrasto di alcuni testi secondari.

## Roadmap Verso Produzione

1. Crea o seleziona il repository GitHub pulito.
2. Importalo in Vercel e configura le variabili ambiente corrette.
3. Crea la tabella Supabase `requests` con le colonne previste.
4. Abilita e testa le policy RLS per gli utenti previsti.
5. Ripeti la checklist smoke test sulla preview pubblicabile.
6. Registra limiti noti, rischi e decisioni di ownership prima del rilascio.
7. Aggiungi autenticazione, notifiche, storico e stati richiesta più ricchi solo dopo aver stabilizzato il flusso minimo.

## Checklist Handoff

- [ ] URL preview aggiunta e testata, oppure stato solo-locale dichiarato.
- [ ] `npm run lint` passa.
- [ ] `npm run build` passa.
- [ ] Percorso form principale testato con dati fittizi.
- [ ] Percorso mobile controllato.
- [ ] Log rivisti e problemi specifici dell'app elencati.
- [ ] Limiti noti e condizioni di produzione documentati.
- [ ] Nessun segreto, URL privato, account name o dato cliente incluso.
