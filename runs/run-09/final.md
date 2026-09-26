**Everything's in `./project`.** Start with `README.md` → `docs/brief.md`.

The headline finding: this timing is unusually good. Google killed cloud support for 1st/2nd-gen Nest thermostats on Oct 25, 2025 (11 months ago), and every Nest thermostat's smart features require a Google account — but the current 4th-gen (2024) hardware actually has an *official* local-control channel via Matter, and a live open-source project (NoLongerEvil-Thermostat, MIT) already jailbreaks the orphaned old units. Nobody's built the "smart" layer — learning schedule, presence detection, energy history — on top of either.

The proposed plan (docs/brief.md): **Homestat**, Apache-2.0, a local-first thermostat brain that drives three interchangeable backends — Matter for Nest 4th gen, NoLongerEvil for orphaned 1st/2nd gen, and plain ESP32+relay for open DIY hardware — rather than one more single-hardware hack.

Two things worth your attention before this goes further:
1. **Charter assumptions are unconfirmed** — I assumed public/open-source audience, Apache-2.0, intermediate technical comfort, etc. since you said to make the calls myself. Check `docs/charter.md`'s "Open questions" if any of those are wrong.
2. **Proxy access was blocked** to several primary domains (google.com, tomshardware.com, nolongerevil.com), so most dossier claims are tagged `reported` (search snippets) rather than `confirmed` — disclosed at the top of the dossier, with a re-verify list before this goes to Prototype mode.

Next step when you're ready: move to Prototype mode to build a real core loop, starting with confirming whether Nest 4th-gen Matter commissioning truly needs zero Google touch.
