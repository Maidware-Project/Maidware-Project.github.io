# Review checklist - pass all five before any change ships

1. **Plain words.** Could a non-technical friend follow the page diff
   with no help? Nothing reads like marketing.
2. **Every link works.** `python3 tests/check.py` green - tags balance,
   local assets exist, every `#anchor` lands somewhere.
3. **Readable in every theme.** Check the changed page in a light and a
   dark theme; body and secondary text keep their contrast.
4. **Pages agree.** A nav, footer or theme change touched index, guides
   and help together - no page left behind.
5. **Still no build step.** Plain files, nothing fetched at load beyond
   the GitHub star count, which fails away quietly.
