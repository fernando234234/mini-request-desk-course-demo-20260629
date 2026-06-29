"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/utils/supabase/client";
import type {
  RequestInsert,
  RequestPriority,
  RequestRow,
  RequestStatus,
} from "@/utils/supabase/client";

type RequestItem = {
  id: number;
  title: string;
  description: string;
  requester: string;
  priority: RequestPriority;
  status: RequestStatus;
  createdAt: string;
  source: "Supabase" | "Demo locale";
};

type RequestForm = {
  title: string;
  description: string;
  requester: string;
  priority: RequestPriority;
};

type ConnectionState = "checking" | "configured" | "missing-env" | "error";

const initialRequests: RequestItem[] = [
  {
    id: 101,
    title: "Riparare badge accesso",
    description:
      "Il badge demo non apre il tornello dell'ingresso principale dopo il cambio turno.",
    requester: "Area Operations",
    priority: "Alta",
    status: "Nuova",
    createdAt: "18 giugno 2026",
    source: "Demo locale",
  },
  {
    id: 102,
    title: "Aggiornare postazione meeting room",
    description:
      "Serve controllare monitor e cavo HDMI nella sala riunioni grande prima del workshop.",
    requester: "Area IT",
    priority: "Media",
    status: "In lavorazione",
    createdAt: "17 giugno 2026",
    source: "Demo locale",
  },
  {
    id: 103,
    title: "Richiedere materiale onboarding",
    description:
      "Preparare notebook demo, badge ospite e checklist per tre nuovi colleghi fittizi.",
    requester: "Area HR",
    priority: "Bassa",
    status: "Risolta",
    createdAt: "14 giugno 2026",
    source: "Demo locale",
  },
];

const emptyForm: RequestForm = {
  title: "",
  description: "",
  requester: "",
  priority: "Media",
};

