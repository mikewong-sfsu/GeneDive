var Webdiggr = {
    QueryInput: new QueryInput(),
    QueryResults: new QueryResults(),
    FilterControls: new FilterControls(),
    GraphView: new GraphView(),
    Grouper: new Grouper(),
    Highlight: new Highlight(),
    View: new View(),
    GraphSearch: new GraphSearch(),
    Clique: new Clique(),
    OneHop: new OneHop(),
    OneHopFriends: new OneHopFriends(),
    OneHopBridges: new OneHopBridges(),
    firstSearch: true,
    tabTable: $('#results'),
    tabGraph: $('#graph-results'),
    blobForDownoad: undefined,
    blobDownloadURL: undefined
};

var html = {
    table: $('<table>'),
    thead: $('<thead>'),
    tbody: $('<tbody>'),
    th: $('<th>'),
    tr: $('<tr>'),
    td: $('<td>'),
    div: $('<div>'),
    span: $('<span>'),
    a: $('<a>'),
    p: $('<p>')
};

$(document).ready(function() {
    Webdiggr.QueryInput.initializeTypeahead();
    Webdiggr.QueryInput.initializeListeners();
    Webdiggr.FilterControls.initializeListeners();
    Webdiggr.Grouper.initializeListeners();
    Webdiggr.Highlight.initializeListeners();
    Webdiggr.View.initializeListeners();
    Webdiggr.Clique.initializeListeners();
    Webdiggr.OneHop.initializeListeners();
    Webdiggr.OneHopFriends.initializeListeners();
    Webdiggr.OneHopBridges.initializeListeners();
    $('.view-controller').hide();
    $('.views').hide();
    //alertify.logPosition("top left");
});

$(document).on('search-updated', () => { 
    if ( Webdiggr.firstSearch ) {
        $('.views').show();
        $('.view-controller').show();
        Webdiggr.firstSearch = false;
    } 

    $('#graph-view-area').hide();
    $('#graph-converging-spinner').show();
});

// Probably a temporary measure
$(document).on('highlighting-updated', () => {
    $('#graph-view-area').hide();
    $('#graph-converging-spinner').show();
});


$(document).on('converged.graph', () => {
    $('#graph-converging-spinner').hide();
    $('#graph-view-area').show();
});


/* Tab View Controllers */
$('#show-view-table').on('click', function () {
    if ($(this).hasClass('active')) { return; }

    // Cycle Views
    $('#graph-results').hide();
    $('#results').show();

    // Cycle Buttons
    $('#show-view-graph').removeClass('active');
    $(this).addClass('active');
});

$('#show-view-graph').on('click', function () {
    if ($(this).hasClass('active')) { return; }

    // Cycle Views
    $('#results').hide();
    $('#graph-results').show();

    // Cycle Buttons
    $('#show-view-table').removeClass('active');
    $(this).addClass('active');

});
