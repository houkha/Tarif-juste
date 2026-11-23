"use client";
import { useState } from "react";

const eur = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const num = (v: string) => Math.max(0, Number(v.replace(/\s/g, "").replace(",", ".")) || 0);

// Lien de paiement Stripe (public, pas un secret). Vide tant que le SIRET n'est pas obtenu.
const PAYMENT_LINK = process.env.NEXT_PUBLIC_PAYMENT_LINK ?? "";

function Champ(p: { id: string; label: string; aide: string; value: string; set: (v: string) => void; suffixe: string }) {
  return (
    <div>
      <label htmlFor={p.id} className="block text-base font-semibold">{p.label}</label>
      <p className="mb-2 text-sm text-encre/70">{p.aide}</p>
      <div className="flex items-center border-2 border-encre bg-white">
        <input
          id={p.id} inputMode="decimal" value={p.value} onChange={(e) => p.set(e.target.value)}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-xl font-semibold outline-none"
        />
        <span className="pr-3 text-encre/70">{p.suffixe}</span>
      </div>
    </div>
  );
}

export default function Page() {
  const [net, setNet] = useState("36000");
  const [charges, setCharges] = useState("4000");
  const [jours, setJours] = useState("180");
  const [actuel, setActuel] = useState("300");
  const [fait, setFait] = useState(false);

  const nNet = num(net), nCh = num(charges), nJ = Math.min(num(jours), 365), nAct = num(actuel);
  const TAUX_COTISATIONS = 0.22; // estimation indicative, à vérifier selon ton statut
  const plancher = nJ > 0 ? (nNet + nCh) / (1 - TAUX_COTISATIONS) / nJ : 0;
  const conseille = plancher * 1.15; // marge pour impayés et creux
  const perte = Math.max(0, (conseille - nAct) * nJ);
  const sousPlancher = nAct < plancher;

  return (
    <main className="mx-auto max-w-xl px-5 pb-24 pt-10">
      <h1 className="font-titre text-4xl font-extrabold leading-tight">
        Tu travailles beaucoup. Ton tarif suit-il ?
      </h1>
      <p className="mt-3 text-lg">
        Entre quatre chiffres. Tu vois ton tarif plancher, ton tarif conseillé et ce que tu perds chaque année.
        Gratuit, sans compte.
      </p>

      <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); setFait(true); }}>
        <Champ id="net" label="Revenu net voulu par an" aide="Ce que tu veux réellement te verser, après charges et cotisations." value={net} set={setNet} suffixe="€ / an" />
        <Champ id="charges" label="Charges professionnelles par an" aide="Logiciels, matériel, assurance, comptable, déplacements." value={charges} set={setCharges} suffixe="€ / an" />
        <Champ id="jours" label="Jours réellement facturables par an" aide="Retire congés, jours fériés, prospection, administratif. Beaucoup tombent entre 150 et 200." value={jours} set={setJours} suffixe="jours" />
        <Champ id="actuel" label="Ton tarif journalier actuel" aide="Ce que tu factures aujourd'hui pour une journée." value={actuel} set={setActuel} suffixe="€ / jour" />
        <button type="submit" className="w-full bg-encre px-5 py-4 text-lg font-semibold text-white active:translate-y-px">
          Commencer le calcul
        </button>
      </form>

      {fait && (
        <section className="mt-12" aria-live="polite">
          <h2 className="font-titre text-2xl font-extrabold">Ton calcul</h2>
          <dl className="mt-4 divide-y divide-filet border-y border-filet">
            <div className="flex justify-between py-3"><dt>Tarif plancher</dt><dd className="font-semibold">{eur(plancher)} / jour</dd></div>
            <div className="flex justify-between bg-surligneur px-2 py-3"><dt className="font-semibold">Tarif conseillé</dt><dd className="font-semibold">{eur(conseille)} / jour</dd></div>
            <div className="flex justify-between py-3"><dt>Ton tarif actuel</dt><dd className="font-semibold">{eur(nAct)} / jour</dd></div>
          </dl>
          <p className="mt-6 font-titre text-3xl font-extrabold leading-tight">
            {perte > 0 ? `Tu perds ${eur(perte)} par an.` : "Ton tarif couvre ton objectif."}
          </p>
          <p className="mt-2 text-sm text-encre/70">
            Hypothèses : cotisations estimées à 22 % du chiffre d'affaires, marge de 15 % sur le tarif conseillé
            pour les impayés et les creux. Estimation indicative, pas un conseil comptable.
          </p>
          {sousPlancher && (
            <p className="mt-4 border-l-4 border-encre pl-3">
              Attention : à {eur(nAct)} par jour, tu factures sous ton tarif plancher. Chaque journée travaillée
              te coûte de l'argent.
            </p>
          )}

          <h2 className="mt-12 font-titre text-2xl font-extrabold">Ton message pour annoncer la hausse</h2>
          <div className="relative mt-4 border-2 border-encre bg-white p-4">
            <p>Bonjour,</p>
            <p className="mt-2">
              À compter du prochain mois, mon tarif journalier passe à {eur(Math.round(conseille / 10) * 10)}.
            </p>
            <div className="mt-3 space-y-2" aria-hidden="true">
              <div className="h-3 w-full bg-filet" /><div className="h-3 w-11/12 bg-filet" />
              <div className="h-3 w-4/5 bg-filet" /><div className="h-3 w-2/3 bg-filet" />
            </div>
            <p className="mt-4 font-semibold">La suite du message, avec 3 variantes de ton, est dans l'audit complet.</p>
          </div>

          <div className="mt-6 border-2 border-encre p-4">
            <p className="font-semibold">Audit complet : 49 €, paiement unique</p>
            <p className="mt-1 text-sm">Message complet en 3 versions, prêt à envoyer. Résiliation sans objet : un seul paiement.</p>
            {PAYMENT_LINK ? (
              <a href={PAYMENT_LINK} className="mt-4 block bg-encre px-5 py-4 text-center text-lg font-semibold text-white">
                Obtenir mon audit
              </a>
            ) : (
              <p className="mt-4 bg-filet px-5 py-4 text-center font-semibold">Paiement bientôt ouvert</p>
            )}
          </div>
        </section>
      )}
    </main>
  );
      }