const statusStyles: Record<RequestStatus, string> = {
  Nuova: "border-rose-200 bg-rose-50 text-rose-700",
  "In lavorazione": "border-amber-200 bg-amber-50 text-amber-700",
  Risolta: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const priorityStyles: Record<RequestPriority, string> = {
  Alta: "border-red-200 bg-red-50 text-red-700",
  Media: "border-sky-200 bg-sky-50 text-sky-700",
  Bassa: "border-slate-200 bg-slate-50 text-slate-700",
};

const connectionCopy: Record<
  ConnectionState,
  { label: string; helper: string; className: string }
> = {
  checking: {
    label: "Controllo dati",
    helper: "Sto verificando se l'app può leggere la tabella Supabase.",
    className: "border-slate-200 bg-white text-slate-600",
  },
  configured: {
    label: "Supabase collegato",
    helper: "La lista usa la tabella requests e il form salva nuovi record demo.",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  "missing-env": {
    label: "Demo locale",
    helper:
      "Manca .env.local, contiene placeholder o ha un URL non valido: la schermata resta usabile con dati fittizi.",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  error: {
    label: "Controlla Supabase",
    helper:
      "La configurazione esiste, ma lettura o scrittura sono bloccate. Verifica tabella, colonne e policy nella prossima fase.",
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
};

function mapRowToRequest(row: RequestRow): RequestItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    requester: row.requester,
    priority: row.priority,
    status: row.status,
    createdAt: formatDate(row.created_at),
    source: "Supabase",
  };
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function requestCode(id: number) {
  return `REQ-${id.toString().padStart(3, "0")}`;
}

export default function Home() {
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  const [selectedId, setSelectedId] = useState(initialRequests[0]?.id ?? 0);
  const [form, setForm] = useState<RequestForm>(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [connectionState, setConnectionState] =
    useState<ConnectionState>(isSupabaseConfigured ? "checking" : "missing-env");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedId) ?? requests[0],
    [requests, selectedId],
  );

  const openCount = requests.filter((request) => request.status !== "Risolta").length;
  const highPriorityCount = requests.filter(
    (request) => request.priority === "Alta",
  ).length;
  const connectionStatus = connectionCopy[connectionState];

  async function loadRequests() {
    if (!supabase || !isSupabaseConfigured) {
      setConnectionState("missing-env");
      setRequests(initialRequests);
      setSelectedId(initialRequests[0]?.id ?? 0);
      return;
    }

    setIsLoading(true);
    setError("");

    const { data, error: readError } = await supabase
      .from("requests")
      .select("id,title,description,requester,priority,status,created_at")
      .order("created_at", { ascending: false });

    if (readError) {
      setConnectionState("error");
      setError(
        "Non riesco a leggere requests da Supabase. Controlla nome tabella, colonne e permessi.",
      );
      setIsLoading(false);
      return;
    }

    const nextRequests = (data ?? []).map((row) =>
      mapRowToRequest(row as RequestRow),
    );
    setRequests(nextRequests);
    setSelectedId(nextRequests[0]?.id ?? 0);
    setConnectionState("configured");
    setIsLoading(false);
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    const timer = window.setTimeout(() => {
      void loadRequests();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function updateForm(field: keyof RequestForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      setError("Inserisci almeno titolo e descrizione prima di creare la richiesta demo.");
      setSuccess("");
      return;
    }

    if (!supabase || !isSupabaseConfigured) {
      const newRequest: RequestItem = {
        id: Math.max(...requests.map((request) => request.id), 100) + 1,
        title: form.title.trim(),
        description: form.description.trim(),
        requester: form.requester.trim() || "Area Demo",
        priority: form.priority,
        status: "Nuova",
        createdAt: "22 giugno 2026",
        source: "Demo locale",
      };

      setRequests((current) => [newRequest, ...current]);
      setSelectedId(newRequest.id);
      setForm(emptyForm);
      setError("");
      setSuccess(
        "Ambiente Supabase non configurato: richiesta aggiunta solo alla demo locale.",
      );
      setConnectionState("missing-env");
      return;
    }

    const payload: RequestInsert = {
      title: form.title.trim(),
      description: form.description.trim(),
      requester: form.requester.trim() || "Area Demo",
      priority: form.priority,
      status: "Nuova",
    };

    setIsSaving(true);
    setError("");
    setSuccess("");

    const { data, error: insertError } = await supabase
      .from("requests")
      .insert(payload)
      .select("id,title,description,requester,priority,status,created_at")
      .single();

    if (insertError) {
      setConnectionState("error");
      setError(
        "Supabase ha rifiutato il salvataggio. Controlla tabella, colonne e policy prima di riprovare.",
      );
      setIsSaving(false);
      return;
    }

    const newRequest = mapRowToRequest(data as RequestRow);
    setRequests((current) => [newRequest, ...current]);
    setSelectedId(newRequest.id);
    setForm(emptyForm);
    setConnectionState("configured");
    setSuccess("Richiesta salvata in Supabase e mostrata in cima alla lista.");
    setIsSaving(false);
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Mini Request Desk
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Richieste operative demo
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              La lista ora può leggere da Supabase e il form può inserire una
              nuova riga nella tabella requests quando l&apos;ambiente è pronto.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <SummaryCard label="Totali" value={requests.length.toString()} />
            <SummaryCard label="Aperte" value={openCount.toString()} />
            <SummaryCard label="Alta pr." value={highPriorityCount.toString()} />
          </div>
        </header>

        <section
          className={`rounded-lg border px-4 py-3 text-sm shadow-sm ${connectionStatus.className}`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">{connectionStatus.label}</p>
              <p className="mt-1 leading-6">{connectionStatus.helper}</p>
            </div>
            <button
              type="button"
              onClick={() => void loadRequests()}
              className="rounded-md border border-current px-3 py-2 text-sm font-semibold transition hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? "Aggiorno..." : "Ricarica lista"}
            </button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.45fr_0.9fr]">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Lista richieste
                </h2>
                <p className="text-sm text-slate-500">
                  Dati letti dalla tabella requests, oppure demo locale se manca
                  la configurazione.
                </p>
              </div>
              <span className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600">
                {connectionState === "configured" ? "Supabase" : "Locale"}
              </span>
            </div>

            {requests.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <h3 className="text-lg font-semibold text-slate-950">
                  Nessuna richiesta presente
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Crea la prima richiesta demo dal form e controlla che compaia
                  subito nella lista.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {requests.map((request) => (
                  <button
                    key={request.id}
                    type="button"
                    onClick={() => setSelectedId(request.id)}
                    className={`flex w-full flex-col gap-3 px-5 py-4 text-left transition hover:bg-slate-50 sm:flex-row sm:items-start sm:justify-between ${
                      selectedId === request.id ? "bg-slate-50" : "bg-white"
                    }`}
                  >
                    <span>
                      <span className="text-sm font-medium text-slate-400">
                        {requestCode(request.id)}
                      </span>
                      <span className="mt-1 block text-base font-semibold text-slate-950">
                        {request.title}
                      </span>
                      <span className="mt-1 block text-sm text-slate-500">
                        {request.requester} - {request.createdAt}
                      </span>
                    </span>

                    <span className="flex flex-wrap gap-2 sm:justify-end">
                      <Badge className={priorityStyles[request.priority]}>
                        {request.priority}
                      </Badge>
                      <Badge className={statusStyles[request.status]}>
                        {request.status}
                      </Badge>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-6">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">
                Nuova richiesta
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Compila una richiesta fittizia. Se Supabase è configurato, il
                salvataggio crea una nuova riga nella tabella requests.
              </p>

              <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Titolo</span>
                  <input
                    id="request-title"
                    name="title"
                    value={form.title}
                    onChange={(event) => updateForm("title", event.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    placeholder="Es. Sistemare accesso sala"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Descrizione
                  </span>
                  <textarea
                    id="request-description"
                    name="description"
                    value={form.description}
                    onChange={(event) =>
                      updateForm("description", event.target.value)
                    }
                    className="mt-1 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    placeholder="Descrivi la richiesta demo in modo sintetico"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Area o richiedente
                    </span>
                    <input
                      id="requester"
                      name="requester"
                      value={form.requester}
                      onChange={(event) =>
                        updateForm("requester", event.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                      placeholder="Area Demo"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">
                      Priorità
                    </span>
                    <select
                      id="request-priority"
                      name="priority"
                      value={form.priority}
                      onChange={(event) =>
                        updateForm("priority", event.target.value as RequestPriority)
                      }
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    >
                      <option>Bassa</option>
                      <option>Media</option>
                      <option>Alta</option>
                    </select>
                  </label>
                </div>

                {error ? (
                  <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                    {error}
                  </p>
                ) : null}

                {success ? (
                  <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                    {success}
                  </p>
                ) : null}

                <button
                  className="w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  disabled={isSaving}
                >
                  {isSaving ? "Salvo..." : "Crea richiesta demo"}
                </button>
              </form>
            </section>

            {selectedRequest ? (
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      Dettaglio selezionato
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-950">
                      {selectedRequest.title}
                    </h2>
                  </div>
                  <Badge className={statusStyles[selectedRequest.status]}>
                    {selectedRequest.status}
                  </Badge>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {selectedRequest.description}
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-slate-400">Richiedente</dt>
                    <dd className="mt-1 font-medium text-slate-700">
                      {selectedRequest.requester}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Priorità</dt>
                    <dd className="mt-1 font-medium text-slate-700">
                      {selectedRequest.priority}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Creata il</dt>
                    <dd className="mt-1 font-medium text-slate-700">
                      {selectedRequest.createdAt}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Origine</dt>
                    <dd className="mt-1 font-medium text-slate-700">
                      {selectedRequest.source}
                    </dd>
                  </div>
                </dl>
              </section>
            ) : null}
          </aside>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-20 rounded-md bg-slate-50 px-3 py-2 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}
