## Identity

**Target: Nest Learning Thermostat**, made by Google Nest (originally Nest Labs, acquired by Google in 2014). No naming collision here — it's the one smart thermostat with that name. I'll proceed on that basis.

## The hardware reality (read this before we scope)

"Open source the Nest thermostat" splits into two very different projects, and it matters which one you mean:

1. **Reflash your existing Nest hardware to run open firmware.** Not realistic. Modern Nest thermostats (2nd-gen onward) have a locked, signed bootloader — there's no legitimate way in without circumventing DRM/anti-circumvention protections, which is both legally risky and not something I'll help build. (Very old 1st-gen units had a brief rooting scene over a decade ago; that door is closed on anything current.)

2. **Build a new, open thermostat that does Nest's job — auto-scheduling, learning-ish behavior, a nice app, energy history — fully locally, no Google account, no cloud dependency, ever.** This is the realistic and genuinely buildable path, and it's exactly what "local control without Google" is really asking for. It'd run on off-the-shelf hardware (ESP32 + standard HVAC relay/sensor modules), with local firmware (ESPHome or custom) and integrate natively with Home Assistant/Matter, with a self-hosted app as the "Nest app" replacement.

I'm assuming **path 2** is what you want — an open, self-hosted alternative you install in place of (or instead of buying) a Nest, not a jailbreak. Let me know if you actually meant something narrower, like just "a local dashboard for the Nest thermostat I already own" (which is a much smaller, murkier project since it depends on reverse-engineering Nest's local network protocol — Google shut off the old local API in 2019, and it's had no public support since).

A few quick questions to scope this before I start the charter/research:

1. **Do you already own HVAC equipment/wiring you want to control**, or is this more of a "design a thing others could build too" project? (Affects whether we need real wiring docs/safety guidance now or can stay software-first initially.)
2. **Hardware comfort**: are you comfortable soldering/flashing an ESP32-class board yourself, or do you want this designed so a non-technical person could buy a kit and install it?
3. **Scope for v1**: core loop only (schedule + manual control + local app/HA integration), or do you also want the "learning" behavior (auto-adjusting schedule from usage patterns) in the first pass?
4. Is this just for your own home, or do you want it buildable/forkable by others (public repo, docs, etc.)?
