# review checklist

run through these before a change ships.

1. could a non-technical friend follow the page diff? nothing should read
   like marketing.
2. `python3 tests/check.py` is green: tags balance, local assets exist,
   and every `#anchor` lands somewhere.
3. look at the changed page in a light and a dark theme. body and
   secondary text keep their contrast.
4. pages agree. a nav, footer or theme change touched index, guides and
   help together.
5. still no build step. the only thing fetched at load is the GitHub star
   count, and it's fine for that to fail.
