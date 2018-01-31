**IssueURL:** https://github.com/brookthomas/GeneDive/issues/3
**Issue:** Page hangs when loading search suggestions
**Date:** 2018-01-27
**URL:** https://www.genedive.net/search.php
**Severity:** medium
**Frequency:** consistent
**Steps to reproduce:**
  1. Click on the Gene Symbol field
  1. Type in a few characters

**Solution/workaround:** None attempted.
**Time spent:** 10 Minutes


**IssueURL:** https://github.com/brookthomas/GeneDive/issues/4
**Issue:** Stuck loading
**Date:** 2018-01-27
**URL:** https://www.genedive.net/search.php
**Severity:** low
**Frequency:** inconsistent
**Steps to reproduce:**
  1. Search for the gene AA with 1-Hop and 0.7 Minimum Probability
  1. Change the Minimum Probability to 1.0
  1. In Filter Results, select Journal is PLOS Genetics and click Add. It appears adding or removing filters also causes thi

**Solution/workaround:** Change Minimum Probability or performing a new search will get out of the loading.
**Time spent:** 20 Minutes


**IssueURL:** https://github.com/brookthomas/GeneDive/issues/5
**Issue:** Changing filters or Highlights while No Results Found shows previous results
**Date:** 2018-01-27
**URL:** https://www.genedive.net/search.php
**Severity:** medium
**Frequency:** consistent
**Steps to reproduce:**
  1. Search for the gene AA with 1-Hop and 0.7 Minimum Probability
  1. Change the Minimum Probability to 1
  1. Several things can be done to trigger this problem: type in "123" into Highlight Rows, or click on Gene Pair or Article under Group Tables By.

**Solution/workaround:** Added to controller.js the method noResultsFound() that checks for results and hides elements, and had it called in two places
**Time spent:** 2 hours


**IssueURL:** https://github.com/brookthomas/GeneDive/issues/6
**Issue:** Changing the height of the map makes the mouse not click properly
**Date:** 2018-01-27
**URL:** https://www.genedive.net/search.php
**Severity:** high
**Frequency:** consistent
**Steps to reproduce:**
  1. Perform a search for 1-Hop AAS with 0.67 Probability
  1. Click and drag the results divider up or down
  1. Hold shift and left click in the graph. Take note of where the click confirmation appears.

**Solution/workaround:** Call the resize() method on the graph everytime the splitter is moved.
**Time spent:** 1.5 hours


**IssueURL:** https://github.com/brookthomas/GeneDive/issues/7
**Issue:** Console produces errors when changing filters or highlighting rows for no results
**Date:** 2018-01-30
**URL:** https://www.genedive.net/template.php
**Severity:** low
**Frequency:** consistent
**Steps to reproduce:** 
  1. Search for gene ABCA1 with 1-Hop
  1. Set Minimum Probability to 1. There should be no results.
  1. Under Filter Results, add any filter like "Excerpt is 123", or type anything into Highlight Rows
**Solution/workaround:** None Yet
**Time spent:** 10 minutes


**IssueURL:** https://github.com/brookthomas/GeneDive/issues/8
**Issue:** Graph is zoomed in too close when searching
**Date:** 2018-01-31
**URL:** https://www.genedive.net/template.php
**Severity:** low
**Frequency:** consistent
**Steps to reproduce:** 
  1. Do a search with at least 1 result