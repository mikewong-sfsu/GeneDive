GeneDive User Documentation                         {#howtouse}
============

This documentation is geared towards scientists who intend to use GeneDive for their research purposes.

### Contents
 * [Overview](#overview)
 * [Features](#features)
 * [Terminology](#terminology)
 * [Usage](#usage)
	* [Registration and Login](#regist)
 	* [Searching](#searching)
 	* [Results](#results)
 	* [Graph](#results)
 * [Support](#support)
 * [License](#license)

<a name="overview"></a>
## Overview

### DGR Interaction %Search and Visualization Tool

GeneDive is a web application designed to allow easy lookup, visualization, and exporting of gene, chemical, and disease relationships. The relationships are probabilities based on how closely they are connected grammatically in articles from PLOS One, PLOS Biology, and PLOS Genetics.

GeneDive is a collaborative project between the San Francisco State University Department of Computer Science and Stanford Bioengineering.

<a name="features"></a>
## Features

* %Search for Genes, Chemicals, Diseases, and Genesets
* Data is presented as both a Table and Graph
* Autocomplete search for quick lookup
* Advanced client-side filtering that can be modified on the fly
* Exporting the current state of the site and state history and the data presented.

<a name="terminology"></a>
## Terminology
 * **DGR** All entities on this site are referred to as "DGR", short for Disease (D) Gene (G) Chemical (R)
 * **Confidence** A number from 0 to 1 that represents a percentage of "confidence" that two DGRs interact with each other.

<a name="usage"></a>
## Usage

<a name="regist"></a>
### Registration and %Login

To register for the site, click Register on the front page and fill out the appropriate forms. You will then be able to login with your information, and be redirected to the search page.

<a name="searching"></a>
### Searching
<div style="float: right;margin-left:10px"> 
![Show search area](img/readme/search_area.png)
</div>

When you successfully login, you will be presented with a large area in the center-right of the screen for results, along with a search and filter panel on the right side. We will first go over the features of the panel from top to bottom.

#### %Search Panel
* **GeneDive title**

    A link that takes you back to the login page.

* **Undo and Redo**

	These buttons allow you to undo and redo your actions on the site. If there is no action to undo or redo, the buttons will be disabled. This is a valuable tool since you can do expiromentation with the system, then click undo or redo at any time. 

* **1-Hop, 2-Hop, 3-Hop, Clique** 

	The four choices, 1-Hop, 2-Hop, 3-Hop, and Clique will determine how a search is conducted for the DGRs that a user enters.

	**1-Hop:** This will search for results that are directly interacting with one another. If 1 item is selected, then all direct interactions with that one item will be presented. If more than one item is selected, then only direct interactions with those items will be shown.  
	**2-Hop:** This search will present results whom mutually interact with the same items. The intermediates will be highlighted in orange. This requires more than 1 item to be specified.  
	**3-Hop:** This search will present results whom's direct interactions mutually interact with each other. The intermediates will be highlighted in orange.  This requires more than 1 item to be specified.  
	**Clique:** Similar to 1-Hop, except only the results that are 1 jump away from the search that are related to one another will be presented. You are limited to one item at a time when in this search mode.  

* <b>%Search Bar</b>

	This will accept any string input. Upon typing in your query, GeneDive will lookup the query amongst Genes, Chemicals, Diseases, and Genesets, and present the findings below the search field, which you can either click on or use the arrow keys and hit enter to select.  

	More than one item can be selected from the list, but only if you are choosing 1, 2, or 3-Hops. Clique does not support mulitple item selection.  


* **Minimum Confidence**

	This option allows you to choose the threshold for the confidence of gene interactions. By default, new searches start at 0.7 to present the user with a decent selection of results. Lowering this value will present more results, but will increase increase waiting time as more data has to be retrieved from the server and processed locally. Increasing this value will give better results.

	The Confidence Cutoffs can be clicked to set the Minimum Confidence with the following values: Low 0.7 | Medium 0.85 | High: 0.95  

	*Tip: If it's taking a long time to load the results, you may change the confidence level, DGRs, or Hop/Clique selection to stop the current search and start a new one.*


* **Filtering**

	You can further filter results down by Article, Exerpt, Gene, Journal, and Section. Upon adding an "is" filter, all results not containing the filter will be hidden. If you add a "not" filter, any results matching the filter's value will be hidden.


* <b>%Highlight Rows</b>

	When you enter strings in here, any results that contain that contain that value in their data will be highlighted in the table view. Edges will also be highlighted in the graph view.


* **Group Table Results By**

	The Interactions are grouped by unique DGR interactions by default. Clicking on group by Article will group the interactions by Article instead.


* **Download Results**

	This allows you to save the following: State history (undo, redo), a picture of the graph as it currently is, the results table in csv format, the terms and conditions, and a custom README file containing a note that you specify when you click Download Results. All this data will be stored in a zip file with its name containing the current timestamp.  


* **Upload Results**

	If you upload the zip file you downloaded from Download Results, the website will be restored to the exact state that it was when that file was downloaded. The website will also have the state history, allowing you to click undo and redo if applicable.  


<a name="results"></a>
### Table

The majority of screen space is taken up in the middle by the results. On the top is a table of the results, and the bottom a graph.

**Grouped Results Table**  
The results here are grouped by DGR interactions by default. You can group them by article interactions by clicking on Articles at the bottom of the %Search area, under Group Table Results By. You can sort the table by clicking the small, black arrows next to each field header. If there is only one visible arrow, then the table is sorted by that column. Down arrow means descending, up arrow means ascending.

*TIP: You can sort by multiple rows by holding shift when click on the headers.*

* <b>\+</b>  
A link you can click to see the details. The entire row is also clickable.

* **DGR** **DGR** (DGD Pair grouping only)  
The interacting pair of DGRs. The right one is alphabetically smaller than the left one.

* **Article** (Article grouping only)  
The specific Article ID that the interactions we found in.

* **DGR Pairs** (Article grouping only)  
How many unique pairs are found in that Article

* <b># Interactions</b>  
How many interactions that group has.

* <b># Articles** (DGD Pair grouping onl</b>  
How many articles that group has.

* <b># Conf Scr Dist</b>  
The Confidence Score Distribution of that group. When more than one interaction is in that group, a histogram is displayed showing the distrubition of probabilities from 0 to 1. The graph is a distribution, not a count, so the bars do not represent the amount of interactions, just how they're distributed.

* **Max Conf Scr**  
The Maximum Confidence Score in that grouping.

* **Sample Excerpt**  
This an excerpt selected from the highest confidence scored interaction in the group.

![Grouped results](img/readme/results_grouped.png)

**Detailed Results Table**  

Clicking on a table row will present you with all the interactions of that group. The columns have the same meaning as in the Grouped Results Table, except for the following.

* **Journal**  
The Journal from which the Article came from.

* **Article ID**  
The Article from where the interaction was found.

* **Excerpt**  
The actual excerpt from the article for that interaction.

* **Pubmed**  
A link to the article on Pubmed.

To go back to the grouped results, click the Back button at the top right.



![Expanded results](img/readme/results_detailed.png)

<a name="graph"></a>
### Graph 
The graph below the table presents a visual representation of the DGR interactions. The thickness of an edge represents how many interactions between the DGR there are in the articles. The color of the node corresponds to the colors of the search items, located under the search bar.

<div style="display:inline-block">![Search with same colors](img/readme/graph_color_results_search.png)</div> <div style="display:inline-block">![Graph with multiple items search, showing the correlation between color of nodes and the searches](img/readme/graph_color_results_graph.png)</div> 

The graph can also be visually modified in a number of ways, along with being used to alter your search parameters.

* Moving nodes: Click on a node, then drag it to reposition the node.
* Zoom: Use your mouse wheel, or your zoom feature on your trackpad, to zoom in and out.  
* Add to search: You can add DGRs to your search by holding shift, then clicking each of the nodes you want to add. Keep holding shift until you have selected all the DGRs you would like to add. Upon letting go of shift, the new search will be made.  
* New %Search (replace): You can do a brand new search for 1 DGR, by holding CTRL and clicking on a node. Upon clicking on a node, a new search will immediately be made. If you are in 2-hop or 3-hop mode, the search will be switched to 1-hop

<a name="support"></a>
## Support

<a name="license"></a>
## License