Vue.config.debug = true;
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

new Vue({
    el: '#app',
    data: {
        page: 1,
        page_limit: 10,
        page_limit_options: [5, 10, 25, 100],
        show_first:false,
        show_last:false,

        filter_text: '',

        sorting:'',
        sorting_order:'desc',

        poll_frequency: 0,
        data_source: 'internal',
        data_source_name: 'global_data',
        table_headers:['Id','Date','Edit','Name','Company','Actions'],
        data:[],
    },
    computed: {

        range_start: function() {
            return (this.page-1) * this.page_limit;
        },
        range_end: function() {
            return this.page * this.page_limit;
        },
        page_count: function() {
            return Math.ceil(this.tableData.length/this.page_limit);
        },
        pagination_range: function() {
            var start = this.page > 3 ? this.page-3 : 1;
            var end = this.page+3 > this.page_count ? this.page_count + 1 : this.page+3;
            return _.range(start, end);
        },
        next_page: function() {
            return this.page + 1 > this.page_count ?
                this.page_count :
            this.page + 1;
        },
        prev_page: function() {
            return this.page-1 > 1 ? this.page-1 : 1;
        },
        tableData: function() {
            this.data = _.sortBy( this.data, this.sorting.toLowerCase());
            if(this.sorting_order == 'asc'){
                this.data = this.data.reverse();
            }
            // Check if the filter text is present and filter based on that
            if(this.filter_text.length) {
                var filter_text = this.filter_text.toLowerCase();
                var filtered_data = this.data.filter(function(row) {
                    var rowValues = _.values(row);
                    var found = false;
                    rowValues.every(function(fieldValue) {
                        if(fieldValue.toString().toLowerCase().indexOf(filter_text) >= 0) {
                            found = true;
                            return false;
                        }
                        return true;
                    });
                    return found;
                });

                return filtered_data;
            }
            return this.data;
        },
        rowData: function() {
            return this.tableData.slice(this.range_start, this.range_end);
        }
    },
    methods: {
        changePage: function(event) {
            var el = event.target;
            var requestedPage = el.getAttribute('data-page');
            this.page = parseInt(requestedPage);
            if(this.page_count > this.page + 2){
                this.show_last = true;
            }else{
                this.show_last = false;
            }
            if(this.page > this.page_limit  ){
                this.show_first = true;
            }else{
                this.show_first = false;
            }
        },
        changeOrder:function(e){
            var el = e.target;
            var ordering = el.getAttribute('data-ordering');
            if(ordering == this.sorting){
                this.sorting_order = this.sorting_order == 'asc'?'desc':'asc';
            }else{
                this.sorting = ordering;
                this.sorting_order = 'desc';
            }

            console.log(this.sorting)
            console.info(this.sorting_order)
        },
        resetView:function(){
            if(this.page>this.page_count){
                this.page = this.page_count;
                this.show_first = true;
            }
            this.show_first = true;
            this.show_last = false;
        }
    },

    ready: function() {
        var that = this;
        var data_souce = this.data_source;
        var localStorageIntervel, ajaxInterval;
        switch(this.data_source) {
            case "local_storage":
                var poll_frequency = this.poll_frequency;
                localStorageIntervel = setInterval(function() {
                    var localStorageData = Lockr.get(this.data_source_name);

                }, poll_frequency);
            break;
            default:
                this.data = window[this.data_source_name];
                clearInterval(localStorageIntervel);
                clearInterval(ajaxInterval);
            break;
        }

        if(this.page_count > this.range_end){
            this.show_last = true;
        }
        this.sorting = this.table_headers[0]
        this.data = _.sortBy(this.data,this.sorting.toLowerCase());
        console.log(this.sorting);
    },
});