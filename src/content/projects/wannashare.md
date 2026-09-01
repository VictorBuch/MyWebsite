---
title: WannaShare
tagline: Split expenses effortlessly with anyone.
year: "2024—now"
role: Solo developer — product, frontend, backend, infra
stack: ["Flutter", "Dart", "Riverpod", "Go", "PocketBase", "Firebase", "Nix"]
accent: poppy
order: 1
repo: https://git.victorbuch.com/Smoothless/WannaShare
problem: >-
  Shared households and trips generate a running ledger nobody wants to keep.
  Existing splitters make you re-enter the same rent every month, and the
  conversation about a cost lives in a different app than the cost itself.
outcome: >-
  565 commits and 22 releases in, shipping to iOS and Android at v1.27.2.
  Groups, automatic settlement, live sync, recurring rules and in-app chat all
  run against a self-hosted Go and PocketBase backend I operate myself.
placeholder: false
---

## The shape of the problem

Splitting money between people is not an arithmetic problem — the arithmetic is
trivial. It is a bookkeeping and trust problem. The ledger has to stay correct
while several people edit it at once, the settlement has to be explainable, and
the discussion about an expense has to sit next to the expense.

## What I built

WannaShare is a Flutter app on a Go and PocketBase backend, both of which I
wrote and both of which I host. Groups are created from a link, expenses split
evenly, by exact amount or by percentage, and the app resolves the debt graph
down to the fewest payments that settle it. Real-time sync keeps every
participant's balance current, and each group carries its own chat thread so an
expense and the argument about it live in one place.

Recurring rules cover the costs that repeat — rent, subscriptions, utilities —
so the monthly ledger fills itself in and can be paused rather than deleted
when a flatmate moves out.

## The part that was actually hard

Currency. A group in Prague splitting in CZK while one member thinks in DKK
means every balance is two numbers, and rounding has to be resolved once, at
settlement, rather than accumulating drift across dozens of expenses.

## Running it

The backend, the git forge the source lives on, and the release pipeline all
run on my own hardware. Go 1.27 and PocketBase 0.40.1 behind my own networking
and user management — the same homelab that hosts everything else I run.
