class Download {
  
  constructor ( button ) {
    this.button = $(button);

    this.button.on("click", ( event ) => {
      let zip = new JSZip();

      /* State File */
      let state = this.buildStateFile();
      zip.file("state.json", JSON.stringify(state));

      /* T&C File */
      zip.file("terms_and_conditions.txt", TERMS_AND_CONDITIONS);

      /* Graph Image */
      let png = this.fetchGraphImage();
      zip.file("graph.png", png, {base64: true});

      /* Graph Image */
      let csv = this.buildInteractionsData();
      zip.file("interactions.csv", csv);

      zip.generateAsync({type:"blob"})
        .then(function(content) {
          saveAs(content, "results.zip"); // via filesaver.js
      });

    });
  }

  buildInteractionsData() {
    let csv = "id, journal, article, pubmed_id, sentence_offset, gene1_id, gene1, gene2_id, gene2, sentence, highlighted, probability\n";
    
    GeneDive.filtrate.forEach( i => {
      let sentence = `${i.id},${i.journal},${i.article_id},${i.pubmed_id},${i.sentence_id},${i.geneids1},${i.mention1},${i.geneids2},${i.mention2},"${i.context}",${i.highlight},${i.probability}\n`;
      csv = csv.concat(sentence);
    });

    return csv;
  }

  buildStateFile() {
    let state = {};
    state["search"] = GeneDive.search.sets;
    state["minimumProbability"] = GeneDive.probfilter.getMinimumProbability();
    state["filters"] = GeneDive.textfilter.sets;
    state["highlighting"] = GeneDive.highlighter.input.val();
    return state;
  }

  fetchGraphImage() {
    return GeneDive.graph.graph.png({output:'base64'});
  }

}

const TERMS_AND_CONDITIONS = `
Privacy Policy

GeneDive has adopted a set of information management guidelines, which serve as
the basis for our relationship with our users. These guidelines have been developed
with the recognition that Internet technologies are rapidly evolving. Accordingly,
guidelines are subject to change. Any such changes will be posted on this page. If
the changes represent a material departure from our current practices with respect to
the use of personal information, the changes will be posted on this page thirty days
prior to taking effect and registered users will be notified via e-mail.

GeneDive is not responsible for the content or the privacy policies of Web sites
to which it may link.

What information does GeneDive gather about you?

You can peruse GeneDive examples without registration, and in that case no
information will be gathered, tracked or requested from you.

To scan your own data using GeneDive you need to register. Registration requires
you to submit the following mandatory information:


  Your e-mail (which is also used to send you results of your scan)

  Institution

  Title


The following optional information may also be submitted during registration


  Your permission to be contacted by GeneDive team

  Information on why are you using GeneDive

  Feedback and comments for us (e.g. how to improve GeneDive)


No cookies will be collected.

GeneDive may collect your IP address, for the purpose of performance monitoring
and to find users who need better performance and to advise them on possibility
download GeneDive desktop version and run it themselves.

GeneDive will not use IP address logs to track your session or your behavior on
our site.

How is the GeneDive user registration information protected?

User registration information is stored in GeneDive database, under the PW,
accessible only to GeneDive PI or his/her designee.

What does GeneDive do with the information it gathers?

Your institution information and your intended usage of GeneDive will be used
for grant reporting purposes, and for our better understanding of the user
population.

We will be sending you announcements of GeneDive changes, updates, new releases,
related workshops and conferences as well as advice on how to better use GeneDive.
This will also help you and us to form a GeneDive community where you can exchange
your experiences and ideas.

If you wish not to be contacted by GeneDive team, please send e-mail to
GeneDive webmaster requesting this change.

We will use your feedback and comments for continuous improvement of
GeneDive.

With whom does GeneDive share the information it gathers?

GeneDive does not share the information it gathers with anyone.

Compliance with Legal Process

We may disclose personal information if we are required to do so by law or we in
good faith believe that such action is necessary to


  Comply with the law or with legal process;

  Protect and defend our rights and property;

  Protect against misuse or unauthorized use of GeneDive; or

  Protect the personal safety or property of our users or the public (among other
  things, this means that if you provide false information or attempt to pose as
  someone else, information about you may be disclosed as part of any investigation
  into your actions).


Corrections and Opting-Out

Upon request, GeneDive will:


  Correct personal information that you state is erroneous; or

  Permit you to "opt out" of further e-mail contact
`;

