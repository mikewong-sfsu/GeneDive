/*
    View class
    Author: Brook Thomas

    The View class is the parent class for the various interactions views. 
    The View class is called by the Grouper after grouping is finished.

*/

class View {  
    initializeListeners() {
        $(document).on('highlighting-updated', function () {
            new TableView( Webdiggr.Highlight.highlighted );
            Webdiggr.GraphView.displayGraph( Webdiggr.Highlight.highlighted );
            $('.views').show();

            $('.result-count').html(`${Webdiggr.Highlight.highlighted.length} Results`);
            
        });
    }
}
