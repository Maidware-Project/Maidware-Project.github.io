# review checklist

run through these before a change ships.

1. could a non-technical friend follow the page diff? nothing should read
   like marketing.
2. `python3 tests/check.py` is green: tags balance, local assets exist,
   and every `#anchor` lands somewhere.
3. look at the changed page in a light and a dark theme. body and
   secondary text keep their contrast.
4. pages agree. a nav, footer or theme change touched index, guides and
   contributions together.
5. still no build step, and nothing is fetched at load - no api, no
   counters, no analytics. the stats on the contributions page are
   plain text written down by hand.
